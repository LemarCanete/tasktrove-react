'use client'
import React, {useState} from 'react';
import {AiFillHome, AiFillFile, AiFillBell} from 'react-icons/ai'
import {RiTeamFill, RiLogoutBoxRLine} from 'react-icons/ri'
import {BsListTask, BsCalendarWeekFill, BsCodeSlash, BsPersonBoundingBox, BsPersonCircle, BsGrid} from 'react-icons/bs'
import Link from 'next/link';

function SideNav({active}) {
    const [isCollapse, setIsCollapse] = useState(true)

    return (
        <div className="vh-100 top-0" style={{position: 'sticky !important'}} id='nav-section'>
            <div className="d-flex flex-column justify-content-between bg-primary w-100 vh-100" id="nav">
                {/* main tabs */}
                <div className="list-group list-group-flush">
                    <div className="logo-container text-center p-3">
                        <Link href="/Admin/Dashboard" className="text-decoration-none w-100"><img src="https://upload.wikimedia.org/wikipedia/en/8/8c/Cebu_Institute_of_Technology_University_logo.png" alt="" style={{width: "40px"}} className='p-0'/></Link>
                    </div>
                    <hr className="text-light text-white" />

                    <NavLink navTo="Admin/Dashboard" icon={<AiFillHome className={`fs-4 ${!isCollapse ? "" : ""}`}/>} navTitle="Dashboard" active={active} isCollapse={isCollapse} setIsCollapse={setIsCollapse}/>
                    <NavLink navTo="Admin/Projects" icon={<BsGrid className={`fs-4 ${!isCollapse ? "" : ""}`} />} navTitle="Projects" active={active} isCollapse={isCollapse} setIsCollapse={setIsCollapse}/>
                    {/* <NavLink navTo="Admin/Reports" icon={<BsBarChartSteps className={`fs-4 ${!isCollapse ? "" : ""}`}/>} navTitle="Reports" active={active} isCollapse={isCollapse} setIsCollapse={setIsCollapse}/> */}
                    <NavLink navTo="Admin/Files" icon={<AiFillFile className={`fs-4 ${!isCollapse ? "" : ""}`}/>} navTitle="Files" active={active} isCollapse={isCollapse} setIsCollapse={setIsCollapse}/>
                    <NavLink navTo="Admin/Teams" icon={<RiTeamFill className={`fs-4 ${!isCollapse ? "" : ""}`} />} navTitle="Teams" active={active} isCollapse={isCollapse} setIsCollapse={setIsCollapse}/>
                    <NavLink navTo="Admin/Tasks" icon={<BsListTask className={`fs-4 ${!isCollapse ? "" : ""}`}/>} navTitle="Tasks" active={active} isCollapse={isCollapse} setIsCollapse={setIsCollapse}/>
                    <NavLink navTo="Admin/Gantt" icon={<BsCalendarWeekFill className={`fs-4 ${!isCollapse ? "" : ""}`} />} navTitle="Gantt" active={active} isCollapse={isCollapse} setIsCollapse={setIsCollapse}/>
                    {/* <NavLink navTo="Admin/Notification" icon={<AiFillBell className={`fs-4 ${!isCollapse ? "" : ""}`}/>} navTitle="Notification" active={active} isCollapse={isCollapse} setIsCollapse={setIsCollapse}/> */}
                    <NavLink navTo="Admin/Users" icon={<BsPersonBoundingBox className={`fs-4 ${!isCollapse ? "" : ""}`}/>} navTitle="Users" active={active} isCollapse={isCollapse} setIsCollapse={setIsCollapse}/>
                </div>

                {/* settings and profile */}
                <div className="list-group list-group-flush">
                    <hr className="text-light" />
                    <NavLink navTo="Admin/Profile" icon={<BsPersonCircle className={`fs-4 ${!isCollapse ? "" : ""}`}/>} navTitle="Profile" active={active} isCollapse={isCollapse} setIsCollapse={setIsCollapse}/>
                    <NavLink navTo="Login" icon={<RiLogoutBoxRLine className={`fs-4 ${!isCollapse ? "" : ""}`}/>} navTitle="Logout" active={active} isCollapse={isCollapse} setIsCollapse={setIsCollapse}/>
                    
                </div>
            </div> 
        </div>
        
    );
}

const NavLink = ({icon, navTitle, navTo, isCollapse, active, setIsCollapse}) =>{
    return(
        <Link href={`/${navTo}`} className={`list-group-item list-group-item-action text-light bg-primary border-0 py-3 px-4 hover-text-success ${isCollapse ? "justify-content-center" : "pe-5"} d-flex ${(active === navTo) ? "nav-item-active" : ""}`} aria-current="true" onMouseEnter={()=>setIsCollapse(false)} onMouseLeave={()=>setIsCollapse(true)} >
            {icon} {!isCollapse && <p className='p-0 m-0 ps-3 fs-6'>{navTitle}</p>}</Link>
    )
}
export default SideNav;