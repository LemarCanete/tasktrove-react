'use client'
import React, { useEffect } from 'react'
import { useCookies } from 'react-cookie';
import Link from 'next/link';
import { BsArrowLeftCircle } from 'react-icons/bs'

import SideNav from '@/app/Admin/Components/SideNav'
import Form from './UserForm'
import { redirect } from 'next/navigation';


const Profile = () => {
    const [cookies] = useCookies(['id']);
    const id = cookies['id'];

    // If the 'id' cookie is not present, redirect to the login page
    useEffect(()=>{
        if (id === undefined) {
            redirect('/Login');
            return null;
        }
    }, [])


    return (
        <div className="container-fluid d-flex p-0 " style={{overflow: "hidden", height: "100vh"}}>
            <SideNav active="Admin/Profile"/>
            <div className='w-100 d -block p-4 content-wrapper'>
                {/* <Link className='border-0 bg-white' href="/Admin/Dashboard"><BsArrowLeftCircle className='fs-2'/></Link> */}
                <h1 className='display-1 text-center m-4'>Profile</h1>
                <div className='d-flex align-items-center justify-content-center'>
                    <Form id={id}/>
                </div>
            </div>
        </div>  
    );
  };
  

export default Profile