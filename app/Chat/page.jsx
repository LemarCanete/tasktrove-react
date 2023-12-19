'use client'
import React, { useEffect, useState } from 'react'
import { SideNav } from '../components'
import { BsPencilSquare, BsSend } from 'react-icons/bs';
import axios from 'axios';
import { useCookies } from 'react-cookie';
import MessageSection from './MessageSection'

const page = () => {
    // const [isWrite, setIsWrite] = useState(false);
    const [allUsers, setAllUsers] = useState([]);
    const [cookies] = useCookies(['id']);
    const current_user = cookies['id'];
    const [teams, setTeams] = useState([]);
    const [teamActive, setTeamActive] = useState();
    
    useEffect(()=>{
        const fetchData = async() =>{
            //GET USER TEAMS
            const teamsRes = await axios.get(`https://tasktrove-server.onrender.com/getTeams/${current_user}`);
            setTeams(teamsRes.data)
            setTeamActive(teamsRes.data[0])

            // GET ALL USERS
            const usersRes = await axios.get('https://tasktrove-server.onrender.com/getAllUsers')
            setAllUsers(usersRes.data)

        }
        fetchData()
    }, [])
    
    return (
        <div className="container-fluid d-flex p-0 " style={{overflow: "hidden", height: "100vh"}}>
            <SideNav active="Chat"/>
            <div className='d-block w-100 content-wrapper'>
                <div className="d-flex w-100" style={{overflow: "hidden"}}>
                    <div className="border-end p-3" style={{height: "100vh", width: "18vw"}}>
                        <div className="d-flex justify-content-between align-items-center" style={{overflowY: 'auto'}}>
                            <h5>Chats</h5>
                            <button className="btn"><BsPencilSquare /></button>
                        </div>
                        <hr />

                        {/* teams */}
                        <div className="d-flex flex-column">
                            {teams.map((team, key)=>{
                                return <button className='btn white team-chat-button border-bottom text-start py-3' key={key} onClick={()=> setTeamActive(team)}>{team.teamName}</button>
                            })}
                        </div>
                    </div>
                    {/* message section */}
                    {teamActive && <MessageSection team={teamActive} senderId={current_user} allUsers={allUsers}/>}
                </div>
            </div>
        </div>
    )
}

export default page