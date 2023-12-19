import React from 'react'
import { useRouter } from 'next/navigation'
import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid' //
import timeGridPlugin from '@fullcalendar/timegrid'
import multiMonthPlugin from '@fullcalendar/multimonth'
import listPlugin  from '@fullcalendar/list'

const Calendar = ({calendarEvents}) => {
    console.log(calendarEvents)
    const router = useRouter()
    const events = calendarEvents.map(event => {
        const taskName = event.taskName;
        const deadline = event.deadline;
        const description = event.description;
        const status = event.status;
        const project_id = event.project_id;
      
        return {
          title: taskName,
          date: deadline,
          description: description,
        //   textColor: status === 'Completed' ? 'green' : status === 'Late' ? 'red' : 'yellow',
          backgroundColor: status === 'Completed' ? '#d1f2eb' : status === 'Late' ? 'red' : '#fdebd0',
          project_id: project_id,
          textAlign: "center"
        };
    });
      
    const handleEventClick = (clickInfo) => {
        const project_id = clickInfo.event._def.extendedProps.project_id
        console.log(clickInfo)
        console.log(project_id);
      
        // Redirect to a specific location with the task details
        router.push(`/Projects/${project_id}`);
    };

    return (
        <FullCalendar  
            plugins={[dayGridPlugin, timeGridPlugin, multiMonthPlugin, listPlugin ]}
            weekends={true}
            events={events}
            selectable={true}
            headerToolbar={{
                left: 'prev,next',
                center: 'title',
                right: 'timeGridDay,timeGridWeek,dayGridMonth,multiMonthYear listMonth'
            }}
            navLinkDayClick={true}
            eventClick={handleEventClick}
            eventTextColor='#000'
        />
    )
    }

export default Calendar