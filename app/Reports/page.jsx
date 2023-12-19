import React from 'react'
import { SideNav } from '../components'
import Reports from './Reports'

const page = () => {
    return (
        <div className="container-fluid d-flex p-0 flex">
                <SideNav active="Reports"/>
                <div className='d-block w-100 p-3'>
                    <h3 className=''>All Reports</h3>
                    <Reports />
                </div>

            </div>
    )
}

export default page