'use client'
import React, {useState} from 'react'
import axios from 'axios';
import { useCookies } from 'react-cookie';
import { useRouter } from 'next/navigation';
import { notifyError, notifySuccess, notifyInfo } from '../components/Notify/Notify';
import { ToastContainer } from 'react-toastify';

const Form = () => {
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [userName, setUserName] = useState("");
    const [emailAddress, setEmailAddress] = useState("");
    const [password, setPassword] = useState("");
    const [cookie, setCookie] = useCookies(['id', 'registered']);
    const [phoneNumber, setPhoneNumber] = useState();
    const [question, setQuestion] = useState("")
    const [answer, setAnswer] = useState("")
    const [step, setStep] = useState(1);
    const [error, setError] = useState("")

    const router = useRouter();

    const date = new Date();
    date.setDate(date.getDate() + 1)

    const Submit = async () =>{
        try{
            if(step === 1){
                setStep(2)
            }
            if(step == 2){
                const user = await axios.post("https://tasktrove-server.onrender.com/register", {firstName, lastName, userName, emailAddress, password, phoneNumber, question, answer})
                if(user.status === 203){
                    console.log(user);
                    setError(user.data.message)
                }else{
                    console.log(user.data);
                    const id = user.data.user._id;
                    setCookie('id', id, {expires: date})
                    setCookie('registered', true, {expires: date})
                    router.push('/Dashboard');
                }
            }
            
        }
        catch(err){
            console.log(err);
            notifyError("Something went wrong!")
        }
    }

    return (
        <>
            {step === 1 ? <>
            <div className="form-group w-75 pb-3">
                <p className='fw-bold fst-italic'>Step 1:</p>
                <div className="d-flex justify-content-between">
                    <div className="form-floating mb-3 w-50">
                        <input type="text" className="form-control" id="firstName" placeholder="first name" onChange={e => setFirstName(e.target.value)}/>
                        <label htmlFor="floatingInput">First name</label>
                    </div>
                    <div className="form-floating mb-3 w-50 ms-2">
                        <input type="text" className="form-control" id="lastName" placeholder="last name" onChange={e=> setLastName(e.target.value)}/>
                        <label htmlFor="floatingInput">Last name</label>
                    </div>
                </div>
                
                <div className="form-floating mb-3">
                    <input type="text" className="form-control" id="userName" placeholder="username" onChange={(e)=> setUserName(e.target.value)}/>
                    <label htmlFor="floatingInput">Username</label>
                </div>
                <div className="form-floating mb-3">
                    <input type="text" className="form-control" id="emailAddress" placeholder="name@example.com" onChange={(e)=> setEmailAddress(e.target.value)}/>
                    <label htmlFor="floatingInput">Email address</label>
                </div>
                <div className="form-floating mb-3">
                    <input type="phone" className="form-control" id="phoneNumber" placeholder="" onChange={(e)=> setPhoneNumber(e.target.value)}/>
                    <label htmlFor="floatingInput">Phone number</label>
                </div>
                <div className="form-floating mb-3">
                    <input type="password" className="form-control" id="password" placeholder="Password" autoComplete="on" onChange={(e)=> setPassword(e.target.value)}/>
                    <label htmlFor="floatingPassword">Password</label>
                </div>
                {/* remember me and forgot password */}
                <div className="d-flex justify-content-between w-100 p-4">
                    <div className="mb-3 form-check">
                        <input type="checkbox" className="form-check-input" id="exampleCheck1" />
                        <label className="form-check-label" htmlFor="exampleCheck1">Remember me</label>
                    </div>
                    <a href="">Forgot password?</a>
                </div>
                {/* Sign in button*/}
                <button type="submit" className="btn btn-info w-100" onClick={Submit}>Next</button>
            </div>

            <ToastContainer position="top-right"
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
            </>
            : <div className='position-relative'>
                <p className='fw-bold fst-italic'>Step 2:</p>
                <p>Create a custom question and answer that only you would know.</p>
                <div className="form-floating pb-3">
                    <input type="text" className="form-control" id="question" placeholder="Question" onChange={(e)=> setQuestion(e.target.value)}/>
                    <label htmlFor="floatingInput">Question</label>
                </div>
                <div className="form-floating pb-3">
                    <input type="text" className="form-control" id="answer" placeholder="Answer" onChange={(e)=> setAnswer(e.target.value)}/>
                    <label htmlFor="floatingInput">Answer</label>
                </div>
                <div className="d-flex justify-content-end">
                    <button type="submit" className='btn btn-light' onClick={()=>{
                        setStep(1) 
                        setError("")
                    }}>Back</button>
                    <button type="submit" className="btn btn-info ms-3" onClick={Submit}>Register</button>
                </div>
                <span className='position-absolute text-danger mt-5' style={{textAlign: "center", left: "125px"}}>{error}</span>
            </div>
        }
        </>
    )
}

export default Form