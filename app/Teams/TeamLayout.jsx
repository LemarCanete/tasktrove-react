'use client'
import React, { useEffect, useState } from 'react'
import { RiGalleryFill } from 'react-icons/ri'
import { RiEdit2Line } from 'react-icons/ri';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { notifySuccess, notifyError } from '../components/Notify/Notify';
import { useCookies } from 'react-cookie';
import DeleteTeam from './DeleteTeam'

const TeamLayout = ({team_name, _id, team}) => {
    const [cookies] = useCookies(['id']);
    const id = cookies['id'];
    const [isEdit, setIsEdit] = useState(false)
    const [teamName, setTeamName] = useState(team.teamName)
    const isLeader = (team.leader_id === id);
    const router = useRouter()

    const handleTeamNameChange = async (e) =>{
        try{
            setTeamName(e.target.value)
            let name = e.target.value
            const editTeam = await axios.put(`https://tasktrove-server.onrender.com/editTeam/${_id}`, {name})
            // editTeam && notifySuccess("Successfully edited team name")
            // editTeam && setIsEdit(false)
        }catch(err){
            console.log(err);
            notifyError("Something went wrong! Pls try again")
        }
    }

    const teamPage = (teamName)=>{
        const encodedTeamName = encodeURIComponent(teamName);
        router.push(`/Teams/${encodedTeamName}`);
    }

    return (
        <div className="col-md-2 bg-white rounded d-flex flex-column justify-content-around align-items-center m-3 shadow position-relative" style={{height: "240px", cursor: "pointer", width: "270px"}}>
            {isLeader && <RiEdit2Line className='position-absolute fs-4 text-light hover-text-primary' style={{right: "10px", top: "15px"}} onClick={()=>setIsEdit(!isEdit)}/>}
            <RiGalleryFill className='fs-1' style={{width: "20em !important"}} onClick={()=> teamPage(teamName)}/>
            {(isEdit) ? 
                <>
                    <input className='text-center w-100 bg-white border-0 border-bottom mb-4' value={teamName} onChange={e => handleTeamNameChange(e)} />
                    <div className='bg-white w-100 position-absolute rounded-bottom-1 p-1 d-flex justify-content-around' style={{bottom: "0px"}}>
                        <button className='btn btn-dark border-0' onClick={()=>setIsEdit(false)}>Cancel</button>
                        <DeleteTeam team={team} />
                    </div>
                </>
            :
                <input className='text-center w-100 bg-white border-0 mb-4' value={teamName} disabled/>
            }
            
        </div>
    )
}

export default TeamLayout