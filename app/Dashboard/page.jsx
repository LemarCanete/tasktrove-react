'use client'
import React, { useEffect, useState } from 'react'
import { useCookies } from 'react-cookie'
import { redirect } from 'next/navigation'
import axios from 'axios'
import CountUp from 'react-countup'
import Link from 'next/link'
import {BarChart, CartesianGrid, XAxis, Tooltip, Legend, Bar, YAxis, LineChart, Line, AreaChart, Area, ComposedChart} from 'recharts'

// Pages
import { SideNav } from '../components'
import Calendar from '../Projects/Calendar/Calendar'
import Tour from '@/app/components/Tour'

//icons
import { RiTeamFill } from 'react-icons/ri'
import { AiFillProject } from 'react-icons/ai'
import { BsFiles, BsListCheck, BsCheck, BsX } from 'react-icons/bs'
import { RiCircleLine } from 'react-icons/ri'

const PORT = process.env.PORT

export default function Dashboard() {
    const [cookies] = useCookies(['id']);
    const id = cookies['id'];
    const registered = cookies['registered']
    const [currentTeam, setCurrentTeam] = useState([]);
    const [currentProjects, setCurrentProjects] = useState([]);
    const [currentTasks, setCurrentTasks] = useState([]);
    const [currentFiles, setCurrentFiles] = useState([])
    const [data, setData] = useState([]);
    const [chartType, setChartType] = useState("bar");
    const [completedTasks, setCompletedTasks] = useState(0);
    const [lateTasks, setLateTasks] = useState(0)
    const [inProgressTask, setInProgressTask] = useState(0)

    const chartWidth = 560;
    const chartHeight = 530; 

    // If the 'id' cookie is not present, redirect to the login page
    useEffect(()=>{
        
        if (id === undefined) {
            redirect('/');
            return null;
        }

        const fetchData = async() =>{
            try{
                let teamIds = [];

                const teams = await axios.get(`https://tasktrove-server.onrender.com/getTeams/${id}`)
                teams.data.forEach(team => teamIds.push(team._id));
                const projects = await axios.get(`https://tasktrove-server.onrender.com/getProjectsAndTeams/${teamIds}`)
                const tasks = await axios.get(`https://tasktrove-server.onrender.com/getAllTasks`)
                const files = await axios.get(`https://tasktrove-server.onrender.com/getAllFiles`)

                let user_files = files.data.filter(file => file.assignedTo === id)
                let user_tasks = tasks.data.filter(task => task.assignTo === id)

                setCurrentTeam(teams.data)
                setCurrentProjects(projects.data)
                setCurrentTasks(user_tasks)
                setCurrentFiles(user_files)

                //charts
                let res = []
                const totalProjects = projects.data.length;
                const totalTasks = user_tasks.length;
                const totalFiles = user_files.length;
                let numberOfLateTasks = 0;
                let numberOfCompletedTasks = 0
                let numberOfInProgressTasks = 0


                teams.data.map(team => {
                    let numberOfTasks = 0;
                    let numberOfFiles = 0;
                    let numberOfProjects = 0;

                    for(const i of projects.data){
                        if(i.team_id === team._id) numberOfProjects++
                    }

                    for(const i of user_tasks){
                        if(i.team_id === team._id) numberOfTasks++
                        
                    }

                    for(const i of user_files){
                        if(i.team_id === team._id) numberOfFiles++
                    }

                    res.push({
                        name: team.teamName,
                        projects: ((numberOfProjects / totalProjects) * 100).toFixed(2),
                        tasks: ((numberOfTasks / totalTasks) * 100).toFixed(2),
                        files: ((numberOfFiles / totalFiles) * 100).toFixed(2),
                    })
                })

                for(const i of user_tasks){
                    if(i.status === "Late") numberOfLateTasks++
                    if(i.status === "Completed") numberOfCompletedTasks++;
                    if(i.status === "In Progress") numberOfInProgressTasks++;
                }
                console.log(numberOfLateTasks);
                setData(res);
                setLateTasks(numberOfLateTasks);    
                setCompletedTasks(numberOfCompletedTasks);
                setInProgressTask(numberOfInProgressTasks);
            }catch(err){
                console.log(err);
            }
        }
        fetchData()
    }, [])

    return (
        <div className="container-fluid d-flex p-0 " style={{overflow: "hidden", height: "100vh"}}>
        <SideNav active="Dashboard"/>
            <div className='d-block w-100 content-wrapper'>
                <Tour />
                <div className="row m-3">
                    <h4 className='ps-0'>Dashboard</h4>
                    <div className="col border m-1 d-flex justify-content-between align-items-center">
                        <div>
                            <strong>No of Teams</strong>
                            <h1>{currentTeam.length ? <CountUp end={currentTeam.length} duration={4}/> : '0'}</h1>
                        </div>
                        <h1 className='text-secondary opacity-50'><RiTeamFill /></h1>
                    </div>
                    <div className="col border m-1 d-flex justify-content-between align-items-center">
                        <div>
                            <strong>No of Projects</strong>
                            <h1>{currentProjects.length ? <CountUp end={currentProjects.length} duration={4} /> : '0'}</h1>
                        </div>
                        <h1 className='text-secondary opacity-50'><AiFillProject /></h1>
                    </div>
                    <div className="col border m-1 d-flex justify-content-between align-items-center">
                        <div>
                            <strong>No of Tasks</strong>
                            <h1>{currentTasks.length ? <CountUp end={currentTasks.length} duration={4} /> : '0'}</h1>
                        </div>
                        <h1 className='text-secondary opacity-50'><BsListCheck /></h1>
                    </div>
                    <div className="col border m-1 d-flex justify-content-between align-items-center">
                        <div>
                            <strong>No of Files</strong>
                            <h1>{currentFiles.length ? <CountUp end={currentFiles.length} duration={4} /> : '0'}</h1>
                        </div>
                        <h1 className='text-secondary opacity-50'><BsFiles /></h1>
                    </div>
                </div>  
                <div className="row m-0 p-2">
                    <div className="col-4">
                        <h5 >Calendar</h5>
                        <Calendar calendarEvents={currentTasks}/>  

                        <ul class="list-group col mt-3">
                            <li class="list-group-item list-group-item-success d-flex justify-content-between align-items-center">
                                <p className='p-0 m-0'><BsCheck /> Completed Tasks</p>
                                <span class="badge bg-primary rounded-pill">{completedTasks}</span>
                            </li>  
                            <li class="list-group-item list-group-item-danger d-flex justify-content-between align-items-center mt-1">
                                <p className='p-0 m-0'><BsX /> Late Tasks</p>
                                <span class="badge bg-primary rounded-pill">{lateTasks}</span>
                            </li>
                            <li class="list-group-item list-group-item-warning d-flex justify-content-between align-items-center mt-1">
                                <p className='p-0 m-0'><RiCircleLine /> In Progress Tasks</p>
                                <span class="badge bg-primary rounded-pill">{inProgressTask}</span>
                            </li>
                        </ul>
                    </div>
                    <div className="col-5">
                        <div className="d-flex justify-content-between">
                            <h5>Teams</h5>
                            <select className="form-select w-25 me-4" id="chart" onChange={(e) => setChartType(e.target.value)}>
                                <option value="bar" >Bar Chart</option>
                                <option value="line" >Line Chart</option>
                                <option value="area" >Area Chart</option>
                                <option value="composed" >Composed Chart</option>
                            </select>
                        </div>
                        {chartType === "bar" ? 
                                (data.length > 0) && <BarChart width={chartWidth} height={chartHeight} data={data} layout='vertical' margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis type="number" tickFormatter={(value) => `${value}%`} />
                                    <YAxis dataKey="name" type="category" />
                                    <Tooltip />
                                    <Legend />
                                    <Bar dataKey="projects" fill="#3A83D0" barSize={20}/>
                                    <Bar dataKey="tasks" fill="#42f59e" barSize={20}/>
                                    <Bar dataKey="files" fill="#F9A825" barSize={20}/>
                                </BarChart>
                            : (chartType === "line") ? <LineChart width={chartWidth} height={chartHeight} data={data}
                                    margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="name" />
                                    <YAxis tickFormatter={(value) => `${value}%`}/>
                                    <Tooltip />
                                    <Legend />
                                    <Line type="monotone" dataKey="projects" stroke="#3A83D0" />
                                    <Line type="monotone" dataKey="tasks" stroke="#42f59e" />
                                    <Line type="monotone" dataKey="files" stroke="#F9A825" />
                                </LineChart> 
                            : (chartType === "area") ? <AreaChart width={chartWidth} height={chartHeight} data={data}
                                    margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                                    <defs>
                                    <linearGradient id="colorProjects" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#3A83D0" stopOpacity={0.8}/>
                                        <stop offset="95%" stopColor="#3A83D0" stopOpacity={0}/>
                                    </linearGradient>
                                    <linearGradient id="colorTasks" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#42f59e" stopOpacity={0.8}/>
                                        <stop offset="95%" stopColor="#42f59e" stopOpacity={0}/>
                                    </linearGradient>
                                    <linearGradient id="colorFiles" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#F9A825" stopOpacity={0.8}/>
                                        <stop offset="95%" stopColor="#F9A825" stopOpacity={0}/>
                                    </linearGradient>
                                    </defs>
                                    <XAxis dataKey="name" />
                                    <YAxis tickFormatter={(value) => `${value}%`}/>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <Tooltip />
                                    <Legend />
                                    <Area type="monotone" dataKey="projects" stroke="#3A83D0" fillOpacity={1} fill="url(#colorProjects)" />
                                    <Area type="monotone" dataKey="tasks" stroke="#42f59e" fillOpacity={1} fill="url(#colorTasks)" />
                                    <Area type="monotone" dataKey="files" stroke="#F9A825" fillOpacity={1} fill="url(#colorFiles)" />
                                </AreaChart>
                            : <ComposedChart width={chartWidth} height={chartHeight} data={data}>
                                    <XAxis dataKey="name" />
                                    <YAxis tickFormatter={(value) => `${value}%`}/>
                                    <Tooltip />
                                    <Legend />
                                    <CartesianGrid stroke="#f5f5f5" />
                                    <Area type="monotone" dataKey="tasks" fill="#42f59e" stroke="#8884d8" />
                                    <Bar dataKey="projects" barSize={20} fill="#3A83D0" />
                                    <Line type="monotone" dataKey="files" stroke="#F9A825" />
                                </ComposedChart>
                            }
                            <span className='text-center fst-italic ms-5 justify-self-center'>*Comparison between Teams</span>
                    </div>
                    <div className="col-3">
                        <ul class="list-group">
                            <li class="list-group-item active d-flex justify-content-between align-items-center">
                                Projects
                            </li>
                            {currentProjects.slice(0, 2).map((project, key) => {
                                let taskNo = 0;
                                for(const i of currentTasks){
                                    if(i.project_id === project._id) taskNo++;
                                }
                                return <li class="list-group-item d-flex justify-content-between align-items-center" key={key}>
                                    {project.projectName}
                                <span class="badge bg-primary rounded-pill">{taskNo}</span>
                            </li>
                            })}
                            <Link href="/Projects" className='mt-2'>See more</Link>
                        </ul>

                        <ul class="list-group mt-4">
                            <li class="list-group-item active d-flex justify-content-between align-items-center">
                                    Tasks
                            </li>
                            {currentTasks.slice(0, 2).map((task, key) => {
                                return <li class="list-group-item d-flex justify-content-between align-items-center" key={key}>
                                    {task.taskName}
                                <span class="badge bg-primary rounded-pill">{task.status}</span>

                            </li>
                            })}
                            <Link href="/Tasks" className='mt-2'>See more</Link>
                        </ul>

                        <ul class="list-group mt-4">
                            <li class="list-group-item active d-flex justify-content-between align-items-center">
                                    Teams
                            </li>
                            {currentTeam.slice(0, 3).map((team, key) => {
                                return <li class="list-group-item d-flex justify-content-between align-items-center" key={key}>
                                    {team.teamName}
                            </li>
                            })}
                            <Link href="/Teams" className='mt-2'>See more</Link>
                        </ul>
                    </div>
                </div>  
                
            </div>
            
        </div>
    );
}
