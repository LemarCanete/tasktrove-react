'use client'
import React, { useEffect, useState } from 'react'
import { useCookies } from 'react-cookie'
import { useRouter } from 'next/navigation'
import axios from 'axios'

import { BsPencilFill, BsSearch, BsTrashFill } from 'react-icons/bs'
// Pages
import SideNav from '@/app/Admin/Components/SideNav'

export default function Teams() {
    const [search, setSearch] = useState("")
    const [teams, setTeams] = useState([])
    const [leaders, setLeaders] = useState([])
    const [users, setUsers] = useState([])
    const [projects, setProjects] = useState([])

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
        const teamsRes = await axios.get(`https://tasktrove-server.onrender.com/getAllTeams`)
        setTeams((search == "") ? teamsRes.data : teamsRes.data.filter(team => team.teamName.toLowerCase().includes(search.toLowerCase()) ||
        team.teamName.includes(search)))

        //get leader of team
        let leaderArray = []

        for(const team of teamsRes.data){
            const leader = await fetchLeader(team.leader_id);
            leaderArray.push(leader)
        }

        setLeaders(leaderArray)

        //get members of team
        const usersArr = await axios.get(`https://tasktrove-server.onrender.com/getAllUsers`)
        setUsers(usersArr.data)

        //get projects
        const projects = await axios.get(`https://tasktrove-server.onrender.com/getAllProject`);
        setProjects(projects.data)

    }
    const fetchLeader = async (leaderId) => {
        const leader = await axios.get(`https://tasktrove-server.onrender.com/getUser/${leaderId}`);
        return leader.data;
    };

    fetchData()

  }, [search])
  return (
    <div className="container-fluid d-flex p-0" style={{overflow: "hidden", height: "100vh"}}>
      <SideNav active="Admin/Teams"/>
      <div className='d-block w-100 p-3 content-wrapper'>
        <div className='p-3'>
            <h3>All Teams</h3>
            <div id="search" className="input-group input-group-lg mt-3 w-100">
                <BsSearch className="fa-solid fa-magnifying-glass position-absolute mt-3 ms-2 z-1 fs-5"/>
                <input type="text" className="ps-5 form-control rounded-0 bg-transparent" onChange={(e)=> setSearch(e.target.value)}/>
            </div>

            {/* table */}
            <table className="table table-hover mt-4">
                <thead>
                    <tr>
                        <th scope='col'>TEAM NAME</th>
                        <th scope='col'>LEADER</th>
                        <th scope='col'>MEMBERS</th>
                        <th scope='col'>CREATED AT</th>
                        <th scope='col'>UPDATED AT</th>
                        <th scope='col'>NO OF PROJECTS</th>
                        {/* <th scope='col'>ACTION</th> */}
                    </tr>
                </thead>
                <tbody>
                    {teams.length > 0 && teams.map((team, key) => {
                        const created = team.createdAt.split("T")[0]
                        const updated = team.updatedAt.split("T")[0]

                        let leader;
                        console.log(leader);
                        for(const lead of leaders){
                            if(lead && lead._id === team.leader_id) leader = lead
                        }
                        
                        const members = []
                        for(const user of users){
                            if(team.members.includes(user._id)) members.push(`${user.firstName} ${user.lastName}`)
                        }
                        let project = projects.filter(proj => proj.team_id === team._id)
                        console.log(project);
                        return <tr key={key}>
                            <td>{team.teamName}</td>
                            <td>{leader ? leader.firstName : team.leader_id} {leader && leader.lastName}</td>
                            {/* <td>{team.members.length > 0 && team.members.map((members, index) => <span key={index}>{members}{index !== team.members.length - 1 && ', '} </span>) }</td> */}
                            <td>{members.join(', ')}</td>
                            <td>{created}</td>
                            <td>{updated}</td>
                            <td>{project.length}</td>
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
