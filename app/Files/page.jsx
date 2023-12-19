'use client'
import React from 'react'
import { useCookies } from 'react-cookie'
import { BsDownload} from 'react-icons/bs'
import { BsPerson } from 'react-icons/bs'
import { SideNav } from '../components'
import { useEffect, useState } from "react";
import axios from 'axios'

 
function page() {
    const [cookies] = useCookies(['id']);
    const [files, setFiles] = useState([]);
    const [filteredFiles, setFilteredFiles] = useState([]);
    const [fileTypeFilter, setFileTypeFilter] = useState('');
    const user_id = cookies['id'];
    const [isLoading, setIsLoading] = useState(true);
    const [progress, setProgress] = useState(0);
    const [tasks, setTasks] = useState([])
    const [projects, setProjects] = useState([])
    const [teams, setTeams] = useState([])

    useEffect(() => {
        const user_id = cookies['id'];
        
        if (user_id) {
        const initializeData = setTimeout(() => {
            axios
              .get(`https://tasktrove-server.onrender.com/getfile/${user_id}`)
              .then((response) => {
                setFiles(response.data);
                setIsLoading(false);
              })
              .catch((error) => console.error('Error fetching files:', error));
          }, 2000);
    
          const interval = setInterval(() => {
            setProgress((prevProgress) => (prevProgress >= 100 ? 0 : prevProgress + 10));
          }, 200);
    
          return () => {
            clearTimeout(initializeData);
            clearInterval(interval);
          };
        }
      }, [cookies]);


    useEffect(() => {
        const fetchData = async ()=>{
            try{
                const filesRes = await axios.get(`https://tasktrove-server.onrender.com/getfile/${user_id}`)
                setFiles(filesRes.data)

                const tasksRes = await axios.get(`https://tasktrove-server.onrender.com/getAllTasks`)
                setTasks(tasksRes.data)

                const projectsRes = await axios.get(`https://tasktrove-server.onrender.com/getAllProject`)
                setProjects(projectsRes.data)

                const teamsRes = await axios.get(`https://tasktrove-server.onrender.com/getAllTeams`)
                setTeams(teamsRes.data)
            }catch(error){
                console.error('Error fetching files:', error)
            }
        }   
        fetchData();
    }, []);
    
      //FOR DOWNLOADING SA FILES
    const handleDownloadFile = async (filename, type, originalName) => {
        try {
            const downloadRes = await axios.get(`https://tasktrove-server.onrender.com/downloadFile/${filename}`, { responseType: 'arraybuffer' });
            const blob = new Blob([downloadRes.data], { type: type });

            const url = URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = originalName;

            const container = document.createElement('div');
            container.appendChild(link);

            document.body.appendChild(container);
            link.click();

            setTimeout(() => {
                document.body.removeChild(container);
                URL.revokeObjectURL(url);
            }, 100);
        } catch (err) {
            console.log(err);
        }
    };

    //FILTERING NI PARA SA FILE TYPES
    useEffect(() => {
    if (fileTypeFilter) {
        const filtered = files.filter((file) => file.type === fileTypeFilter);
        setFilteredFiles(filtered);
    } else {
        setFilteredFiles(files);
    }
    }, [fileTypeFilter, files]);

    
    
    return (
        <div className="container-fluid d-flex p-0 flex" style={{overflow: "hidden", height: "100vh"}}>
            <SideNav active="Files" />
            <div className='d-block w-100 p-3 content-wrapper'>
                <h3>File List</h3>
                <hr />
            {isLoading ? (
                <div className="text-center position-absolute top-50 start-50 translate-middle background-dark" style={{ zIndex: '9999', transform: 'translate(-50%, -50%)' }}>
                    <p className='text-primary h3'>Initializing Records...</p>
                    <div className="progress" style={{ height: '20px' }}>
                        <div className="progress-bar progress-bar-striped progress-bar-animated"
                        role="progressbar"
                        style={{ width: `${progress}%` }}
                        aria-valuenow={progress}
                        aria-valuemin="0"
                        aria-valuemax="100"
                        ></div>
                    </div>
                </div>
            )
            : (<table className='table table-hover'>
                    <thead>
                        <tr>
                            <th></th>
                            <th>FILENAME</th>
                            <th>TYPE</th>
                            <th>SIZE</th>
                            <th>ASSIGNED TO</th>
                            <th>TASK NAME</th>
                            <th>PROJECT NAME</th>
                            <th>TEAM NAME</th>
                            <th>DOWNLOAD</th>
                            <th>DATE</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredFiles.map((file, index) => {
                            let taskName;
                            let projectName;
                            let teamName;
                            for(const i of tasks){
                                if(i._id === file.task_id) taskName = i.taskName;
                            }
                            for(const i of projects){
                                if(i._id === file.project_id) projectName = i.projectName;
                            }
                            for(const i of teams){
                                if(i._id === file.team_id) teamName = i.teamName;
                            }
                        return <tr key={file.task_id}>
                            <td>{index + 1}</td>
                            <td className=''>{file.originalName}</td>
                            <td className=''>{file.type}</td>
                            <td className=''>
                                {file.size < 1024
                                    ? `${file.size} bytes`
                                    : `${(file.size / (1024 * 1024)).toFixed(2)} MB`}
                            </td>
                            <td className=''>
                                <BsPerson className="fs-3" /> <span >You</span></td>
                            <td className=''>{taskName}</td>
                            <td className=''>{projectName}</td>
                            <td className=''>{teamName}</td>
                            <td className=''>
                                <button className='btn btn-danger'
                                onClick={() => handleDownloadFile(file.fileName, file.type, file.originalName)}>
                                    Download <BsDownload />
                                </button>
                            </td>
                            <td>{file.createdAt.split("T")[0]}</td>
                            {/* <td className=''>{file.path}</td> */}
                        </tr>
                        })}
                    </tbody>
                </table>)}
            </div>
        </div>
    )
}
export default page;