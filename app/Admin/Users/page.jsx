'use client'
import React, { useEffect } from 'react'
import { useCookies } from 'react-cookie'
import { useRouter } from 'next/navigation'

import { BsSearch, BsPen, BsTrash } from 'react-icons/bs'
// Pages
import SideNav from '@/app/Admin/Components/SideNav'
import { useState } from 'react'
import axios from 'axios'
import DeleteModal from '../Components/DeleteModal'
import UpdateForm from './UpdateForm'
import UpdateModal from '../Components/UpdateModal'

export default function page() {
    const [allUsers, setAllUsers] = useState([]);
    const [search, setSearch] = useState("");
    const [deleteUserId, setDeleteUserId] = useState("");
    const [updateUserId, setUpdateUserId] = useState("")

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

    const fetchData = async ()=>{
        try{
            let users;
            if(search === "" || search === undefined){
                users = await axios.get('https://tasktrove-server.onrender.com/getAllUsers')
            }else{
                users =  await axios.get(`https://tasktrove-server.onrender.com/searchUsers/${search}`)
            }

            console.log(users);
            setAllUsers(users.data)
        }
        catch(err){
            console.log(err);
        }
    }
    fetchData();
  }, [search])

  const handleDelete = async (id)=>{
    try{
        let userDelete = await axios.delete(`https://tasktrove-server.onrender.com/deleteUser/${id}`)
            console.log(userDelete);
            alert("Users deleted successfully")
            window.location.reload();
    }
    catch(err){
        console.log(err);
        alert("Something went wrong! Please try again...")
    }
  }

 
  return (
    <div className="container-fluid d-flex p-0" style={{overflow: "hidden", height: "100vh"}}>
      <SideNav active="Admin/Users"/>
      <div className='d-block w-100 content-wrapper'>
        <div className='p-3'>
            <h3>All Users</h3>
            <div id="search" className="input-group input-group-lg mt-3 w-100">
                <BsSearch className="fa-solid fa-magnifying-glass position-absolute mt-3 ms-2 z-1 fs-5"/>
                <input type="text" className="ps-5 form-control rounded-0 bg-transparent" onChange={(e)=> setSearch(e.target.value)}/>
            </div>

            <div className="p-3 mt-3">
                <UpdateModal title="User" content={<UpdateForm id={updateUserId}/>} id="updateUser"/>
                <DeleteModal title="User" content="Are you sure to delete user?" id="deleteUser" func={handleDelete} deleteUserId={deleteUserId}/>
                <table className="table table-hover">
                    <thead>
                        <tr>
                            <th className="" scope='col'> </th>
                            <th className="" scope='col'>First Name</th>
                            <th className="" scope='col'>Last Name</th>
                            <th className="" scope='col'>Username</th>
                            <th className="" scope='col'>Role</th>
                            <th className="" scope='col'>Email Address</th>
                            <th className="" scope='col'>Password</th>
                            {/* <th className="" scope='col'>Edit</th>
                            <th className="" scope='col'>Delete</th> */}
                        </tr>
                    </thead>
                    <tbody>
                        {allUsers.map((user, index) => {
                            return(
                                <tr key={index}>
                                    <td>{index + 1}</td>
                                    <td>{user.firstName}</td>
                                    <td>{user.firstName}</td>
                                    <td>{user.userName}</td>
                                    <td>{user.role}</td>
                                    <td>{user.emailAddress}</td>
                                    <td>{user.password}</td>
                                    {/* <td ><BsPen color='green' style={{cursor: "pointer", zIndex: 100}} data-bs-toggle="modal" data-bs-target="#updateUser" onClick={()=>setUpdateUserId(user._id)}/></td> */}
                                    {/* <td><BsTrash color='red' style={{cursor: "pointer", zIndex: 100}} data-bs-toggle="modal" data-bs-target="#deleteUser" onClick={()=>setDeleteUserId(user._id)}/></td> */}
                                </tr>
                            )
                        })}
                    </tbody>
                </table>
            </div>
        </div>
      </div>
    </div>
  );
}


