import React, {useEffect, useState} from 'react'
import { BsBarChartSteps, BsFlagFill, BsXLg } from 'react-icons/bs';
import Modal from 'react-modal'
import { Tooltip } from 'react-tooltip';
import { Bar, BarChart, CartesianGrid, Cell, Legend, Pie, PieChart, ResponsiveContainer, XAxis, YAxis } from 'recharts'
import {Line} from 'rc-progress'

const customStyles = {
    overlay: {
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.5)'
    },
    content: {
        top: '50%',
        left: '50%',
        right: 'auto',
        bottom: 'auto',
        marginRight: '-50%',
        transform: 'translate(-50%, -50%)',
    },
};
function formatDate(input) {
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    const date = new Date(input);
    return date.toLocaleDateString('en-US', options);
}
function getDaysDifference(input) {
    const today = new Date();
    const inputDate = new Date(input);
    const timeDifference = today - inputDate;
    const daysDifference = Math.floor(timeDifference / (1000 * 60 * 60 * 24));
  
    return daysDifference;
}
Modal.setAppElement(document.getElementById("__next"));

const Reports = ({tasks, project, members}) => {
    const [modalIsOpen, setIsOpen] = useState(false);
    const critical = tasks.filter(task => task.priority === "critical")
    const normal = tasks.filter(task => task.priority === "normal")
    const medium = tasks.filter(task => task.priority === "medium")
    const low = tasks.filter(task => task.priority === "low")
    const high = tasks.filter(task => task.priority === "high")
    const projectProgress = tasks.filter(task => task.status === "Completed")
    const formattedDate = formatDate(project.createdAt)
    const daysDifference = getDaysDifference(project.createdAt)
    // normal
    const normalData = [
        { name: 'Completed', value: (normal.filter(task => task.status === "Completed").length)},
        { name: 'In Progress', value: (normal.filter(task => task.status === "In Progress").length)},
        { name: 'Late', value: (normal.filter(task => task.status === "Late").length)},
    ]
    //critical
    const criticalData = [
        { name: 'Completed', value: (critical.filter(task => task.status === "Completed").length)},
        { name: 'In Progress', value: (critical.filter(task => task.status === "In Progress").length)},
        { name: 'Late', value: (critical.filter(task => task.status === "Late").length)},
    ]
    //medium
    const mediumData = [
        { name: 'Completed', value: (medium.filter(task => task.status === "Completed").length)},
        { name: 'In Progress', value: (medium.filter(task => task.status === "In Progress").length)},
        { name: 'Late', value: (medium.filter(task => task.status === "Late").length)},
    ]
    //low
    const lowData = [
        { name: 'Completed', value: (low.filter(task => task.status === "Completed").length)},
        { name: 'In Progress', value: (low.filter(task => task.status === "In Progress").length)},
        { name: 'Late', value: (low.filter(task => task.status === "Late").length)},
    ]
    const highData = [
        { name: 'Completed', value: (high.filter(task => task.status === "Completed").length)},
        { name: 'In Progress', value: (high.filter(task => task.status === "In Progress").length)},
        { name: 'Late', value: (high.filter(task => task.status === "Late").length)},
    ]

    const completedRankings = Array.from(
        tasks.reduce((acc, task) => {
          const assignTo = task.assignTo;
          if (task.status === 'Completed') {
            acc.set(assignTo, {
              noOfTaskCompleted: (acc.get(assignTo)?.noOfTaskCompleted || 0) + 1,
              totalTasks: (acc.get(assignTo)?.totalTasks || 0) + 1,
            });
          } else {
            acc.set(assignTo, {
              ...acc.get(assignTo),
              totalTasks: (acc.get(assignTo)?.totalTasks || 0) + 1,
            });
          }
          return acc;
        }, new Map()),
        ([assignTo, stats]) => ({
          assignTo,
          noOfTaskCompleted: stats.noOfTaskCompleted || 0,
          percentOfCompleted: stats.noOfTaskCompleted
            ? (stats.noOfTaskCompleted / stats.totalTasks) * 100
            : 0,
        })
    );
      
      // Sort the array by percentOfCompleted in descending order
    const sortedCompletedRankings = completedRankings.sort(
        (a, b) => b.percentOfCompleted - a.percentOfCompleted
    );

    const lateRankings = Array.from(
        tasks.reduce((acc, task) => {
        const assignTo = task.assignTo;
        const today = new Date();
        const taskDeadline = new Date(task.deadline);
    
        if (task.status === 'Late' && taskDeadline < today) {
            acc.set(assignTo, {
            noOfLateTasks: (acc.get(assignTo)?.noOfLateTasks || 0) + 1,
            totalTasks: (acc.get(assignTo)?.totalTasks || 0) + 1,
            });
        } else {
            acc.set(assignTo, {
            ...acc.get(assignTo),
            totalTasks: (acc.get(assignTo)?.totalTasks || 0) + 1,
            });
        }
        return acc;
        }, new Map()),
        ([assignTo, stats]) => ({
        assignTo,
        noOfLateTasks: stats.noOfLateTasks || 0,
        percentOfLateTasks: stats.noOfLateTasks
            ? (stats.noOfLateTasks / stats.totalTasks) * 100
            : 0,
        })
    );
    
    // Sort the array by percentOfLateTasks in descending order
    const sortedLateRankings = lateRankings.sort(
        (a, b) => b.percentOfLateTasks - a.percentOfLateTasks
    );
    
    // Log the result
    // console.log(sortedLateRankings);
    

    const workloadData = Array.from(tasks.reduce((acc, task) => {
        let assignTo;

        for(const i of members){
            if(task.assignTo === i._id) assignTo = `${i.firstName} ${i.lastName}`;
        }

        acc.set(assignTo, (acc.get(assignTo) || 0) + 1);
        return acc;
    }, new Map()), ([name, count]) => ({ name, count }));

    const COLORS = ['#2c3e50', '#16a085', '#d35400'];

    const RADIAN = Math.PI / 180;
    const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent, index }) => {
        const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
        const x = cx + radius * Math.cos(-midAngle * RADIAN);
        const y = cy + radius * Math.sin(-midAngle * RADIAN);
      
        return (
          <text x={x} y={y} fill="white" textAnchor={x > cx ? 'start' : 'end'} dominantBaseline="central">
            {`${(percent * 100).toFixed(0)}%`}
          </text>
        );
    };

    return (
        <div>
            <p className='fs-5 p-0 my-0 me-3 text-secondary' style={{cursor: "pointer"}} onClick={()=>setIsOpen(true)}><BsBarChartSteps /></p>
            <Modal
                isOpen={modalIsOpen}
                onRequestClose={()=>setIsOpen(false)}
                style={customStyles}
                contentLabel="Reports Modal"
            >
                <div className='' style={{width: "90vw", height: "90vh"}}>
                    <div className="report-header d-flex justify-content-between">
                        <h4 className='text-primary'>Reports</h4>
                        <button className="btn btn-transparent" onClick={()=>setIsOpen(false)}><BsXLg /></button>
                    </div>
                    <div className="">
                        <div className='d-flex mb-2'>
                            <div className="d-flex flex-column w-100">
                                <div class="mx-2 mb-4 d-flex">
                                    <Line percent={(projectProgress.length / tasks.length) * 100} strokeWidth={1.5} strokeColor="#2c3e50" />
                                    {((projectProgress.length / tasks.length) * 100).toString().substring(0, 5)}%
                                </div>

                                {/* Normal, Critical, Medium, Low */}
                                <div className="d-flex w-100 justify-content-around">
                                    <div className='legends d-flex flex-column justify-content-center'>
                                        <p className=''>Legends</p>
                                        <div className='d-flex align-items-center'>
                                            <div style={{height: "16px", width: "16px", backgroundColor: "#2c3e50"}}></div>
                                            <p className='m-0 ps-2'>Completed</p>
                                        </div>
                                        <div className='d-flex align-items-center'>
                                            <div style={{height: "16px", width: "16px", backgroundColor: "#16a085"}}></div>
                                            <p className='m-0 ps-2'>In Progress</p>
                                        </div>
                                        <div className='d-flex align-items-center'>
                                            <div style={{height: "16px", width: "16px", backgroundColor: "#d35400"}}></div>
                                            <p className='m-0 ps-2'>Late</p>
                                        </div>
                                    </div>
                                    <div>
                                        <p className='text-center m-0'>Normal</p>
                                            {normalData && <PieChart width={200} height={160}>
                                                <Pie
                                                    data={normalData}
                                                    cx="50%"
                                                    cy="50%"
                                                    labelLine={false}
                                                    label={renderCustomizedLabel}
                                                    outerRadius={80}
                                                    fill="#8884d8"
                                                    dataKey="value"
                                                >
                                                    {normalData.map((entry, index) => (
                                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                                    ))}
                                                </Pie>
                                            </PieChart>}
                                        {/* <p>{normal}</p> */}
                                    </div>
                                    <div>
                                        <p className='text-center m-0'>Critical</p>
                                        {criticalData && <PieChart width={200} height={160}>
                                                <Pie
                                                    data={criticalData}
                                                    cx="50%"
                                                    cy="50%"
                                                    labelLine={false}
                                                    label={renderCustomizedLabel}
                                                    outerRadius={80}
                                                    fill="#8884d8"
                                                    dataKey="value"
                                                >
                                                    {criticalData.map((entry, index) => (
                                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                                    ))}
                                                </Pie>
                                            </PieChart>}
                                        {/* <p>{critical}</p> */}
                                    </div>
                                    <div>
                                        <p className='text-center m-0'>Medium</p>
                                        {mediumData && <PieChart width={200} height={160}>
                                                <Pie
                                                    data={mediumData}
                                                    cx="50%"
                                                    cy="50%"
                                                    labelLine={false}
                                                    label={renderCustomizedLabel}
                                                    outerRadius={80}
                                                    fill="#8884d8"
                                                    dataKey="value"
                                                >
                                                    {mediumData.map((entry, index) => (
                                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                                    ))}
                                                </Pie>
                                            </PieChart> }
                                        {/* <p>{medium}</p> */}
                                    </div>
                                    <div>
                                        <p className='text-center m-0'>Low</p>
                                        {lowData && <PieChart width={200} height={160}>
                                                <Pie
                                                    data={lowData}
                                                    cx="50%"
                                                    cy="50%"
                                                    labelLine={false}
                                                    label={renderCustomizedLabel}
                                                    outerRadius={80}
                                                    fill="#8884d8"
                                                    dataKey="value"
                                                >
                                                    {lowData.map((entry, index) => (
                                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                                    ))}
                                                </Pie>
                                            </PieChart>}
                                        {/* <p>{low}</p> */}
                                    </div>
                                    <div>
                                        <p className='text-center m-0'>High</p>
                                        {highData && <PieChart width={200} height={160}>
                                                <Pie
                                                    data={highData}
                                                    cx="50%"
                                                    cy="50%"
                                                    labelLine={false}
                                                    label={renderCustomizedLabel}
                                                    outerRadius={80}
                                                    fill="#8884d8"
                                                    dataKey="value"
                                                >
                                                    {highData.map((entry, index) => (
                                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                                    ))}
                                                </Pie>
                                            </PieChart>}
                                        {/* <p>{low}</p> */}
                                    </div>
                                </div>
                            </div>
                            <div className='bg-success-subtle p-2 d-flex flex-column justify-content-center ' >
                                    <p className='text-center h5'>Project Launched Date</p>
                                    <div className='d-flex mt-3'>
                                        <p className='h2 text-success'><BsFlagFill /></p>
                                        <div className='text-center'>
                                            <h4 className='fw-bold'>{daysDifference} Days</h4>
                                            <small>{formattedDate}</small>
                                        </div>
                                    </div>
                                </div>
                        </div>
                        <div className="d-flex">
                            {/* workload */}
                            <div className="w-50" style={{height: "50vh"}}>
                                <p className='text-center fw-bold'>Workload</p>
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart
                                        width={500}
                                        height={200}
                                        data={workloadData}
                                        margin={{
                                            top: 20,
                                            right: 30,
                                            left: 20,
                                            bottom: 5,
                                        }}
                                    >
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="name" />
                                    <YAxis />
                                    <Tooltip />
                                    <Legend />
                                    <Bar dataKey="count" stackId="a" fill="#2c3e50" />
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>
                            <div className='d-flex flex-column w-50 ms-4'>
                                <div className="h-50">
                                    <p className='text-center m-1 fw-bold'>Completed Rankings</p>
                                    <table className='table table-hover reports-table table-bordered border-white'>
                                        <thead className='table-primary p-0'>
                                            <tr className=''>
                                                <th scope='col' className='p-1'></th>
                                                <th scope='col' className='p-1'>Name</th>
                                                <th scope='col' className='p-1'>No of Completed Tasks</th>
                                                <th scope='col' className='p-1'>%</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {sortedCompletedRankings.map((user, index) => {
                                                let member;
                                                for(const i of members){
                                                    if(i._id === user.assignTo) member = `${i.firstName} ${i.lastName}`
                                                }
                                                return <tr>
                                                    <td>{index + 1}</td>
                                                    <td>{member}</td>
                                                    <td>{user.noOfTaskCompleted}</td>
                                                    <td>{user.percentOfCompleted.toString().substring(0,5)}%</td>
                                                </tr>
                                            })}
                                        </tbody>
                                    </table>
                                </div>
                                <div className='h-50'>
                                    <p className='text-center fw-bold m-1'>Late Rankings</p>
                                    <table className='table table-hover reports-table table-bordered border-white'>
                                        <thead className='table-primary'>
                                            <tr className=''>
                                                <th scope='col' className='p-1'></th>
                                                <th scope='col' className='p-1'>Name</th>
                                                <th scope='col' className='p-1'>No of Late Tasks</th>
                                                <th scope='col' className='p-1'>%</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {sortedLateRankings && sortedLateRankings.map((user, index)=>{
                                                let member;
                                                for(const i of members){
                                                    if(i._id === user.assignTo) member = `${i.firstName} ${i.lastName}`
                                                }
                                                return <tr className="">
                                                    <td className="border-white border-end">{index + 1}</td>
                                                    <td className="border-white border-end">{member}</td>
                                                    <td className="border-white border-end">{user.noOfLateTasks}</td>
                                                    <td className="border-white border-end">{user.percentOfLateTasks.toString().substring(0, 5)}%</td>
                                                </tr>
                                            })}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </Modal>
        </div>
    )
}

export default Reports