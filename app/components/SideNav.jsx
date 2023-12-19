'use client'
import React from 'react';
import {AiFillFile, AiFillBell, AiFillHome} from 'react-icons/ai'
import {RiTeamFill, RiLogoutBoxRLine} from 'react-icons/ri'
import {BsListTask, BsCalendarWeekFill, BsCodeSlash, BsBarChartSteps, BsHouse, BsPersonCircle, BsGrid, BsChat, BsChatFill} from 'react-icons/bs'


import Link from 'next/link';
import { useState } from 'react';


function SideNav({active}) {
    const [isCollapse, setIsCollapse] = useState(true)

    return (
        <div className="vh-100 top-0" style={{position: 'sticky !important'}} id='nav-section'>
            <div className="d-flex flex-column justify-content-between bg-primary w-100 vh-100" id="nav">
                {/* main tabs */}
                <div className="list-group list-group-flush">
                    <div className="logo-container text-center p-3">
                        <Link href="/Dashboard" className="text-decoration-none w-100"><img src="https://upload.wikimedia.org/wikipedia/en/8/8c/Cebu_Institute_of_Technology_University_logo.png" alt="" style={{width: "40px"}} className='p-0'/></Link>
                    </div>
                    <hr className="text-light text-white" />

                    <NavLink navTo="Dashboard" icon={<AiFillHome className={`fs-4 ${!isCollapse ? "" : ""}`}/>} navTitle="Dashboard" active={active} isCollapse={isCollapse} setIsCollapse={setIsCollapse}/>
                    <NavLink navTo="Projects" icon={<BsGrid className={`fs-4 ${!isCollapse ? "" : ""}`} />} navTitle="Projects" active={active} isCollapse={isCollapse} setIsCollapse={setIsCollapse}/>
                    <NavLink navTo="Files" icon={<AiFillFile className={`fs-4 ${!isCollapse ? "" : ""}`}/>} navTitle="Files" active={active} isCollapse={isCollapse} setIsCollapse={setIsCollapse}/>
                    <NavLink navTo="Teams" icon={<RiTeamFill className={`fs-4 ${!isCollapse ? "" : ""}`} />} navTitle="Teams" active={active} isCollapse={isCollapse} setIsCollapse={setIsCollapse}/>
                    <NavLink navTo="Tasks" icon={<BsListTask className={`fs-4 ${!isCollapse ? "" : ""}`}/>} navTitle="Tasks" active={active} isCollapse={isCollapse} setIsCollapse={setIsCollapse}/>
                    <NavLink navTo="Gantt" icon={<BsCalendarWeekFill className={`fs-4 ${!isCollapse ? "" : ""}`} />} navTitle="Gantt" active={active} isCollapse={isCollapse} setIsCollapse={setIsCollapse}/>
                    <NavLink navTo="Chat" icon={<BsChatFill className={`fs-4 ${!isCollapse ? "" : ""}`}/>} navTitle="Chat" active={active} isCollapse={isCollapse} setIsCollapse={setIsCollapse}/>
                    {/* <NavLink navTo="Notification" icon={<AiFillBell className={`fs-4 ${!isCollapse ? "" : ""}`}/>} navTitle="Notification" active={active} isCollapse={isCollapse} setIsCollapse={setIsCollapse}/> */}
                </div>

                {/* settings and profile */}
                <div className="list-group list-group-flush">
                    <hr className="text-light" />
                    <NavLink navTo="Profile" icon={<BsPersonCircle className={`fs-4 ${!isCollapse ? "" : ""}`}/>} navTitle="Profile" active={active} isCollapse={isCollapse} setIsCollapse={setIsCollapse}/>
                    <NavLink navTo="Login" icon={<RiLogoutBoxRLine className={`fs-4 ${!isCollapse ? "" : ""}`}/>} navTitle="Logout" active={active} isCollapse={isCollapse} setIsCollapse={setIsCollapse}/>
                    
                </div>
            </div> 
        </div>
        
    );
}

const NavLink = ({ icon, navTitle, navTo, isCollapse, active, setIsCollapse }) => {
    const notificationsArray = [
        {
            startDate: "10-12-2023",
            content: "You have been added to team ang",
            time: 2,
            leader: "Lemar",
            read: false
        },
        {
            startDate: "10-12-2023",
            content: "You have been added to team bangan",
            time: 2,
            leader: "Lemar",
            read: true
        }
    ]
    const element = navTo === "Notification" ? (
        <button
            className={`${navTo} list-group-item list-group-item-action text-light bg-primary border-0 py-3 px-4 hover-text-success ${isCollapse ? "justify-content-center" : "pe-5"} d-flex ${(active === navTo) ? "nav-item-active" : ""}`}
            onMouseEnter={() => setIsCollapse(false)}
            onMouseLeave={() => setIsCollapse(true)}
            data-bs-container="body" 
            data-bs-toggle="popover" 
            data-bs-placement="right" 
            data-bs-content="Vivamus sagittis lacus vel augue laoreet rutrum faucibus." 
            data-bs-original-title="Popover Title" 
            aria-describedby="popover795693"
        >
            {icon} {!isCollapse && <p className="p-0 m-0 ps-3 fs-6">{navTitle}</p>}
            <span class="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger z-2">{notificationsArray.length}</span>
        </button>
           
    ) : (
      <Link
        href={`/${navTo}`}
        className={`${navTo} list-group-item list-group-item-action text-light bg-primary border-0 py-3 px-4 hover-text-success ${isCollapse ? "justify-content-center" : "pe-5"} d-flex ${(active === navTo) ? "nav-item-active" : ""}`}
        aria-current="true"
        onMouseEnter={() => setIsCollapse(false)}
        onMouseLeave={() => setIsCollapse(true)}
      >
        {icon} {!isCollapse && <p className="p-0 m-0 ps-3 fs-6">{navTitle}</p>}
      </Link>
    );
  
    // Return the appropriate element based on the condition
    return element;
  };
  

export default SideNav;