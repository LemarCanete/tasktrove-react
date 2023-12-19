'use client'
import React, { useEffect } from 'react'
import { useCookies } from 'react-cookie'
import { redirect } from 'next/navigation'
import Link from 'next/link'

import { BsArrowLeftCircle } from 'react-icons/bs'

// Pages
import { SideNav } from '@/app/components'
import AddProjectForm from './AddProjectForm'
import { ToastContainer } from 'react-toastify'

const AddProject = () => {
    const [cookies] = useCookies(['id']);
    const id = cookies['id'];
  
    // If the 'id' cookie is not present, redirect to the login page
    useEffect(()=>{
      if (id === undefined) {
          redirect('/');
          return null;
        }
    }, [])

  return (
    <div className="container-fluid d-flex p-0">
          <SideNav/>
          <div className='d-block w-100 p-5'>
            <Link className='border-0 bg-white' href="/Projects"><BsArrowLeftCircle className='fs-2'/></Link>
            <p className='display-6 text-center my-5'>Add a Project </p>
            <AddProjectForm user_id={id}/>
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
  )
}

export default AddProject