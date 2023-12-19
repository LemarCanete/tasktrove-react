import React from 'react'

const UpdateModal = ({title, content, id}) => {
    return (
        <div className="modal fade" tabIndex="-1" id={id}>
            <div className="modal-dialog" role="document">
                <div className="modal-content">
                <div className="modal-header">
                    <h5 className="modal-title">Update {title}</h5>
                    <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close">
                    <span aria-hidden="true"></span>
                    </button>
                </div>
                <div className="modal-body">
                    {content}
                </div>
                <div className="modal-footer">
                    {/* <button type="button" className="btn btn-danger" onClick={()=>func(updateUserId)} data-bs-dismiss="modal">Update</button>
                    <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button> */}
                </div>
                </div>
            </div>
        </div>
    )
}

export default UpdateModal