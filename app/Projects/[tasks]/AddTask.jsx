'use client'
import { notifyError, notifySuccess } from '@/app/components/Notify/Notify';
import axios from 'axios'
import React, {useEffect, useState} from 'react'
// import { BsTrash } from 'react-icons/bs'
import Modal from 'react-modal'

const getCurrentDateTime = () => {
    const today = new Date();
    const offset = today.getTimezoneOffset();
    today.setMinutes(today.getMinutes() - offset);
  
    // Format: "YYYY-MM-DDTHH:mm"
    const formattedDate = today.toISOString().slice(0, -8);
  
    // Ensure the timezone is fixed (e.g., UTC)
    return formattedDate;
};
  

const initialDeadline = () =>{
    const today = new Date();
    const offset = today.getTimezoneOffset();
    today.setMinutes(today.getMinutes() - offset);
    return today.toISOString().slice(0, -8); // Format: "YYYY-MM-DDTHH:mm"
}

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
Modal.setAppElement("body")

const AddTask = ({project_id, teamMembers, teamId, task_id}) => {
    let subtitle;
    const [taskName, setTaskName] = useState("")
    const [description, setDescription] = useState("")
    const [priority, setPriority] = useState("normal")
    const [deadline, setDeadline] = useState(initialDeadline())
    const [assignTo, setAssignTo] = useState("")
    const [modalIsOpen, setIsOpen] = useState(false)
    
    const members = teamMembers

    const handleSubmitTask = async(e) =>{
        e.preventDefault();
        try{
            const tasksRes = await axios.post(`https://tasktrove-server.onrender.com/addTask`, {project_id, taskName, description, priority, deadline, assignTo, teamId})
            notifySuccess("Task added Successfully")
            window.location.reload()
            
        }catch(err){
            console.log(err)
            notifyError("Add Project unsuccessful! Change a few things up and try submitting again")
        }
    }
    function afterOpenModal() {
        subtitle.style.color = '#f00';
    }   
    return (
        <>
            <button onClick={() => setIsOpen(true)} className='btn btn-info w-100 me-5'>Add Task</button>
            <Modal isOpen={modalIsOpen}
                onAfterOpen={afterOpenModal}
                onRequestClose={() => setIsOpen(false)}
                style={customStyles}
                contentLabel="Add Task">
                <form onSubmit={handleSubmitTask}>
                    <h3 ref={(_subtitle) => (subtitle = _subtitle)} className='text-primary text-center'>Add Task</h3>
                    <div className="mb-3">
                        <label htmlFor="name" className="form-label">Name:</label>
                        <input type="text" className="form-control" id="name"  onChange={(e) => setTaskName(e.target.value)}/>
                    </div>
                    <div className="mb-3">
                        <label htmlFor="description" className="form-label">Description:</label>
                        <textarea className="form-control" id="description" rows="3" onChange={(e) => setDescription(e.target.value)}></textarea>
                    </div>
                    <div className="d-flex flex-row mb-3">
                        <div className='w-50'>
                            <label htmlFor="priority" className='form-label'>Priority:</label>
                            <select className="form-select" aria-label="Default select example" id='priority' onChange={(e) => setPriority(e.target.value)}>
                                <option value="normal">Normal</option>
                                <option value="critical">Critical</option>
                                <option value="high">High</option>
                                <option value="medium">Medium</option>
                                <option value="low">Low</option>
                            </select>
                        </div>
                        <div className='w-50 ms-4'>
                            <label htmlFor="duration" className='form-label'>Deadline: </label>
                            <input type="datetime-local" id='duration' className='form-control' onChange={(e) => setDeadline(e.target.value)} value={deadline} min={getCurrentDateTime()}/>
                        </div>
                    </div>
                    <div className='w-100'>
                            <label htmlFor="priority" className='form-label'>Assign To:</label>
                            <select className="form-select" aria-label="Default select example" required id='assignTo' onChange={(e) => setAssignTo(e.target.value)}>
                                <option value=""></option>
                            {members.map(member => {
                                return <option value={member._id} key={member._id}>{member.firstName + " " + member.lastName}</option>
                            })}
                            </select>
                        </div>
                    <div className="d-flex flex-row justify-content-end py-3">
                        <button onClick={()=>setIsOpen(false)} className='btn btn-white'>Close</button>
                        <button type="submit" className="btn btn-info">Save</button>
                    </div>
                </form>
            </Modal>
        </>
    )
}

export default AddTask