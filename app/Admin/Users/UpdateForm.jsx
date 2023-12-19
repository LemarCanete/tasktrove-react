'use client'
import React, {useEffect, useState} from 'react'
import axios from 'axios';

const UpdateForm = ({id}) => {
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [userName, setUserName] = useState("");
    const [emailAddress, setEmailAddress] = useState("");
    const [password, setPassword] = useState("");

    useEffect(()=>{
        axios.get(`https://tasktrove-server.onrender.com/getUser/${id}`)
        .then(res => {
            console.log(res)
            setFirstName(res.data.firstName)
            setLastName(res.data.lastName)
            setUserName(res.data.userName)
            setEmailAddress(res.data.emailAddress)
            setPassword(res.data.password)
        })
        .catch(err => console.log(err))
    }, [id])
    const Update = (userId) =>{
        axios.put(`https://tasktrove-server.onrender.com/updateUser/${userId}`, {firstName, lastName, userName, emailAddress, password})
        .then(res => {
            console.log(res);
            window.location.reload()
        })
        .catch(err => {
            console.log(err)
        })
    }


    return (
        <form className="form-group w-100 pb-5">
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
                <input type="email" className="form-control" id="emailAddress" placeholder="name@example.com" onChange={(e)=> setEmailAddress(e.target.value)} value={emailAddress}/>
                <label htmlFor="floatingInput">Email address</label>
            </div>
            <div className="form-floating">
                <input type="password" className="form-control" id="password" placeholder="Password" autoComplete="on" onChange={(e)=> setPassword(e.target.value)} value={password}/>
                <label htmlFor="floatingPassword">Password</label>
            </div>
            {/* update button*/}
            <button type="button" className="btn btn-info w-100 mt-5" data-bs-dismiss="modal" onClick={()=>Update(id)}>Update</button>
        </form>
    )
}

export default UpdateForm