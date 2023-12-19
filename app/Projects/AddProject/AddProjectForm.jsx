'use client'
import React, {useEffect, useState} from 'react'
import axios from 'axios'
import { useCookies } from 'react-cookie';
import { notifyError, notifySuccess } from '@/app/components/Notify/Notify';

const AddProjectForm = ({user_id}) => {

    const [projectName, setProjectName] = useState("")
    const [description, setDescription] = useState("")
    const [status, setStatus] = useState("In Progress")
    const [team, setTeam] = useState("");
    const [teamsArray, setTeamsArray] = useState([])
    const [cookies] = useCookies(['id']);
    const id = cookies['id'];

    useEffect(()=>{
        axios.get(`https://tasktrove-server.onrender.com/getTeams/${user_id}`)
        .then(res =>{
            const teamsOfLeader = res.data.filter(team => team.leader_id === id) || [];
            console.log(teamsOfLeader);
            setTeamsArray(teamsOfLeader)
        })
        .catch(err => {
            console.log(err);
        })
    }, [])
    
    
    const AddProject = (e) =>{
        e.preventDefault();

        if(team === "") return;
        axios.post('https://tasktrove-server.onrender.com/addProject', {projectName, description, status, team})
        .then((res)=> {
            notifySuccess("SuccessfullY Added project")
        })
        .catch(err => {
            notifyError("Something went wrong pls try again!")
            console.log(err)
        })
    }

    return (
        <form onSubmit={AddProject} className='col-lg-6 mx-auto '>
            <div className="mb-3">
                <label htmlFor="name" className="form-label">Name:</label>
                <input type="text" className="form-control" id="name" onChange={(e) => setProjectName(e.target.value)} required/>
            </div>
            <div className="mb-3">
                <label htmlFor="description" className="form-label">Description:</label>
                <textarea className="form-control" id="description" rows="3" onChange={(e) => setDescription(e.target.value)}></textarea>
            </div>
            <div className="row">
                <div className='col'>
                    <label htmlFor="status" className='form-label'>Team:</label>
                    <select className="form-select" aria-label="Default select example" id='status' required onChange={(e) => setTeam(e.target.value)}>
                        <option value=""></option>
                        {teamsArray.map(res=>{
                            return <option value={res._id} key={res._id}>{res.teamName}</option>
                        })}
                    </select>
                </div>
                <div className='col'>
                    <label htmlFor="status" className='form-label'>Status:</label>
                    <select className="form-select" aria-label="Default select example" id='status' onChange={(e) => setStatus(e.target.value)}>
                        <option value="inProgress">In Progress</option>
                    </select>
                </div>
            </div>
            
            <div className="d-flex justify-content-end mt-5">
                <button type="submit" className="btn btn-info">Save</button>
            </div>
        </form>
        
    )
}

export default AddProjectForm