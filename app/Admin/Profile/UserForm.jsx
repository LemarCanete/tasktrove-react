'use client'
import React, {useEffect, useState} from 'react'
import axios from 'axios';

import Modal from '@/app/components/Modal';
import { notifyError, notifySuccess } from '@/app/components/Notify/Notify';

const Form = ({id}) => {
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [userName, setUserName] = useState("");
    const [emailAddress, setEmailAddress] = useState("");
    const [password, setPassword] = useState("");
    const [phoneNumber, setPhoneNumber] = useState("");

    useEffect(()=>{
        axios.get(`https://tasktrove-server.onrender.com/getUser/${id}`)
        .then(res => {
            console.log(res)
            setFirstName(res.data.firstName)
            setLastName(res.data.lastName)
            setUserName(res.data.userName)
            setEmailAddress(res.data.emailAddress)
            setPassword(res.data.password)
            setPhoneNumber(res.data.phoneNumber)
        })
        .catch(err => console.log(err))
    }, [])
    const Update = (e) =>{
        e.preventDefault()
        axios.put(`https://tasktrove-server.onrender.com/updateUser/${id}`, {firstName, lastName, userName, emailAddress, password, phoneNumber})
        .then(res => {
            console.log(res);
            notifySuccess("Update Successfully!")
        })
        .catch(err => {
            console.log(err)
            notifyError("Update unsuccessful! Change a few things up and try submitting again")
        })
    }


    return (
        <form className="form-group pb-5 col-lg-6 mt-3">
            <div className="d-flex justify-content-between">
                <div className="form-floating mb-3 w-50">
                    <input type="text" className="form-control" id="firstName" placeholder="first name" onChange={e => setFirstName(e.target.value)} value={firstName}/>
                    <label htmlFor="floatingInput">First name</label>
                </div>
                <div className="form-floating mb-3 w-50 ms-2">
                    <input type="text" className="form-control" id="lastName" placeholder="last name" onChange={e=> setLastName(e.target.value)} value={lastName}/>
                    <label htmlFor="floatingInput">Last name</label>
                </div>
            </div>
            
            <div className="form-floating mb-3">
                <input type="text" className="form-control" id="userName" placeholder="username" onChange={(e)=> setUserName(e.target.value)} value={userName}/>
                <label htmlFor="floatingInput">Username</label>
            </div>
            <div className="form-floating mb-3">
                <input type="email" className="form-control" id="emailAddress" placeholder="name@example.com" onChange={(e)=> setEmailAddress(e.target.value)} value={emailAddress} disabled/>
                <label htmlFor="floatingInput">Email address</label>
            </div>
            <div className="form-floating mb-3">
                <input type="text" className="form-control" id="phoneNumber" placeholder="phone number" onChange={(e)=> setPhoneNumber(e.target.value)} value={phoneNumber} disabled/>
                <label htmlFor="floatingInput">Phone number</label>
            </div>
            <div className="form-floating">
                <input type="password" className="form-control" id="password" placeholder="Password" autoComplete="on" onChange={(e)=> setPassword(e.target.value)} value={password}/>
                <label htmlFor="floatingPassword">Password</label>
            </div>
            {/* update button*/}
            <div className="">
                {/* <button type="button" className="btn btn-danger w-50 mt-5" >Delete</button> */}
                <button type="button" className="btn btn-info w-100 mt-5"  data-bs-toggle="modal" data-bs-target="#updateProfile" >Update</button>
            </div>
            <Modal modalTitle="Update Profile" modalContent="Are you sure to update your profile?" func={Update} id="updateProfile"/>
            
        </form>
    )
}

export default Form