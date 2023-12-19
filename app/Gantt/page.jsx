'use client'
import React, { useEffect } from 'react'

import { SideNav } from '../components'
import GanttChart from './Gantt'
import { useCookies } from 'react-cookie'

const page = () => {
    const [cookies] = useCookies(['id']);
    const id = cookies['id'];

    useEffect(()=>{
        if (id === undefined) {
            redirect('/');
            return null;
        }
    }, [])
    return (
        <div className="container-fluid d-flex p-0 m-0" style={{overflow: "hidden", height: "100vh"}}>
                <SideNav active="Gantt"/>
                <div className='d-block w-100 p-3 content-wrapper'>
                    <h3>Gantt</h3>
                    <GanttChart id={id}/>
                </div>

            </div>
    )
}

export default page