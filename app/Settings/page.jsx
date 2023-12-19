import React from 'react'
import { SideNav } from '../components'

const page = () => {
    return (
        <div className="container-fluid d-flex p-0 flex">
                <SideNav />
                <div className='d-block w-100 bg-custom-gray p-3'>
                    <p className='fw-semibold display-4'>Settings</p>
                    
                </div>

            </div>
    )
}

export default page