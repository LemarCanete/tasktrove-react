'use client'
import React, { useEffect, useState } from 'react'
import { useCookies } from 'react-cookie'
import { useRouter } from 'next/navigation'
// Pages
import SideNav from '@/app/Admin/Components/SideNav'
import axios from 'axios'
import CountUp from 'react-countup'
import {BarChart, CartesianGrid, XAxis, Tooltip, Legend, Bar, YAxis, LineChart, Line, AreaChart, Area} from 'recharts'
import {ComposedChart} from 'recharts'
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import Link from 'next/link'
import { BsPersonArmsUp, BsListCheck, BsFiles } from 'react-icons/bs'
import { RiTeamFill } from 'react-icons/ri'
import { AiFillProject } from 'react-icons/ai'


const page = () => {
    const router = useRouter();
    const [cookies] = useCookies(['id', 'role']);
    const id = cookies['id'];
    const role = cookies['role']
    const [allUsers, setAllUsers] = useState([]);
    const [allTeams, setAllTeams] = useState([])
    const [allProjects, setAllProjects] = useState([])
    const [allTasks, setAllTasks] = useState([])
    const [allFiles, setAllFiles] = useState([])
    const [data, setData] = useState([])
    const [chartType, setChartType] = useState("bar");

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
                const users = await axios.get('https://tasktrove-server.onrender.com/getAllUsers')
                const teams = await axios.get('https://tasktrove-server.onrender.com/getAllTeams')
                const projects = await axios.get('https://tasktrove-server.onrender.com/getAllProject')
                const tasks = await axios.get('https://tasktrove-server.onrender.com/getAllTasks')
                const files = await axios.get('https://tasktrove-server.onrender.com/getAllFiles')

                setAllUsers(users.data)
                setAllTeams(teams.data)
                setAllProjects(projects.data)
                setAllTasks(tasks.data)
                setAllFiles(files.data)

                //charts
                let res = []
                const totalProjects = projects.data.length;
                const totalTasks = tasks.data.length;
                const totalFiles = files.data.length;
                teams.data.map(team => {
                    let numberOfTasks = 0;
                    let numberOfFiles = 0;
                    let numberOfProjects = 0;
                    
                    for(const i of projects.data){
                        if(i.team_id === team._id) numberOfProjects++
                    }

                    for(const i of tasks.data){
                        if(i.team_id === team._id) numberOfTasks++
                    }

                    for(const i of files.data){
                        if(i.team_id === team._id) numberOfFiles++
                    }

                    res.push({
                        name: team.teamName,
                        projects: ((numberOfProjects / totalProjects) * 100).toFixed(2),
                        tasks: ((numberOfTasks / totalTasks) * 100).toFixed(2),
                        files: ((numberOfFiles / totalFiles) * 100).toFixed(2),
                    })
                })
                console.log(res);
                setData(res);
            }catch(err){
                console.log(err);
            }
        }

        fetchData()
    }, [chartType])
    console.log(chartType);
    return (
        <div className="container-fluid d-flex p-0">
        <SideNav active="Admin/Dashboard"/>
        <div className='d-block w-100'>
                <div className="row m-3">
                    <h4>Admin Dashboard</h4>
                    <div className="col border m-1 d-flex justify-content-between align-items-center">
                        <div className=''>
                            <strong>No of Users</strong>
                            <h1>{allUsers.length > 0 ? <CountUp end={allUsers.length} duration={4}/> : "0"}</h1>
                        </div>
                        <h1 className='text-secondary opacity-50'><BsPersonArmsUp /></h1>
                    </div>
                    <div className="col border m-1 d-flex justify-content-between align-items-center">
                        <div>
                            <strong>No of Teams</strong>
                            <h1>{allTeams.length > 0 ? <CountUp end={allTeams.length} duration={4}/> : '0'}</h1>
                        </div>
                        <h1 className='text-secondary opacity-50'><RiTeamFill /></h1>
                    </div>
                    <div className="col border m-1 d-flex justify-content-between align-items-center">
                        <div>
                            <strong>No of Projects</strong>
                            <h1>{allProjects.length > 0 ? <CountUp end={allProjects.length} duration={4}/> : '0'}</h1>
                        </div>
                        <h1 className='text-secondary opacity-50'><AiFillProject /></h1>
                    </div>
                    <div className="col border m-1 d-flex justify-content-between align-items-center">
                       <div>
                            <strong>No of Tasks</strong>
                            <h1>{allTasks.length > 0 ? <CountUp end={allTasks.length} duration={4}/> : "0"}</h1>
                       </div>
                       <h1 className='text-secondary opacity-50'><BsListCheck /></h1>
                    </div>
                    <div className="col border m-1 d-flex justify-content-between align-items-center">
                        <div>
                            <strong>No of Files</strong>
                            <h1>{allFiles.length > 0 ? <CountUp end={allFiles.length} duration={4}/> : "0"}</h1>
                        </div>
                        <h1 className='text-secondary opacity-50'><BsFiles /></h1>
                    </div>
                </div>
                <div className="row m-3">
                    <div className="col">
                        <div>
                            <div className="d-flex justify-content-between">
                                <h5>Teams</h5>
                                <select className="form-select w-25 me-4" id="chart" onChange={(e) => setChartType(e.target.value)}>
                                    <option value="bar" >Bar Chart</option>
                                    <option value="line" >Line Chart</option>
                                    <option value="area" >Area Chart</option>
                                    <option value="composed" >Composed Chart</option>
                                    <option value="scatter" >Scatter Chart</option>
                                </select>
                            </div>
                            {chartType === "bar" ? 
                                (data.length > 0) && <BarChart width={700} height={560} data={data} layout='vertical' margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis type="number" tickFormatter={(value) => `${value}%`} />
                                    <YAxis dataKey="name" type="category" />
                                    <Tooltip />
                                    <Legend />
                                    <Bar dataKey="projects" fill="#3A83D0" barSize={20}/>
                                    <Bar dataKey="tasks" fill="#42f59e" barSize={20}/>
                                    <Bar dataKey="files" fill="#F9A825" barSize={20}/>
                                </BarChart>
                            : (chartType === "line") ? <LineChart width={700} height={560} data={data}
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
                            : (chartType === "area") ? <AreaChart width={700} height={560} data={data}
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
                            : <ComposedChart width={700} height={560} data={data}>
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
                        </div>
                        
                    </div>
                    <div className="col">
                        <div className="row mb-3">
                            <h5>Projects</h5>
                            {/* Project list */}
                            <ol className="list-group list-group-numbered">
                                {allProjects.slice(0, 3).map((project, key)=>{
                                    let noTasks = 0;
                                    for(const i of allTasks){
                                        if(i.project_id === project._id) noTasks++;
                                    }
                                    return <li className="list-group-item d-flex justify-content-between align-items-start" key={key}>
                                        <div className="ms-2 me-auto">
                                        <div className="fw-bold">{project.projectName}</div>
                                            {project.description}
                                        </div>
                                        <span className="badge bg-primary rounded-pill">{noTasks}</span>
                                    </li>
                                })}
                            </ol>
                            <Link href="/Admin/Projects">See more</Link>
                        </div>
                        {/* team list */}
                        <div className="row">
                            <h5>Teams</h5>
                            <ol className="list-group list-group-numbered">
                                {allTeams.slice(0, 4).map((team, key)=>{
                                    let noProjects = 0;
                                    for(const i of allProjects){
                                        if(i.team_id === team._id) noProjects++;
                                    }
                                    return <li className="list-group-item d-flex justify-content-between align-items-start" key={key}>
                                        <div class="ms-2 me-auto">
                                        <div class="fw-bold">{team.teamName}</div>
                                            {team.createdAt.split("T")[0]}
                                        </div>
                                        <span className="badge bg-primary rounded-pill">{noProjects}</span>
                                    </li>
                                })}
                            </ol>   
                            <Link href="/Admin/Teams">See more</Link>
                        </div>
                    </div>
                    <div className="col">
                        {/* users list */}
                        <div className="row mb-3">
                            <h5>Users</h5>
                            <ol className="list-group list-group-numbered">
                                {allUsers.slice(0, 3).map((user, key)=>{
                                    return <li className="list-group-item d-flex justify-content-between align-items-start" key={key}>
                                        <div className="ms-2 me-auto">
                                        <div className="fw-bold">{user.firstName} {user.lastName}</div>
                                            @{user.userName}
                                        </div>
                                    </li>
                                })}
                            </ol>   
                            <Link href="/Admin/Users">See more</Link>
                        </div>
                            
                        <h5>Calendar</h5>
                        <Calendar value={new Date()}/>
                    </div>
                </div>
        </div>
        </div>
    );
}

export default page