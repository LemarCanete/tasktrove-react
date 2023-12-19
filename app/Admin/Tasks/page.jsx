'use client'
import React, { useEffect, useState } from 'react'
import { useCookies } from 'react-cookie'
import { useRouter } from 'next/navigation'

import { BsSearch, BsPen, BsTrash } from 'react-icons/bs'

// Pages
import SideNav from '@/app/Admin/Components/SideNav'
import axios from 'axios'

const page =() =>{
    const [search, setSearch] = useState("")
    const [allTasks, setAllTask] = useState([])
    const [allTeams, setAllTeams] = useState([])
    const [allUsers, setAllUsers] = useState([])

    const router = useRouter();
    const [cookies] = useCookies(['id', 'role']);
    const id = cookies['id'];
    const role = cookies['role']

  // If the 'id' cookie is not present, redirect to the login page
  useEffect(()=>{
    if (id === undefined) {
        router.push('/');
        return null;
      }

    if(role === "user"){
        router.push('/Dashboard')
    }

    const fetchData = async () =>{
        try{
            let tasks;
            if(search === "" || search === undefined){
                tasks = await axios.get('https://tasktrove-server.onrender.com/getAllTasks')
            }else{
                tasks = await axios.get(`https://tasktrove-server.onrender.com/searchTasks/${search}`)
            }

            const teams = await axios.get('https://tasktrove-server.onrender.com/getAllTeams')
            const users = await axios.get('https://tasktrove-server.onrender.com/getAllUsers')
            console.log(tasks);
            setAllTask(tasks.data)
            setAllTeams(teams.data)
            setAllUsers(users.data);
        }catch(err){
            console.log(err);
        }
    }
    fetchData()
  }, [search])

  return (
    <div className="container-fluid d-flex p-0" style={{overflow: "hidden", height: "100vh"}}>
    {console.log(allTasks)}
      <SideNav active="Admin/Tasks"/>
      <div className='d-block w-100 content-wrapper'>
        <div className='p-3'>
            <h3>All Tasks</h3>
            <div id="search" className="input-group input-group-lg mt-3 w-100">
                <BsSearch className="fa-solid fa-magnifying-glass position-absolute mt-3 ms-2 z-1 fs-5"/>
                <input type="text" className="ps-5 form-control rounded-0 bg-transparent" onChange={(e)=> setSearch(e.target.value)}/>
            </div>

            <div className="p-3 mt-3">
                <table className="table table-hover">
                    <thead>
                        <tr>
                            <th className="" scope='col'> </th>
                            <th className="" scope='col'>Task name</th>
                            <th className="" scope='col'>Description</th>
                            <th className="" scope='col'>Team</th>
                            <th className="" scope='col'>Priority</th>
                            <th className="" scope='col'>Assign to</th>
                            <th className="" scope='col'>START DATE</th>
                            <th className="" scope='col'>Deadline</th>
                            <th className="" scope='col'>Status</th>
                            {/* <th className="" scope='col'>ACTION</th> */}
                        </tr>
                    </thead>
                    <tbody>
                        {allTasks.map((task, index) => {
                            let team;
                            let assignTo;
                            for(const i of allTeams){
                                if(i._id === task.team_id) team = i;
                            }
                            for(const i of allUsers){
                                if(i._id === task.assignTo) assignTo = i;
                            }
                            return(
                                <tr key={index}>
                                    <td>{index + 1}</td>
                                    <td>{task.taskName}</td>
                                    <td>{task.description}</td>
                                    <td>{team.teamName}</td>
                                    <td>{task.priority}</td>
                                    <td>{assignTo.firstName} {assignTo.lastName}</td>
                                    <td>{task.createdAt.split("T")[0]}</td>
                                    <td>{task.deadline.split("T")[0]}</td>
                                    <td>{task.status}</td>
                                    {/* <td >
                                        <BsPen color='green' style={{cursor: "pointer", zIndex: 100}} data-bs-toggle="modal" data-bs-target="#updateUser" onClick={()=>setUpdateUserId(user._id)}/>
                                        <BsTrash color='red' style={{cursor: "pointer", zIndex: 100}} data-bs-toggle="modal" data-bs-target="#deleteUser" onClick={()=>setDeleteUserId(user._id)}/>
                                    </td> */}
                                </tr>
                            )
                        })}
                    </tbody>
                </table>
            </div>
        </div>
      </div>
    </div>
  );
}

export default page