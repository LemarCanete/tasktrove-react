"use client"
import React, { Component, useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import axios from 'axios';
import Modal from 'react-modal'
import {BsCalendarWeekFill, BsX } from 'react-icons/bs';

const Gantt= dynamic(()=>{return import("../components/Gantt")}, {ssr:false})
const customStyles = {
    overlay: {
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.5)'
      },
    content: {
        top: '50%',
        left: '50%',
        right: 'auto',
        bottom: 'auto',
        marginRight: '-50%',
        transform: 'translate(-50%, -50%)',
    },
};

Modal.setAppElement(document.getElementById('__next'));

const ShowGantt = ({ project_id }) => {
    const [data, setData] = useState(null);
    let subtitle;
    const [modalIsOpen, setIsOpen] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
        try {
            const response = await axios.get(`https://tasktrove-server.onrender.com/getTasks/${project_id}`);
            const taskDetails = new TaskDetails(response.data);
            const taskDetailsArray = taskDetails.getTaskDetailsArray();
            setData(taskDetailsArray);
        } 
        catch (error) {
            console.error('Error:', error.message);
        }
        };

        if (project_id) {
        fetchData();
        }
    }, [project_id]);

    if (!data) {
        // Data is still being fetched, you can render a loading state or return null
        return null;
    }

    function afterOpenModal() {
        // references are now sync'd and can be accessed.
        subtitle.style.color = '#f00';
    }
    return (
        <>
            <p className='fs-4 text-center my-0 mx-2 text-secondary' style={{cursor: 'pointer'}} onClick={()=>setIsOpen(true)}><BsCalendarWeekFill /></p>
            
            <Modal isOpen={modalIsOpen}
                onAfterOpen={afterOpenModal}
                onRequestClose={()=>setIsOpen(false)}
                style={customStyles}
                contentLabel="Gannt Chart"
            >
                <div className="gantt-container" style={{height: "70vh", width: "85vw"}}>
                    <div className="d-flex justify-content-between align-items-center">
                        <h4 ref={(_subtitle) => (subtitle = _subtitle)} className='text-primary'>Gantt Chart</h4>
                        <p className='fs-2 p-0 m-0' onClick={()=>setIsOpen(false)} style={{cursor: 'pointer'}}><BsX /></p>
                    </div>
                    <Gantt tasks={{ data }} />
                </div>
                
            </Modal>
        </>
    );
};
  class TaskDetails {
    constructor(taskDataArray) {
      this.taskDataArray = taskDataArray;
    }
  
    getTaskDetailsArray() {
      return this.taskDataArray.map((taskData) => {
        return {
          start_date: this.getStartDate(taskData.createdAt),
          text: taskData.taskName,
          id: taskData._id,
          duration:this.getDuration(taskData),
          progress: 100,
        };
      });
    }
  
    getStartDate(taskData) {
    
    const inputDate = new Date(taskData);
    
    // Ensure the input is a valid date
    if (isNaN(inputDate)) {
      console.error('Invalid date input');
      return null;
    }
  
    const year = inputDate.getUTCFullYear();
    const month = String(inputDate.getUTCMonth() + 1).padStart(2, '0');
    const day = String(inputDate.getUTCDate()).padStart(2, '0');
  
    return `${year}-${month}-${day}`;
  
    }
    getEndDate(taskData) {
      return new Date(taskData.createdAt).toISOString().replace(/T/, ' ').replace(/\..+/, '');;
    }
  
    getDuration(taskData) {
      const startDate = new Date(taskData.createdAt);
      const deadline = new Date(taskData.deadline);
      const durationInMilliseconds = deadline - startDate;
      const durationInDays = durationInMilliseconds / (1000 * 60 * 60 * 24);
      return durationInDays;
    }
  }

  export default ShowGantt;
