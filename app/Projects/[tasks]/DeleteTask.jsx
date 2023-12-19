'use client'
import axios from 'axios';
import React, {useState} from 'react'
import {BsTrashFill} from 'react-icons/bs'
import { AiFillWarning } from 'react-icons/ai';
import Modal from 'react-modal'

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
        borderRadius: "1.1em"
    },
    
};
Modal.setAppElement(document.getElementById('__next'))

const DeleteTask = ({task}) => {
    const [modalIsOpen, setIsOpen] = useState(false)
    
    const handleDelete = async () =>{
        try{
            const deleteTask = await axios.delete(`https://tasktrove-server.onrender.com/deleteTask/${task._id}`)
            console.log(deleteTask);
            window.location.reload()
        }catch(err){
            console.log(err);
        }     
    }
    
    return (
        <>
            <button className='bg-danger border-0 rounded m-1' onClick={() => setIsOpen(true)}><BsTrashFill color='white' /></button>
            <Modal isOpen={modalIsOpen}
                onRequestClose={() => setIsOpen(false)}
                style={customStyles}
                contentLabel="Delete Task">
                <div className='p-2 mb-4'>
                    <p className='text-center text-danger display-4'>{<AiFillWarning />}</p>
                    <h4 className='text-center'>Delete Task</h4>
                    <p className='text-center'>You are going to delete task "{task.taskName.toUpperCase()}". Are you sure?</p>

                </div>
                <div className="d-flex w-100">
                        <button onClick={()=>setIsOpen(false)} className='btn btn-light w-50 rounded-pill me-1'>No, keep it</button>
                        <button type="submit" className="btn btn-danger w-50  rounded-pill ms-2" onClick={handleDelete}>Delete</button>
                    </div>
            </Modal>
        </>
    )
}

export default DeleteTask