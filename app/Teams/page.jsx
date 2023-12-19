'use client'
import React, { useEffect, useState } from 'react'
import { SideNav } from '../components'
import TeamLayout from './TeamLayout'
import TeamForm from './TeamForm'
import axios from 'axios'
import { useCookies } from 'react-cookie'
import { redirect } from 'next/navigation'
import { ToastContainer } from 'react-toastify'

const Teams = () => {
    const [cookies] = useCookies(['id']);
    const user_id = cookies['id'];
    const [teams, setTeams] = useState([]);

    useEffect(()=>{
        if (user_id === undefined) {
            redirect('/');
        }
    }, [])

    useEffect(()=>{
        axios.get(`https://tasktrove-server.onrender.com/getTeams/${user_id}`)
        .then(res => {
            setTeams(res.data)
        })
        .catch(err => {
            console.log(err);
        })
    }, [teams])

    return (
        <div className='container-fluid d-flex p-0 flex' style={{overflow: "hidden", height: "100vh"}}>
            <SideNav active="Teams"/>
            <div className='d-block w-100 p-3 content-wrapper'>
                <h3>Teams</h3>
                <div className='row'>
                    <TeamForm/>
                    {teams && teams.map((team, key) => <TeamLayout team_name={team.teamName} key={key} _id={team._id} current_user={user_id} team={team}/>)}
                </div>
                <ToastContainer
                    position="top-right"
                    autoClose={5000}
                    hideProgressBar={false}
                    newestOnTop={false}
                    closeOnClick
                    rtl={false}
                    pauseOnFocusLoss
                    draggable
                    pauseOnHover
                    theme="light"
                />
                <ToastContainer />
            </div>
        </div>
    )
}

export default Teams