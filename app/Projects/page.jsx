'use client'
import React, { useEffect, useState } from 'react'
import { useCookies } from 'react-cookie'
import { redirect } from 'next/navigation'
import axios from 'axios'
import Link from 'next/link'
import { BsGrid } from 'react-icons/bs'
import { BsListUl } from 'react-icons/bs'
import { useRouter } from 'next/navigation'

// Pages
import { SideNav } from '../components'
import ProjectsLayout from './ProjectsLayout'
import ProjectSingleLayout from './ProjectSingleLayout'
import { Router } from 'next/router'

const Projects = () => {
    const [cookies] = useCookies(['id']);
    const id = cookies['id'];
    const [projects, setProjects] = useState([]);
    const [projectSingleCol, setProjectSingleCol] = useState(false)
    const [teams, setTeams] = useState([])
    const [teamFilter, setTeamFilter] = useState("All")
    const [search, setSearch] = useState("")
    const [status, setStatus] = useState("In Progress");
    const [sort, setSort] = useState("Descending")
    const router = useRouter()

    // If the 'id' cookie is not present, redirect to the login page
    useEffect(() => {
        const fetchData = async () => {
          try {
            if (!id) {
              redirect('/');
              return;
            }
      
            const teams = await axios.get(`https://tasktrove-server.onrender.com/getTeams/${id}`);
            setTeams(teams.data);
      
            let teamIds = teams.data.map((team) => team._id);
      
            const projects = await axios.get(`https://tasktrove-server.onrender.com/getProjectsAndTeams/${teamIds}`);
            
            setProjects((prevProjects) => {
                const filteredProjects = teamFilter === 'All' || teamFilter === ''
                  ? projects.data.filter((project) =>
                    project.projectName.toLowerCase().includes(search.toLowerCase()) &&
                    project.status === status
                  )
                  : projects.data.filter((project) => {
                    const matchesTeam = project.team_id === teamFilter;
                    const matchesSearch =
                      search === "" ||
                      project.projectName.toLowerCase().includes(search.toLowerCase());
                    const matchesStatus = project.status === status;
              
                    return matchesTeam && matchesSearch && matchesStatus;
                  });
              
                // Sorting logic
                const sortedProjects = [...filteredProjects].sort((a, b) => {
                  const sortOrder = sort === "Descending" ? -1 : 1;
                  // Assuming you want to sort by project name, adjust accordingly
                  return sortOrder * a.projectName.localeCompare(b.projectName);
                });
              
                return sortedProjects;
            });
          } catch (err) {
            console.log(err);
          }
        };
      
        fetchData();
      }, [id, teamFilter, search, status, sort]);
      
    console.log(projects);
    useEffect(() => {}, []);
    return (
        <div className="d-flex p-0 flex" style={{overflow: "hidden", height: "100vh"}}>
            <SideNav active="Projects"/>
            <div className='d-block w-100 p-3 content-wrapper' >
                <div className="d-flex justify-content-between px-2 py-1 ">
                    <h3 className=''>Project List</h3>
                    <div className="d-flex align-items-center">
                        <button  className='btn btn-info w-100 me-5' onClick={()=> router.push("/Projects/AddProject")}>Add a project</button>
                        <button className="bg-transparent border-0"><BsGrid className='fs-3 me-3' onClick={()=>setProjectSingleCol(false)}/></button>
                        <button className="bg-transparent border-0"><BsListUl className='fs-3' onClick={()=> setProjectSingleCol(true)}/></button>
                        <select name="" id="" className='form-select bg-white border-0 mb-0 ms-5'  onChange={(e)=>setSort(e.target.value)}>
                            <option value="Descending">Descending</option>
                            <option value="Ascending">Ascending</option>
                        </select>
                        <select name="" id="" className='form-select bg-white border-0 mb-0 ms-3'  onChange={(e)=>setStatus(e.target.value)}>
                            <option value="In Progress">In Progress</option>
                            <option value="Completed">Completed</option>
                            <option value="On Hold">On Hold</option>
                        </select>
                        <select className="form-select border-0 ms-3" id="select" onChange={e => setTeamFilter(e.target.value)}>
                            <option value="All">All Teams</option>
                            {teams.map((team, index)=>{
                                return <option value={team._id} key={index}>{team.teamName}</option>
                            })}
                        </select>
                        <input type="text" placeholder='Search' className=' bg-transparent form-control m-2' onChange={(e) => setSearch(e.target.value)}/>
                    </div>
                </div>
                <hr className="text-success mb-3" />
                <p className='text-secondary fst-italic mb-2 me-5'>Your Projects</p>
                {/* leader projects */}
                {projectSingleCol ? projects.map(project => {
                    if(project.leader_id === id){
                        return <ProjectSingleLayout 
                        name={project.projectName} 
                        description={project.description} 
                        createdAt={project.createdAt} 
                        teamName={project.teamName} 
                        project_id={project._id} 
                        leader_id={project.leader_id} 
                        teamMembers={project.members}
                        project={project}
                        teams={teams}/>
                    }
                    return
                }) : 
                <div className="container-fluid">
                    <div className="row">
                        {(projects.length > 0) && projects.map((project, index) => {
                            if(project.leader_id === id){
                                return <div key={index} className={projectSingleCol ? "col-lg-12" : 'col-md-3 col-sm-12'}>
                                    <ProjectsLayout 
                                        projectName={project.projectName} 
                                        description={project.description} createdAt={project.createdAt} 
                                        project_id={project._id} 
                                        teamName={project.teamName} 
                                        leader_id={project.leader_id} 
                                        teamMembers={project.members}
                                        project={project}
                                        projectsArray={projects}
                                        teams={teams}
                                        leaderId={project.leader_id}/>
                                </div>
                            }
                        })}
                    </div>
                </div>}
                {/* as member projects */}
                <p className='text-secondary fst-italic mb-2 me-5 mt-4'>Other projects</p>
                {projectSingleCol ? projects.map(project => {
                    if(project.leader_id !== id){
                        return <ProjectSingleLayout 
                        name={project.projectName} 
                        description={project.description} 
                        createdAt={project.createdAt} 
                        teamName={project.teamName} 
                        project_id={project._id} 
                        leader_id={project.leader_id} 
                        teamMembers={project.members}
                        project={project}
                        teams={teams}/>
                    }
                    return
                }) : 
                <div className="container-fluid">
                    {console.log(projects)}
                    <div className="row">
                        {(projects.length > 0) && projects.map((project, index) => {
                            if(project.leader_id !== id){
                                return <div key={index} className={projectSingleCol ? "col-lg-12" : 'col-md-3 col-sm-12'}>
                                    <ProjectsLayout 
                                        projectName={project.projectName} 
                                        description={project.description} createdAt={project.createdAt} 
                                        project_id={project._id} 
                                        teamName={project.teamName} 
                                        leader_id={project.leader_id} 
                                        teamMembers={project.members}
                                        project={project}
                                        projectsArray={projects}
                                        teams={teams}
                                        leaderId={project.leader_id}/>
                                </div>
                            }
                        })}
                    </div>
                </div>}
            </div>

        </div>
    );
}

export default Projects