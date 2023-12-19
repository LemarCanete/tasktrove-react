'use client'
import React, { useEffect } from 'react'
import { useCookies } from 'react-cookie'
import { useRouter } from 'next/navigation'
// Pages
import SideNav from '@/app/Admin/Components/SideNav'
import { useState } from 'react'
import { BsSearch } from 'react-icons/bs'
import axios from 'axios'

const page = () => {
    const [search, setSearch] = useState("")
    const [files, setFiles] = useState([])
    const [tasks, setTasks] = useState([]);
    const [users, setUsers] = useState([])

    const router = useRouter();
    const [cookies] = useCookies(['id', 'role']);
    const id = cookies['id'];
    const role = cookies['role']

  // If the 'id' cookie is not present, redirect to the login page
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
            const filesRes = await axios.get(`https://tasktrove-server.onrender.com/getAllFiles`)
            setFiles((search === "") ? filesRes.data : filesRes.data.filter(file => file.fileName.toLowerCase().includes(search.toLowerCase()) || 
            file.fileName.includes(search)))

            const tasksRes = await axios.get(`https://tasktrove-server.onrender.com/getAllTasks`)
            setTasks(tasksRes.data)

            const usersRes = await axios.get(`https://tasktrove-server.onrender.com/getAllUsers`)
            setUsers(usersRes.data)

        }catch(err){
            console.log(err);
        }
    }
    fetchData()

  }, [search])

  return (
    <div className="container-fluid d-flex p-0" style={{overflow: "hidden", height: "100vh"}}>
      <SideNav active="Admin/Files"/>
      <div className='d-block w-100 content-wrapper'>
            <div className="row m-3">
                <h3>All Files</h3>
                <div id="search" className="input-group input-group-lg mt-3 w-100">
                    <BsSearch className="fa-solid fa-magnifying-glass position-absolute mt-3 ms-2 z-1 fs-5"/>
                    <input type="text" className="ps-5 form-control rounded-0 bg-transparent" onChange={(e)=> setSearch(e.target.value)}/>
                </div>

                {/* table */}
                <table className="table table-hover mt-3">
                    <thead>
                        <tr>
                            <th scope='col'>FILE NAME</th>
                            <th scope='col'>TYPE</th>
                            <th scope='col'>SIZE</th>
                            <th scope='col'>PATH</th>
                            <th scope='col'>UPLOADED TIME</th>
                            <th scope='col'>TASK NAME</th>
                            <th scope='col'>UPLOADED BY</th>
                        </tr>
                    </thead>
                    <tbody>
                        {files.map((file, key) => {
                            
                            let taskFile = "";
                            let fileUploader = "";

                            for(const i of tasks){
                                if(file.task_id === i._id) taskFile = i;
                            }
                            for(const i of users){
                                if(i._id === file.assignedTo) fileUploader = i;
                            }
                            console.log(fileUploader);
                            return <tr key={key}>
                                <td>{file.originalName}</td>
                                <td>{file.type}</td>
                                <td>{file.size}</td>
                                <td>{file.path}</td>
                                <td>{file.createdAt.split("T")[0]}</td>
                                <td>{taskFile && taskFile.taskName}</td>
                                <td>{fileUploader && fileUploader.firstName} {fileUploader && fileUploader.lastName}</td>
                            </tr>
                        })}
                    </tbody>
                </table>
            </div>
      </div>
    </div>
  );
}

export default page