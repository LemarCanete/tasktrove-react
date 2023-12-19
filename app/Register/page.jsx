import React from 'react'
import Link from 'next/link'

import Form from './UserForm';


function Register() {
    return (
        <div className='d-flex vh-100'>
            <div className="bg-primary text-white d-flex flex-column w-50 justify-content-center align-items-center">
                <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/3/39/Happy_Cartoon_Man_At_Work_Using_A_Computer.svg/2560px-Happy_Cartoon_Man_At_Work_Using_A_Computer.svg.png" 
                    alt="" className='img-fluid w-75' />
                <h4 className='mt-5'>Already have an account? <Link href="/Login">Sign in</Link></h4>
            </div>
            <div className="d-flex flex-column justify-content-center align-items-center w-50 pb-5">
                <h2 className='mb-4 display-5 fw-medium pT-4'>Sign up</h2>
                <Form />
                {/* <div className='d-flex w-100 justify-content-center'>
                    <hr className='text-primary w-25'/>
                    <p className='px-5'>or</p>
                    <hr className='text-primary w-25'/>
                </div> */}
            </div>
        </div>
    )
}

export default Register