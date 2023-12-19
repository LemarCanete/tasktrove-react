'use client'
import React, {useEffect, useState} from 'react'
import { Gantt, Task, EventOption, StylingOption, ViewMode, DisplayOption } from 'gantt-task-react';
import "gantt-task-react/dist/index.css";
import axios from 'axios';


const GanttChart: React.FC<{}> = ({}) => {
    
    useEffect(() => {
        const fetchData = async (): Promise<void> => {
          try {
      
            const projects = await axios.get(`https://tasktrove-server.onrender.com/getAllProject`);
            const tasks = await axios.get(`https://tasktrove-server.onrender.com/getAllTasks`);
      
            // Group tasks under their respective projects
            const data: any[] = [];
      
            projects.data.forEach((project: any) => {
              const projectTasks = tasks.data.filter((task: any) => task.project_id === project._id);
      
              // Find the latest deadline among the tasks or set default to current date
            const latestDeadline = projectTasks.length > 0
                ? projectTasks.reduce((maxDeadline: any, task: any) => {
                    const taskDeadline = new Date(task.deadline);
                    return taskDeadline > maxDeadline ? taskDeadline : maxDeadline;
                }, new Date(0))
                : new Date();
            const completedTasks = projectTasks.filter((task: any) => task.status === 'Completed');
            const projectProgress =
                  projectTasks.length > 0
                    ? (completedTasks.length / projectTasks.length) * 100
                    : 0;
            data.push({
                start: new Date(project.createdAt),
                end: latestDeadline,
                name: project.projectName,
                id: project._id,
                progress: projectProgress,
                type: 'project',
                hideChildren: true,
            });
      
            projectTasks.forEach((task: any) => {
                let prog = task.status === 'Completed' ? 100 : 0;
                data.push({
                start: new Date(task.createdAt),
                end: new Date(task.deadline),
                name: task.taskName,
                id: task._id,
                progress: prog,
                type: 'task',
                project: task.project_id,
                hideChildren: false,
                });
            });
            });
      
            setTasks(data);
            // Rest of your logic
            } catch (err) {
                console.log(err);
            }
        };
      
        fetchData();
      }, []);
      
      
      
      
    const currentDate = new Date();
    const [tasks, setTasks] = useState<Task[]>([
        {
            start: new Date(currentDate.getFullYear(), currentDate.getMonth(), 1),
            end: new Date(currentDate.getFullYear(), currentDate.getMonth(), 15),
            name: "Some Project",
            id: "ProjectSample",
            progress: 25,
            type: "project",
      
            hideChildren: false
          },
      ]);

    const toggleChildTasks = (taskId: string) => {
        setTasks((prevTasks) =>
          prevTasks.map((task) =>
            task.id === taskId ? { ...task, hideChildren: !task.hideChildren } : task
          )
        );
      };
    return (
        <Gantt tasks={tasks} onExpanderClick={(task) => toggleChildTasks(task.id)}
            onClick={(task) => toggleChildTasks(task.id)} />
    )
}

export default GanttChart