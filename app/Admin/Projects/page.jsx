'use client'
import React, { useEffect, useState } from 'react'
import { useCookies } from 'react-cookie'
import { useRouter } from 'next/navigation'
// Pages
import SideNav from '@/app/Admin/Components/SideNav'
import { BsPencilFill, BsSearch, BsTrashFill } from 'react-icons/bs'
import axios from 'axios'

const page = () => {
    const [search, setSearch] = useState("")
    const [projects, setProjects] = useState([])
    const [teams, setTeams] = useState([])
    const [users, setUsers] = useState([]);
    const [tasks, setTasks] = useState([])

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

    const fetchData = async() =>{
        try{
            const projectsRes = await axios.get(`https://tasktrove-server.onrender.com/getAllProject`)
            setProjects((search === "") ? projectsRes.data: projectsRes.data.filter(proj => proj.projectName.toLowerCase().includes(search.toLowerCase()) || 
            proj.projectName.includes(search)))

            const teamsRes = await axios.get(`https://tasktrove-server.onrender.com/getAllTeams`)
            setTeams(teamsRes.data)

            const usersRes = await axios.get(`https://tasktrove-server.onrender.com/getAllUsers`)
            setUsers(usersRes.data)

            const tasksRes = await axios.get(`https://tasktrove-server.onrender.com/getAllTasks`)
            setTasks(tasksRes.data)

        }catch(err){
            console.log(err);
        }
    }
    fetchData()
  }, [search])

  return (
    <div className="container-fluid d-flex p-0" style={{overflow: "hidden", height: "100vh"}}>
      <SideNav active="Admin/Projects"/>
      <div className='d-block w-100 content-wrapper'>
        <div className='p-3'>
            <h3>All Projects</h3>
            <div id="search" className="input-group input-group-lg mt-3 w-100">
                <BsSearch className="fa-solid fa-magnifying-glass position-absolute mt-3 ms-2 z-1 fs-5"/>
                <input type="text" className="ps-5 form-control rounded-0 bg-transparent" onChange={(e)=> setSearch(e.target.value)}/>
            </div>

            {/* table */}
            <table className="table table-hover mt-4">
                <thead>
                    <tr>
                        <th scope='col'>PROJECT NAME</th>
                        <th scope='col'>DESCRIPTION</th>
                        <th scope='col'>TEAM NAME</th>
                        <th scope='col'>LEADER</th>
                        <th scope='col'>NUM OF TASK</th>
                        <th scope='col'>MEMBERS</th>
                        <th scope='col'>DATE CREATED</th>
                        <th scope='col'>DATE UPDATED</th>
                        {/* <th scope='col'>ACTION</th> */}
                    </tr>
                </thead>
                <tbody>
                    {projects.length > 0 && projects.map((project, key) => {
                        const created = project.createdAt.split("T")[0]
                        const updated = project.updatedAt.split("T")[0]
                        
                        let team;
                        let leader;
                        let taskNo = 0
                        let members = [];

                        for(const i of teams){
                            if(i._id === project.team_id) team = i;
                        }

                        for(const i of users){
                            if(i._id === team.leader_id) leader = i
                            if(team.members.includes(i._id)) members.push(`${i.firstName} ${i.lastName}`);
                        }

                        for(const i of tasks){
                            if(i.project_id === project._id)taskNo++;
                        }
                        console.log(members);
                        return <tr key={key}>
                            <td>{project.projectName}</td>
                            <td>{project.description}</td>
                            <td>{team && team.teamName}</td>
                            <td>{leader && leader.firstName} {leader && leader.lastName}</td>
                            <td>{taskNo}</td>
                            <td>{members && members.join(', ')}</td>
                            <td>{created}</td>
                            <td>{updated}</td>
                            {/* <td>
                                <button className='bg-light border-0 rounded m-1'><BsPencilFill color='gray'/></button>
                                <button className='bg-danger border-0 rounded m-1'><BsTrashFill color='white'/></button>
                            </td> */}

                        </tr>
                    })}
                </tbody>
            </table>
        </div>
      </div>
    </div>
  );
}

export default page