'use client'
import axios from 'axios';
import React, { useState } from 'react'
import { RiGalleryFill } from 'react-icons/ri'
import { useCookies } from 'react-cookie';
import { notifySuccess, notifyError } from '../components/Notify/Notify';

const TeamForm = () => {
    const [teamName, setTeamName] = useState("")
    const [cookies] = useCookies(['id']);
    const leader_id = cookies['id'];

    const handleAddTeam = (e) =>{
        e.preventDefault();

        axios.post('https://tasktrove-server.onrender.com/addTeam', {teamName, leader_id})
        .then(res =>{
            console.log(res);
            // notifySuccess("Successfully added the project")
        })
        .catch(err =>{
            console.log(err);
            notifyError(err.response.data.error)
        })
    }
    return (
        <div className="col-md-2 bg-white rounded d-flex flex-column justify-content-around align-items-center m-3 shadow" style={{height: "240px", width: "270px"}}>
            <RiGalleryFill className='fs-1'/>
            <form className='' onSubmit={handleAddTeam}>
                <input type="text" className='border-0 border-bottom form-control mb-2' placeholder='Team name' onChange={e => setTeamName(e.target.value)} required/>
                <button type='submit' className='btn btn-info form-control-plaintext'>Create a Team</button>
            </form>
        </div>
    )
}

export default TeamForm