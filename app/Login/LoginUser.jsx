'use client'
import axios from 'axios';
import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation';
import { useCookies } from 'react-cookie';
import { BsEye, BsEyeSlash } from 'react-icons/bs';

import {ToastContainer} from 'react-toastify'
import {notifyError, notifySuccess} from '@/app/components/Notify/Notify'

const LoginUser = () => {

    const [emailAddress, setEmailAddress] = useState("");
    const [password, setPassword] = useState("");
    const [cookie, setCookie] = useCookies(['id', 'role']);
    const [showPassword, setShowPassword] = useState(false)

    const router = useRouter();
    const date = new Date();
    date.setDate(date.getDate() + 1)

    useEffect(() => {
        // Clear existing cookies when component mounts
        Object.keys(cookie).forEach((cookieName) => {
          setCookie(cookieName, '', { expires: new Date(0), path: '/' });
        });
      }, []); // Empty dependency array ensures this effect runs only once when the component mounts

    const Submit = async (e) => {
        try {
            e.preventDefault();
            const user = await axios.post('https://tasktrove-server.onrender.com/login', { emailAddress, password });

            const id = user.data._id;
            const role = user.data.role;

            // Clear existing cookies
            Object.keys(cookie).forEach((cookieName) => {
                setCookie(cookieName, '', { expires: new Date(0), path: '/' });
            });

            // Set new cookies
            setCookie('id', id, { expires: date, path: '/' });
            setCookie('role', role, { expires: date, path: '/' });
            console.log(user);

            if (role === 'admin') {
                router.push('/Admin/Dashboard');
            } else {
                notifySuccess('User successfully logged in!')
                router.push('/Dashboard');
            }
        } catch (err) {
            console.log(err);
            notifyError("User not found! Pls try again")
        }
    };


    return (
        <form className="form-group w-75 pb-5 text-center" onSubmit={Submit}>
            <div className="form-floating mb-3">
                <input type="email" className="form-control" id="emailAddress" placeholder="name@example.com" onChange={e => setEmailAddress(e.target.value)}/>
                <label htmlFor="floatingInput">Email address</label>
            </div>
            <div className="form-floating">
                <input type={showPassword ? 'text' : 'password'} className="form-control" id="password" placeholder="Password" autoComplete="on" onChange={e => setPassword(e.target.value)} />
                <label htmlFor="floatingPassword">Password</label>
                {showPassword ? <BsEyeSlash className="position-absolute text-secondary" style={{ top: '18px', fontSize: '25px', right: '15px', cursor: 'pointer' }} onClick={()=>setShowPassword(!showPassword)} />
                : <BsEye className="position-absolute text-secondary" style={{top: "18px", fontSize: "25px", right: "15px", cursor: "pointer"}} onClick={() => setShowPassword(!showPassword)}/>
                }
            </div>
            {/* remember me and forgot password */}
            <div className="d-flex justify-content-between w-100 p-4">
                <div className="mb-3 form-check">
                    <input type="checkbox" className="form-check-input" id="exampleCheck1" />
                    <label className="form-check-label" htmlFor="exampleCheck1" >Remember me</label>
                </div>
                <a href="/ForgotPassword">Forgot password?</a>
            </div>
            {/* Sign in button*/}
            <button type="submit" className="btn btn-info w-100">Sign in</button>

            <ToastContainer
                position="top-right"
                autoClose={5000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme="light"
            />
            <ToastContainer />
            
        </form>
        
    )
}

export default LoginUser