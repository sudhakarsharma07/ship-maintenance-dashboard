import React, { useState } from 'react';
import { Calendar, dateFnsLocalizer } from 'react-big-calendar';
import format from 'date-fns/format';
import parse from 'date-fns/parse';
import startOfWeek from 'date-fns/startOfWeek';
import getDay from 'date-fns/getDay';
import enUS from 'date-fns/locale/en-US';
import 'react-big-calendar/lib/css/react-big-calendar.css'; // Make sure this is imported or handled by main.css
import Modal from '../UI/Modal';
import { formatDate } from '../../utils/helpers'; // for displaying dates in modal

const locales = {
  'en-US': enUS,
};

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales,
});

const JobCalendarView = ({ jobs, onSelectEvent }) => {
  const [selectedJobDetails, setSelectedJobDetails] = useState(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);

  const events = jobs.map(job => ({
    id: job.id,
    title: `${job.type} - ${job.description.substring(0,30)}... (Ship: ${job.shipId})`, // Placeholder for ship name
    start: new Date(job.scheduledDate),
    end: new Date(job.scheduledDate), // Assuming jobs are single-day events for simplicity
    allDay: true,
    resource: job, // Full job object
  }));

  const handleSelectEvent = (event) => {
    if (onSelectEvent) {
        onSelectEvent(event.resource); // For editing
    }
  };

  const handleSelectSlot = (slotInfo) => {
    // slotInfo contains start, end, slots, action
    // Example: Show jobs for that day if clicked on a date
    const jobsOnDate = jobs.filter(job => 
        formatDate(job.scheduledDate, 'yyyy-MM-dd') === formatDate(slotInfo.start, 'yyyy-MM-dd')
    );
    if (jobsOnDate.length > 0) {
        // For simplicity, just log or show a simple list. A modal could display these.
        console.log(`Jobs on ${formatDate(slotInfo.start)}:`, jobsOnDate);
        // For a more interactive display:
        setSelectedJobDetails(jobsOnDate); // Set array of jobs for the day
        setIsDetailModalOpen(true);
    } else {
        console.log(`No jobs on ${formatDate(slotInfo.start)}`);
    }
  };
  
  const closeDetailModal = () => {
      setIsDetailModalOpen(false);
      setSelectedJobDetails(null);
  }

  return (
    <div className="card h-[600px] p-0 md:p-0"> {/* Adjust height as needed */}
      <Calendar
        localizer={localizer}
        events={events}
        startAccessor="start"
        endAccessor="end"
        style={{ height: '100%', width: '100%' }}
        onSelectEvent={handleSelectEvent} // When an event (job) is clicked
        onSelectSlot={handleSelectSlot}   // When a date slot is clicked
        selectable={true} // Allows onSelectSlot to be triggered
        popup // Shows more events in a cell if they overflow
        views={['month', 'week', 'day']}
      />
      <Modal isOpen={isDetailModalOpen} onClose={closeDetailModal} title={`Jobs for ${selectedJobDetails ? formatDate(selectedJobDetails[0]?.scheduledDate) : ''}`}>
        {selectedJobDetails && selectedJobDetails.length > 0 ? (
            <ul className="list-disc pl-5 space-y-2">
                {selectedJobDetails.map(job => (
                    <li key={job.id}>
                        <strong>{job.type}</strong>: {job.description} (Status: {job.status})
                        <button onClick={() => { closeDetailModal(); onSelectEvent(job);}} className="ml-2 text-blue-500 text-xs">(Edit)</button>
                    </li>
                ))}
            </ul>
        ) : <p>No jobs scheduled for this day.</p>}
      </Modal>
    </div>
  );
};

export default JobCalendarView;