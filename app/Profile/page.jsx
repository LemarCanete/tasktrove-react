'use client'
import React, { useEffect } from 'react'
import { useCookies } from 'react-cookie';
import Link from 'next/link';
import { BsArrowLeftCircle } from 'react-icons/bs'

import { SideNav } from '../components'
import Form from './UserForm'
import { redirect } from 'next/navigation';
import { ToastContainer } from 'react-toastify';


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
        <div className="container-fluid d-flex p-0 ">
            <SideNav active="Profile"/>
            <div className='w-100 d -block p-4'>
                <h1 className='display-1 text-center m-4'>Profile</h1>
                <div className='d-flex align-items-center justify-content-center my-5' >
                    <Form id={id}/>
                </div>

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
            </div>
        </div>  
    );
  };
  

export default Profile