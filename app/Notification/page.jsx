'use client'
import React from 'react'
import { SideNav } from '../components'

const page = () => {
    return (
        <div className="container-fluid d-flex p-0 flex">
                <SideNav active="Notification"/>
                <div className='d-block w-100 p-3'>
                    <h3 className=''>Notification</h3>
                    <hr className="text-info mt-4" />

                    {/* content */}
                    <div className="d-flex">
                        div.notification
                    </div>
                </div>

            </div>
    )
}

export default page