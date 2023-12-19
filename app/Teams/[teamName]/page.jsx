'use client'
import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import axios from 'axios'
import { useCookies } from 'react-cookie'

//icons
import { BsArrowLeftCircle } from 'react-icons/bs'

//pages
import { SideNav } from '@/app/components'
import DeleteTeamMember from "./DeleteTeamMember"

const page = ({ params }) => {
    const [allUsers, setAllUsers] = useState([]);
    const [addUser, setAddUser] = useState("")
    const [teamMembers, setTeamMembers] = useState([]);
    const [leader, setLeader] = useState([])
    const [team, setTeam] = useState(null)
    const teamName = decodeURIComponent(params.teamName || '')
    const [cookies] = useCookies(['id']);
    const current_user = cookies['id'];
    const isLeader = (current_user === leader._id || false)
    const [search, setSearch] = useState("")
    const [tasks, setTasks] = useState([]);

    useEffect(()=>{
        const fetchData = async ()=>{
            try{
                // GET ALL USERS
                const users = await axios.get('https://tasktrove-server.onrender.com/getAllUsers')
                setAllUsers(users.data.filter(user => user.role !== "admin" && user._id !== current_user))

                //GET TEAM
                const teamRes = await axios.get(`https://tasktrove-server.onrender.com/getTeam/${teamName}`);
                setTeam(teamRes.data[0])

                //GET LEADER
                const leader = await axios.get(`https://tasktrove-server.onrender.com/getLeaderInfo/${teamRes.data[0].leader_id}`)
                setLeader(leader.data[0]);
               
                if(teamRes.data[0].members.length === 0) return
            
                //GET TEAM MEMBERS FROM THE TEAM
                const members = await axios.get(`https://tasktrove-server.onrender.com/getMembersInfo/${teamRes.data[0].members}`)
                setTeamMembers(search === "" ? members.data : members.data.filter(member => member.userName.toLowerCase().includes(search.toLowerCase()) || 
                member.userName.includes(search)))

                //GET ALL TASKS
                const tasksRes = await axios.get(`https://tasktrove-server.onrender.com/getAllTasks`)
                setTasks(tasksRes.data)
            }catch(err){
                console.log(err);
            }
        }
        fetchData()
        
    }, [search])
    

    const handleAddUser = (e) =>{
        e.preventDefault()
        if(addUser === "") return
        axios.post(`https://tasktrove-server.onrender.com/addUserToTeam`, {addUser, teamName})
        .then(res =>{
            console.log(res);
            setTeam(res.data);
            setAddUser("")
            window.location.reload()
        })
        .catch(err =>{
            console.log(err);
        })
    }



    return (
        <div className='container-fluid d-flex p-0 flex' style={{overflow: "hidden", height: "100vh"}}>
            <SideNav active="Teams"/>
            <div className='d-block w-100 p-3 content-wrapper'>
                <Link href="/Teams"><BsArrowLeftCircle className='fs-2'/></Link>
                <h3 className='p-3 text-center'>Team {teamName}</h3>
                {leader._id && isLeader && <form className='d-flex mt-3' onSubmit={handleAddUser}>
                    <div className="w-100 me-4">
                        <input className="form-control" list="datalistOptions" placeholder="Type to add member..." onChange={e => setAddUser(e.target.value)}/>
                        <datalist id="datalistOptions">
                            {allUsers.map(user => {
                                return <option  value={user._id} key={user._id} onChange={e => setAddUser(e.target.value)}>{`${user.firstName} ${user.lastName}`}</option>
                            })}
                        </datalist>
                    </div>
                    {(isLeader) && <button type="submit" className='btn btn-info'>Add</button> }
                </form>}
                
                <div className='mt-3'>
                    {/* leader table */}
                    <label htmlFor="#leader" className='fst-italic text-secondary my-3'>leader</label>
                    <table className="table table-hover table-striped table-bordered" id='leader'>
                        <thead>
                            <tr>
                                <th className="">NAME</th>
                                <th className="">USERNAME</th>
                                <th className="">EMAIL ADDRESS</th>
                            </tr>
                        </thead>
                        <tbody className='row-bordered'>
                            <tr>
                                <td>{leader.firstName + " " + leader.lastName} {leader._id && isLeader && <em className='fw-lighter'> (You)</em>}</td>
                                <td>{leader.userName}</td>
                                <td>{leader.emailAddress}</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
                <div className='mt-5'>
                    <div className='d-flex justify-content-between my-3 align-items-center'>
                        <label htmlFor="#members" className='fst-italic text-secondary'>members</label>
                        <input type="text" placeholder='search username' className=' bg-transparent form-control me-2 w-25' onChange={(e) => setSearch(e.target.value)}/>
                    </div>
                    {/* members table */}
                    <table className="table table-hover table-striped table-bordered" id='members'>
                        <thead>
                            <tr>
                                <th className="text-center">NAME</th>
                                <th className="text-center">USERNAME</th>
                                <th className="text-center">EMAIL ADDRESS</th>
                                <th className="text-center">ASSIGNED TASKS</th>
                                <th className="text-center">COMPLETED TASKS</th>
                                <th className='text-center'>OVERDUED TASKS</th>
                                <th className='text-center'>IN PROGRESS</th>
                                {(leader._id && isLeader) && <th className='text-center'>REMOVE</th>}
                            </tr>
                        </thead>
                        <tbody className='row-bordered'>
                            {teamMembers.map((member)=>{
                                const assignedTasks = tasks.filter(task => task.assignTo === member._id && task.team_id === team._id)
                                const completed = tasks.filter(task => task.assignTo === member._id && task.status === "Completed" && task.team_id === team._id)
                                const late = tasks.filter(task => task.assignTo === member._id && task.status === "Late" && task.team_id === team._id)
                                const inProgress = tasks.filter(task => task.assignTo === member._id && task.status === "In Progress" && task.team_id === team._id)
                                return(
                                    <tr key={member._id} className=''>
                                        <td>{member.firstName + " " + member.lastName} {current_user && (current_user === member._id) && <em>(You)</em>}</td>
                                        <td>{member.userName}</td>
                                        <td>{member.emailAddress}</td>
                                        <td className='text-center'>{assignedTasks.length}</td>
                                        <td className='text-center'>{completed.length}</td>
                                        <td className='text-center'>{late.length}</td>
                                        <td className='text-center'>{inProgress.length}</td>
                                        {isLeader &&  <td className ='text-center' style={{cursor: "pointer"}}><DeleteTeamMember member={member} teamName={teamName}/></td>}
                                    </tr>
                                )
                            })}
                            
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    )
}

export default page