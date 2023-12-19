'use client'
import React, { useEffect, useState, useRef } from 'react'
import { RiWalkFill } from 'react-icons/ri';
import Joyride from 'react-joyride';
import { Tooltip } from 'react-tooltip'
import 'react-tooltip/dist/react-tooltip.css'

const Tour = () => {
    const [registered, setRegistered] = useState(false)
    const [run, setRun] = useState();
    const steps =  [
        {
            target: 'body',
            title: <h3>Welcome to TaskTrove</h3>,
            content: <p>Your no.1 Project management System</p>,
            placement: "center",
            disableBeacon: true,
        },
        {
            target: '.Dashboard',
            title: "Dashboard",
            content: 'Welcome to your Dashboard! Get an overview of key information and metrics here.',
        },
        {
            target: '.Teams',
            title: "Teams",
            content: 'Manage and collaborate with your teams. Create and view existing teams.',
        },
        {
            target: '.Projects',
            title: "Projects",
            content: 'Explore and manage your projects. Add new projects, view details, and track progress.',
            
        },
        {
            target: '.Gantt',
            title: "Gantt",
            content: 'Visualize your project tasks with the Gantt chart. Track timelines and dependencies.',
        },
        {
            target: '.Tasks',
            title: "Tasks",
            content: 'View and manage all your tasks. Keep track of assigned tasks and their status.',
        },
        {
            target: '.Files',
            title: "Files",
            content: 'Access and manage project files. Upload, download, and organize your documents.',
        },
        // {
        //     target: '.Reports',
        //     title: "Reports",
        //     content: 'View All Reports of your projects',
        // },
    ];
    const handleTour = ()=>{
        setRegistered(()=>!registered)
    }
    return (
        <div className='tour-component'>
            <p className='position-absolute fs-4 text-info' style={{right: "20px", cursor: 'pointer', top: "8px"}} 
                data-tooltip-id="system_tour" data-tooltip-content="Have a little tour of our system" onClick={handleTour}>
                <RiWalkFill />
            </p>

            <Tooltip id='system_tour' place='bottom-left' arrowColor=''/>
            {typeof window !== 'undefined' && registered && (
                <Joyride
                steps={steps}
                continuous={true}
                showProgress={true}
                showSkipButton={true}
                scrollOffset={10}
                hideCloseButton={true}
                run={run}
                />
            )}
        </div>
    )
}

export default Tour