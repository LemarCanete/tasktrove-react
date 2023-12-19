import React from 'react'

const DeleteModal = ({title, content, func, id, deleteUserId}) => {
    console.log(deleteUserId);
    return (
        <div className="modal fade" tabIndex="-1" id={id}>
            <div className="modal-dialog" role="document">
                <div className="modal-content">
                <div className="modal-header">
                    <h5 className="modal-title">Delete {title}</h5>
                    <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close">
                    <span aria-hidden="true"></span>
                    </button>
                </div>
                <div className="modal-body">
                    <p>{content}</p>
                </div>
                <div className="modal-footer">
                    <button type="button" className="btn btn-danger" onClick={()=>func(deleteUserId)} data-bs-dismiss="modal">Delete</button>
                    <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
                </div>
                </div>
            </div>
        </div>
    )
}

export default DeleteModal