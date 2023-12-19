'use client'
import React, { useEffect, useState } from 'react'
import { BsPencilSquare } from 'react-icons/bs'
import { useRouter } from 'next/navigation'
import UpdateProject from './UpdateProject'
import axios from 'axios'
import { useCookies } from 'react-cookie'
import DeleteProject from './DeleteProject'

const ProjectsLayout = ({projectName, description, createdAt, teamName, project_id, project, teams, projectsArray, leaderId}) => {
    const [isEdit, setIsEdit] = useState(false);
    const [tasks, setTasks] = useState([]);
    const [progress, setProgress] = useState(0);
    const [cookies] = useCookies(['id']);
    const id = cookies['id'];
    const router = useRouter();
    const isLeader = (leaderId === id)

    useEffect(()=>{
        const fetchData = async ()=>{
            if(project_id){
                const tasksOfProjects = await axios.get(`https://tasktrove-server.onrender.com/getTasks/${project_id}`)
                setTasks(tasksOfProjects.data)
                const completedTasks = tasksOfProjects.data.filter((task) => task.status === 'Completed');

                const prog = projectsArray.length > 0
                    ? (completedTasks.length / tasksOfProjects.data.length) * 100
                    : 0;
                    console.log(prog);
                setProgress(isNaN(prog) ? 0 : prog);

            }
        }
        fetchData();
    }, [])
    console.log(isLeader)
    return (
        <>
            <div className="card bg-white border-primary shadow" style={{cursor: 'pointer', height: "280px"}} >
                <div className="d-flex justify-content-between jusity-content-between align-items-between card-header bg-white border-0">
                    <p className='text-info'>{createdAt.split("T")[0]}</p>
                    { isLeader && <BsPencilSquare onClick={()=> setIsEdit(!isEdit)}/>}
                </div>
                <div className="card-body overflow-auto" onClick={() => router.push(`/Projects/${project_id}`)}>
                    <h4 className="card-title text-primary text-center">{projectName}</h4>
                    <p className="card-text text-primary">{description}</p>
                </div>
                <div className="position-absolute bottom-0 left-0 flex-row d-flex justify-content-between flex-wrap card-footer bg-white w-100" >
                    <p className="text-primary">Team {teamName}</p>
                    <p className="text-dark">{progress.toString().substring(0, 5)}%</p>
                    <p className="text-dark">{tasks.length} tasks</p>
                    {isEdit && <div className="d-flex position-absolute justify-content-between w-100 start-0 end-0 shadow bg-primary rounded-bottom-1 p-1 bottom-0">
                        <button className="btn btn-outline-light" onClick={()=>setIsEdit(false)}>Cancel</button>
                        <UpdateProject btn="Update" cl='btn btn-outline-success' project_id={project_id} projectInfo={project} teamName={teamName} teamsInfo={teams}/>
                        <DeleteProject project={project} deleteButton="Delete" className="btn btn-outline-danger"/>
                    </div>}
                </div>
                
            </div>
            
        </>
    )
}

export default ProjectsLayout