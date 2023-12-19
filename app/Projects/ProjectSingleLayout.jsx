'use client'
import React, { useEffect, useState } from 'react'
import { BsPencilFill, BsTrashFill } from 'react-icons/bs'
import { useRouter } from 'next/navigation'
import axios from 'axios'
import UpdateProject from './UpdateProject'
import { useCookies } from 'react-cookie'
import DeleteProject from './DeleteProject'

const ProjectSingleLayout = ({name, description, createdAt, teamName, project_id, leader_id, teamMembers, project, teams}) => {
    const router = useRouter()
    const start_date = createdAt.split("T")[0]
    const [leader, setLeader] = useState({})
    const [members, setMembers] = useState([]);
    const [tasks, setTasks] = useState([])
    const [cookies] = useCookies(['id']);
    const id = cookies['id'];
    const isLeader = (leader_id === id)

    useEffect(()=>{
        const fetchData = async() =>{
            const leaderRes = await axios.get(`https://tasktrove-server.onrender.com/getUser/${leader_id}`)
            setLeader(leaderRes.data)

            if(teamMembers.length !== 0){
                const membersRes = await axios.get(`https://tasktrove-server.onrender.com/getMembersInfo/${teamMembers}`)
                setMembers(membersRes.data)
            }

            if(project_id){
                const tasksOfProjects = await axios.get(`https://tasktrove-server.onrender.com/getTasks/${project_id}`)
                setTasks(tasksOfProjects.data)
            }
        }

        fetchData(teamMembers)
    }, [])
    return (
        <div className='bg-white p-3 m-2 border border-primary mx-5 shadow' style={{cursor: "pointer"}} id='projectSingle'>
            <div className="d-flex justify-content-between">
                <strong className='h4'>{name}</strong>
                {isLeader && <div className="">
                    <UpdateProject cl='bg-light border-0 rounded m-1' btn={<BsPencilFill color='gray' />} projectInfo={project} teamName={teamName} teamsInfo={teams}/>
                    <DeleteProject project={project} deleteButton={<BsTrashFill color='white'/>} className="bg-danger border-0 rounded m-1"/>
                </div>}
            </div>
            <div className='body' onClick={() => router.push(`/Projects/${project_id}`)}>
                <p>{description}</p>
                <hr />
                <div className="d-flex justify-content-around py-0 my-0">
                    <div className='border-end px-5'>
                        <small className='text-secondary'>START DATE</small>
                        <p>{start_date}</p>
                    </div>
                    <div className='border-end px-5'>
                        <small className='text-secondary'>TEAM</small>
                        <p>{teamName}</p>
                    </div>
                    <div className='border-end px-5'>
                        <small className='text-secondary'>NUM OF TASKS</small>
                        <p>{tasks.length}</p>
                    </div>
                    <div className='border-end px-5'>
                        <small className='text-secondary'>LEADER</small>
                        <p>{leader && leader.firstName} {leader && leader.lastName}</p>
                    </div>
                    <div className='px-5'>
                        <small className='text-secondary'>MEMBERS</small>
                        <div className='d-flex w-100 justify-content-around'>
                            {members && members.map(member => {
                                console.log(member);
                                return <div className='bg-primary m-0 rounded-circle' style={{height: "26px", width: "26px"}}>
                                    <p className='text-white text-center m-0'>{member.firstName.substring(0, 2)}</p>
                                </div>
                            })}
                        </div>
                    </div>
                </div>

            </div>
        </div>
    )
}

export default ProjectSingleLayout