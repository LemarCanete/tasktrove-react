'use client';
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {useRouter} from 'next/navigation';
import { notifyError, notifySuccess } from '../components/Notify/Notify';

const ForgotPassword = () => {
    const [step, setStep] = useState(1);
    const [emailAddress, setEmailAddress] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [error, setError] = useState("")
    const [question, setQuestion] = useState("");
    const [answer, setAnswer] = useState("")
    const [userId, setUserId] = useState(null)
    const router = useRouter()
    const handleResetPassword = async () => {
        setError("")
        try {
            if (step === 1) {
                const response = await axios.post(`https://tasktrove-server.onrender.com/verifyEmailAddress/${emailAddress}`);
                if(response.status === 203){
                    setError(response.data.message)
                }else if(response.status === 201){
                    setQuestion(response.data.question);
                    setUserId(response.data._id)
                    setStep(2);
                }else{
                    setError("Something went wrong. Pls try again!")
                }
            }  else if(step === 2){
                const response = await axios.post(`https://tasktrove-server.onrender.com/verifyAnswerToQuestion/${userId}`, { answer });
                if(response.status === 203){
                    setError(response.data.message)
                }else if(response.status === 201){
                    console.log(response.data);
                    setStep(3);
                }else{
                    setError("Something went wrong. Pls try again!")
                }
            }else if(step === 3){
                const response = await axios.put('https://tasktrove-server.onrender.com/resetPassword', { userId, newPassword });
                if(response.status === 201){
                    router.push('/Login')
                }else{
                    setError("Something went wrong!")
                }
            }
        } catch (error) {
            setError("Something went wrong!")
        }
    };

    return (
        <div>
            <h2 className='m-5'>Forgot Password</h2>
            {step === 1 && (
                <div>
                    <p className='fw-bold fst-italic'>Step 1:</p>
                    <p>Enter your Email Address.</p>
                   
                    <div className="mb-3 form-floating">
                        <input
                            type="text"
                            className="form-control"
                            id="emailAddress"
                            onChange={(e) => setEmailAddress(e.target.value)}
                        />
                        <label htmlFor="emailAddress">Email Address</label>
                    </div>
                    <div className="d-flex justify-content-end">
                        <button type='button' className='btn btn-light' onClick={()=>router.push('/Login')}>Back</button>
                        <button type="button" className="btn btn-info ms-3" onClick={handleResetPassword}>Next</button>
                    </div>
                </div>
            )}
            {step === 2 && (
                <div>
                    <p className='fw-bold fst-italic'>Step 2:</p>
                    <p>Question: {question && question}</p>
                    <input
                            type="text"
                            className="form-control"
                            id="answer"
                            placeholder="Answer"
                            onChange={(e) => setAnswer(e.target.value)}
                        />
                    <div className="d-flex justify-content-end mt-4">
                        <button type='button' className='btn btn-light' onClick={()=>router.push('/Login')}>Back</button>
                        <button type="button" className="btn btn-info ms-3" onClick={handleResetPassword}>Next</button>
                    </div>
                </div>
            )}
            {step === 3 && (
                <div>
                    <p className='fw-bold fst-italic'>Step 3:</p>
                    <p>Verification successful. Enter your new password.</p>
                    <div className="mb-3 form-floating">
                        <input
                            type="password"
                            className="form-control"
                            id="newPassword"
                            placeholder="New Password"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                        />
                        <label htmlFor="newPassword">New Password</label>
                    </div>
                    <div className="d-flex justify-content-end mt-4">
                        <button type='button' className='btn btn-light' onClick={()=>router.push('/Login')}>Back</button>
                        <button type="button" className="btn btn-info ms-3" onClick={handleResetPassword}>Reset</button>
                    </div>
                </div>
            )}
            <span className='text-danger position-relative' style={{left: "105px", top: "70px"}}>{error && error}</span>
        </div>
    );
};
 
export default ForgotPassword;