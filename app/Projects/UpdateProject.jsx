'use client'
import axios from 'axios';
import React, {useState, useEffect} from 'react'
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
    },
    
};

Modal.setAppElement("body")

const UpdateProject = ({btn, cl, project_id, projectInfo, teamName, teamsInfo}) => {
    const [modalIsOpen, setIsOpen] = React.useState(false);
    const [projectName, setProjectName] = useState(projectInfo.projectName)
    const [description, setDescription] = useState(projectInfo.description)
    const [status, setStatus] = useState(projectInfo.status)


    let subtitle;

    function afterOpenModal() {
        // references are now sync'd and can be accessed.
        subtitle.style.color = '#f00';
    }

    const handleUpdate = async() =>{
        try{
            const projectUpdateRes = await axios.put(`https://tasktrove-server.onrender.com/updateProject/${project_id}`, { projectName, description, status });
            console.log(projectUpdateRes.data);
        }catch(err){
            console.log(err);
        }
    }

    return (
        <>
            <button className={cl} onClick={()=>setIsOpen(true)}>{btn}</button>
            <Modal isOpen={modalIsOpen}
                onRequestClose={()=>setIsOpen(false)}
                onAfterOpen={afterOpenModal}
                style={customStyles}
                contentLabel="Update Project"
            >
                <h4 ref={(_subtitle) => (subtitle = _subtitle)} className='text-center text-primary'>Update modal</h4>
                <form style={{width: "25vw"}}>
                    <div className="mb-3">
                        <label htmlFor="name" className="form-label">Name:</label>
                        <input type="text" className="form-control" id="name" value={projectName} onChange={(e)=> setProjectName(e.target.value)} readOnly={false}/>
                    </div>
                    <div className="mb-3">
                        <label htmlFor="description" className="form-label">Description:</label>
                        <textarea className="form-control" id="description" rows="3" onChange={(e)=>setDescription(e.target.value)} readOnly={false} value={description}></textarea>
                    </div>
                    <div className="row">
                        <div className='col'>
                            <label htmlFor="status" className='form-label'>Team: </label>
                            <select className="form-select" aria-label="select-team" id='team-update' disabled>
                                <option value="">{teamName}</option>
                                {teamsInfo.map(res=>{
                                    return <option value={res._id} key={res._id}>{res.teamName}</option>
                                })}
                            </select>
                        </div>
                        <div className='col'>
                            <label htmlFor="status" className='form-label' >Status:</label>
                            <select className="form-select" value={status} aria-label="select-status " id='status-update' onChange={(e) => setStatus(e.target.value)}>
                                <option value="In Progress">In Progress</option>
                                <option value="Completed">Completed</option>
                                <option value="On Hold">On hold</option>
                            </select>
                        </div>
                    </div>
                    
                    <div className="d-flex justify-content-end mt-5">
                        <button className='btn btn-white me-3' onClick={()=>setIsOpen(false)}>Cancel</button>
                        <button className="btn btn-link" onClick={handleUpdate}>Save</button>
                    </div>
                </form>
            </Modal>
        </>
    )
}

export default UpdateProject