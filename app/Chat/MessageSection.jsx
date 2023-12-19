import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { BsSend } from 'react-icons/bs'

function formatDate(dateString) {
    const date = new Date(dateString);
  
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    let hours = date.getHours();
    const amPM = hours >= 12 ? 'PM' : 'AM';
  
    // Convert to 12-hour format
    hours = hours % 12 || 12;
  
    const formattedHours = String(hours).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
  
    return `${year}-${month}-${day} ${formattedHours}:${minutes} ${amPM}`;
  }

const MessageSection = ({team, senderId, allUsers}) => {
    const [message, setMessage] = useState("");
    const [teamMessages, setTeamMessages] = useState([])
    
    useEffect(()=>{
        const fetchData = async(req, res)=>{
            const teamMessagesRes = await axios.get(`https://tasktrove-server.onrender.com/getTeamMessages/${team._id}`)
            setTeamMessages(teamMessagesRes.data)
        }
        fetchData()
    }, [team._id, teamMessages])

    const handleSendMessage = async() =>{
        try{
            const team_id = team._id;
            const sendMessage = await axios.post(`https://tasktrove-server.onrender.com/sendTeamMessage`, {senderId, message, team_id})
            console.log(sendMessage.data)
        }catch(err){
            console.log(err);
        }
    }
    return (
        <div className="h-100 w-100" >
            <div className="d-flex align-items-center">
                <h5 className='pt-3 ps-3'>{team.teamName}</h5>
            </div>
            <hr className='text-primary'/>
            <div className="message-section px-5" style={{height: "600px", overflowY: 'auto' }}>
                {teamMessages.length > 0 && teamMessages.map((msg, key)=>{ 
                    let name;
                    for(const i of allUsers){
                        if(i._id === msg.senderId) name = `${i.firstName} ${i.lastName}`
                    } 
                    return <div className={`w-100 d-flex flex-column align-items-${msg.senderId === senderId ? "end" : "start"}`}>
                        <p className='align-self-center'>{formatDate(msg.createdAt)}</p>
                        <span className='px-2' style={{fontSize: "12px"}}>{msg.senderId !== senderId && name}</span>
                        <p key={key} className={`bg-light rounded-pill px-3 py-2`}
                        >{msg.message}</p>
                    </div>
                })}
            </div>
            <div className="w-75 position-absolute d-flex mx-0" style={{right: "40px", bottom: "40px"}}>
                <input type="text" className='form-control' placeholder='Write your message..' onChange={(e)=> setMessage(e.target.value) }/>
                <button className='btn' type="" style={{cursor: 'pointer'}} onClick={handleSendMessage}><BsSend /></button>
            </div>
        </div>
    )
}

export default MessageSection
