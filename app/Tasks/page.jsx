'use client'
import React, { useEffect, useState } from 'react'
import { SideNav } from '../components'
import axios from 'axios'
import { useCookies } from 'react-cookie'
import { useRouter } from 'next/navigation'
const page = () => {
    const [cookies] = useCookies(['id']);
    const id = cookies['id'];
    const [tasks, setTasks] = useState([]);
    const [status, setStatus] = useState("All Tasks")
    const statusArray = ["All Tasks", "In Progress", "Late", "Completed"]
    const router = useRouter();
    // If the 'id' cookie is not present, redirect to the login page
    useEffect(()=>{
        if (id === undefined) {
            redirect('/Login');
            return null;
        }
    }, [])
 
    useEffect(()=>{
        const fetchData = async()=>{
            const tasksRes = await axios.get('https://tasktrove-server.onrender.com/getAllTasks')
            let filteredTasks = tasksRes.data.filter(task => task.assignTo === id)
            setTasks(filteredTasks)
            console.log(filteredTasks);
        }
        fetchData();
    }, [status])
  return (
    <div className="container-fluid d-flex p-0 flex" style={{overflow: "hidden", height: "100vh"}}>
     
      <SideNav active="Tasks" />
      <div className='d-block w-100 p-3 content-wrapper'>
           <div className="content-container">
                 <h3>Task List</h3>
                 <hr className='w-100'/>
                 <div className='d-flex'>
                    {statusArray.map((stat, key) => {
                        return <p className={`px-3 py-2 ${stat === status && "border-bottom"} text-center`}
                         key={key} style={{cursor: "pointer"}}
                         onClick={() => setStatus(stat)}>{stat}</p>
                    })}
                 </div>
                  <div>  
                  {tasks.map((task, index) => {
                    return (status === "All Tasks" || task.status === status) ? (
                        <div className="d-flex justify-content-between border m-1 task-list align-items-center rounded" onClick={()=> router.push(`/Projects/${task.project_id}`)}>
                            <p className='p-3 m-0' key={index}>{task.taskName}</p>
                            <p className='m-0 p-3'>2 days ago</p>
                        </div>
                    ) : null;
                    })}
                  </div>
            </div>
      </div>
    </div>
  )
}
 
export default page