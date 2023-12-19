import axios from 'axios';
import React, {useState} from 'react'
import { AiFillWarning } from 'react-icons/ai';
import { RiDeleteBack2Fill } from 'react-icons/ri';
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
        borderRadius: "1.1em",
        width: "25%"
    },
};
Modal.setAppElement(document.getElementById('__next'))

const DeleteTeamMember = ({member, teamName}) => {
    const [modalIsOpen, setIsOpen] = useState(false)
    const handleDelete = async () =>{
        try{
            const id = member._id
            const deleteTeamMember = await axios.delete(`https://tasktrove-server.onrender.com/deleteTeamMember`,  { data: { id, teamName } })
            deleteTeamMember && window.location.reload()
        }catch(err){
            console.log(err);
        }     
    }
  return (
        <>
           <RiDeleteBack2Fill className='text-danger ms-4 fs-3' onClick={()=> setIsOpen(true)}/>
            <Modal isOpen={modalIsOpen}
                onRequestClose={() => setIsOpen(false)}
                style={customStyles}
                contentLabel="Delete Team Member">
                <div className='p-2 mb-4'>
                    <p className='text-center text-danger display-4'>{<AiFillWarning />}</p>
                    <h4 className='text-center'>Delete Team Member "{member.userName.toUpperCase()}"</h4>
                    <p className='text-center'>Deleting this member will remove all associated projects, tasks and files. Proceed?</p>
                </div>
                <div className="d-flex w-100">
                    <button onClick={()=>setIsOpen(false)} className='btn btn-light w-50 rounded-pill me-1'>No, keep it</button>
                    <button type="submit" className="btn btn-danger w-50  rounded-pill ms-2" onClick={handleDelete}>Delete</button>
                </div>
            </Modal> 
        </>
  )
}

export default DeleteTeamMember