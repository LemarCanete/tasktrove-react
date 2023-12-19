import React from 'react'

const Modal = ({modalTitle, modalContent, func, id}) => {

  return (
    <div className="modal fade" tabIndex="-1" id={id}>
        <div className="modal-dialog" role="document">
            <div className="modal-content">
            <div className="modal-header">
                <h5 className="modal-title">{modalTitle}</h5>
                <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close">
                <span aria-hidden="true"></span>
                </button>
            </div>
            <div className="modal-body">
                {modalContent}
            </div>
            <div className="modal-footer">
                <button type="button" className="btn btn-primary " onClick={(e) => func(e)} data-bs-dismiss="modal">Save changes</button>
                <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
            </div>
            </div>
        </div>
    </div>
  )
}

export default Modal