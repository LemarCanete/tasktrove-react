'use client'
import React, {useState, useEffect} from 'react'
import axios from 'axios'
import { BsArrowLeftCircle, BsPencilFill, BsSendFill, BsUpload, BsDownload, BsTrashFill, BsChatRightDots, BsBarChartSteps, BsCalendarWeekFill } from 'react-icons/bs'
import { useCookies } from 'react-cookie'
import AddTask from './AddTask'
import { SideNav } from '@/app/components'
import ShowGantt from '@/app/Gantt/ShowGantt'
import UpdateTask from './UpdateTask'
import { ToastContainer } from 'react-toastify'
import Reports from '@/app/Reports/Reports'
import DeleteTask from './DeleteTask'
import { useRouter } from 'next/navigation'

function calculateRemainingTime(targetDate) {
    // Convert the targetDate string to a Date object
    const targetDateTime = new Date(targetDate);

    // Get the current date and time
    const now = new Date();

    // Calculate the time difference in milliseconds
    const timeDifference = targetDateTime - now;

    // Check if the target date has already passed
    if (timeDifference < 0) {
        // Calculate the elapsed time from the deadline
        const elapsedMilliseconds = now - targetDateTime;
        const elapsedSeconds = Math.floor(elapsedMilliseconds / 1000);
        const elapsedMinutes = Math.floor(elapsedSeconds / 60);
        const elapsedHours = Math.floor(elapsedMinutes / 60);
        const elapsedDays = Math.floor(elapsedHours / 24);

        return {
            days: 0,
            hours: 0,
            minutes: 0,
            seconds: 0,
            status: "Late",
            elapsed: {
                days: elapsedDays,
                hours: elapsedHours % 24,
                minutes: elapsedMinutes % 60,
                seconds: elapsedSeconds % 60
            }
        };
    }

    // Calculate remaining days, hours, minutes, and seconds
    const days = Math.floor(timeDifference / (1000 * 60 * 60 * 24));
    const hours = Math.floor((timeDifference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((timeDifference % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((timeDifference % (1000 * 60)) / 1000);

    return {
        days,
        hours,
        minutes,
        seconds,
        status: "On Time",
        elapsed: {
            days: 0,
            hours: 0,
            minutes: 0,
            seconds: 0
        }
    };
}

const page = ({params}) => {
    const [tasks, setTasks] = useState([])
    const [members, setMembers] = useState([]);
    const [team, setTeam] = useState(null);
    const [teamId, setTeamId] = useState("");
    const [file, setFile] = useState("")
    const [allFiles, setAllFiles] = useState([])
    const [status, setStatus] = useState("All");
    const [updateTaskId, setUpdateTaskId] = useState("")
    const [search, setSearch] = useState("")
    const [leaderId, setLeaderId] = useState("");
    const [cookies] = useCookies(['id']);
    const [project, setProject] = useState([]);
    const current_id = cookies['id'];
    const project_id = params.tasks
    const isLeader = (leaderId === current_id)
    const router = useRouter();

    useEffect(()=>{
        const fetchData = async () =>{
            try{ 
                //get al tasks of the project
                const allTasks = await axios.get(`https://tasktrove-server.onrender.com/getTasks/${project_id}`)
                // setTasks(allTasks.data)  
                // setTasks(status === "All" || status === "" ? allTasks.data : allTasks.data.filter(task => task.status === status));              
                const filteredTasks = allTasks.data.filter((task) => {
                    const matchesStatus = status === "All" || task.status === status;
                    const matchesSearch =
                      search === "" || task.taskName.toLowerCase().includes(search.toLowerCase());
            
                    return matchesStatus && matchesSearch;
                });
            
                setTasks(filteredTasks);

                //GET PROJECT DETAILS
                const projectRes = await axios.get(`https://tasktrove-server.onrender.com/getProjectById/${project_id}`)
                setProject(projectRes.data);

                //get team
                const team = await axios.get(`https://tasktrove-server.onrender.com/getTeamByProjectId/${project_id}`)
                setTeam(team.data)
                setTeamId(team.data._id)
                setLeaderId(team.data.leader_id)
                let membersIds = team.data.members
                if(membersIds.length === 0) return

                //GET MEMBERS INFO
                const members = await axios.get(`https://tasktrove-server.onrender.com/getMembersInfo/${membersIds}`)
                setMembers(members.data)

                //GET TASK FILES
                const AllFilesRes = await axios.get(`https://tasktrove-server.onrender.com/getFiles/${project_id}`)
                setAllFiles(AllFilesRes.data)
            }catch(err){
                console.log(err);
            }
        }
        fetchData()
    }, [status, search])
    
    const handleAddTask = () =>{}
    const handleFileSubmit = async (task_id, assignedTo, team_id) =>{
        try{
            // console.log(task_id, assignedTo, team_id, project_id, file);
            const formData = new FormData();
            formData.append('file', file)
            formData.append('task_id', task_id)
            formData.append('assignedTo', assignedTo)
            formData.append('team_id', team_id)
            formData.append('project_id', project_id)

            const fileRes = await axios.post(`https://tasktrove-server.onrender.com/uploadFile`, formData, {
                headers: {
                  'Content-Type': 'multipart/form-data',
                },
              })
            alert('File uploaded successfully!');
            window.location.reload();
        }catch(err){
            console.error('Error uploading file:', err);
            alert("Something went wrong! Pls try again!")
        }
    }
    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
    };

    const handleDownloadFile = async (filename, type, originalName) => {
        try {
            const downloadRes = await axios.get(`https://tasktrove-server.onrender.com/downloadFile/${filename}`, { responseType: 'arraybuffer' });
            const blob = new Blob([downloadRes.data], { type: type });
        
            const url = URL.createObjectURL(blob);
        
            // Open the file in a new window or tab
            window.open(url, '_blank');
        
            // Optionally, you can revoke the object URL after some time to free up resources
            setTimeout(() => {
                URL.revokeObjectURL(url);
            }, 60000); // Revoke the URL after 1 minute
        } catch (err) {
            console.log(err);
        }
    };
    console.log(project_id)
    return (
        <div className="d-flex p-0 w-100 " style={{overflow: "hidden", height: "100vh"}}>
            <SideNav active="Projects"/>
            <div id="tasks" className="mb-3 d-block w-100 container-fluid p-4 content-wrapper" >
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
                <button className='border-0 bg-white' onClick={()=>router.back()}><BsArrowLeftCircle className='fs-2'/></button>

                <div className='d-flex justify-content-between mt-5'>
                    <h3 className=''>Tasks</h3>
                    
                    <div className="d-flex align-items-center">
                        {(isLeader && project.status === "In Progress") ? 
                            <AddTask project_id={project_id} func={handleAddTask} teamMembers={members} teamId={teamId} name="addTask" task_id=""/>
                            : <p className='text-info w-100 me-5 my-0'>{project.status}</p>
                        } 
                        {tasks && <Reports tasks={tasks} project={project} members={members}/>}
                        <ShowGantt project_id={project_id}/>
                        <select className="mx-3 form-select" id="select" onChange={(e)=>setStatus(e.target.value)}>
                            <option value="All">All</option>
                            <option value="Completed">Completed</option>
                            <option value="In Progress">In Progress</option>
                            <option value="Late">Late</option>
                        </select>
                        <input type="text" placeholder='Search task' className=' bg-transparent form-control w-100' onChange={(e) => setSearch(e.target.value)}/>
                    </div>
                </div>
                <table className='table table-hover mt-3'>
                    <thead>
                        <tr>
                            <th> </th>
                            <th>TASK</th>
                            <th>DESCRIPTION</th>
                            <th>ASSIGNED TO</th>
                            <th>PRIORITY</th>
                            <th>START DATE</th>
                            <th>DEADLINE</th>
                            <th>REMAINING TIME</th>
                            <th>ATTACH</th>
                            {isLeader && <th>ACTIONS</th>}
                        </tr>
                    </thead>
                    <tbody>
                        {(tasks.length > 0) && tasks.map((task, index) => {
                            const remaining_time = calculateRemainingTime(task.deadline)
                            let originalName = ""
                            let filename = ""
                            let type = ""
                            for(const i of allFiles){
                                if(i.task_id === task._id) {
                                    filename = i.fileName
                                    originalName = i.originalName
                                    type = i.type
                                }
                            }
                            return(
                                    <tr key={index} className="">
                                        <td>{index+1}</td>
                                        <td>
                                            <strong className={(task.status === "Late") && "text-danger"}>{task.taskName}</strong>
                                        </td>
                                        <td>
                                            <p className={(task.status === "Late") && "text-danger"}>{task.description}</p>
                                        </td>
                                        <td>
                                            <p value="assign">@{task.user[0].userName}</p>
                                        </td>
                                        <td>{task.priority}</td>
                                        <td>{task.createdAt.split("T")[0]}</td>
                                        <td>{task.deadline.split("T")[0]}</td>
                                        <td>{remaining_time.days}d {remaining_time.hours}h {remaining_time.minutes}min {remaining_time.seconds}sec</td>
                                        <td>
                                            {(task.assignTo === current_id && task.status === "In Progress") ? 
                                                <div className="form-group custom-file-button">
                                                    <label className='px-3 fs-4 text-info form-label' htmlFor="formFile"><BsUpload style={{cursor:'pointer'}}/></label>
                                                    <input className="border-none border-bottom" type="file" id="formFile" onChange={handleFileChange} style={{width: "120px"}}/>
                                                    <label className='text-info fs-4 ms-3' style={{cursor: 'pointer'}} onClick={() => handleFileSubmit(task._id, task.assignTo, task.team_id)}><BsSendFill /></label>
                                                </div>
                                                : (task.status === "Completed" && !isLeader) ? <p className='text-secondary fst-italic'>Submitted</p>
                                                :(task.status === "Late") ? <p className="text-danger fst-italic">Late</p>
                                                : (isLeader && task.status === "Completed") ? <button className='btn btn-link' onClick={() => handleDownloadFile(filename, type, originalName)}>{originalName} <BsDownload /></button>
                                                : "---"}
                                        </td>

                                        {isLeader && <td>
                                            <div className="d-flex" onClick={()=> setUpdateTaskId(task._id)}>
                                                <div >
                                                    <UpdateTask project_id={project_id} func={handleAddTask} teamMembers={members} task={task} name="updateTask" task_id={updateTaskId} assignUser={task.user[0]}/>
                                                    <DeleteTask task={task}/>
                                                </div>
                                            </div>
                                        </td>}
                                    </tr> 
                            )
                        })}
                    </tbody> 
                </table>
                {(tasks.length === 0) && <p className='display-5 fst-italic text-light position-absolute top-50' style={{left: "45%"}}>No task yet!</p>}
                {/* <Calendar calendarEvents={tasks} /> */}
            </div>
        </div>

    )
}

export default page

