import React, { useState, useMemo } from 'react';
import { useData } from '../contexts/DataContext';
import { useAuth } from '../contexts/AuthContext';
import { ROLES, canManageJobs, canUpdateJobStatus } from '../utils/roleUtils';
import { formatDate } from '../utils/helpers';
import Modal from '../components/UI/Modal';
import JobForm from '../components/Jobs/JobForm'; // Create next
import JobCalendarView from '../components/Jobs/JobCalendarView'; // Create after JobForm
import { SelectField } from '../components/UI/InputField'; // Assuming SelectField is exported from InputField.jsx

const JobsPage = () => {
  const { jobs, ships, components, engineers, updateJob, deleteJob, loading } = useData();
  const { currentUser } = useAuth();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingJob, setEditingJob] = useState(null);
  const [viewMode, setViewMode] = useState('list'); // 'list' or 'calendar'

  // Filters
  const [filterShip, setFilterShip] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [filterPriority, setFilterPriority] = useState('');

  const openModalForCreate = () => {
    setEditingJob(null);
    setIsModalOpen(true);
  };
  const openModalForEdit = (job) => {
    setEditingJob(job);
    setIsModalOpen(true);
  };
  const closeModal = () => {
    setIsModalOpen(false);
    setEditingJob(null);
  };

  const handleDeleteJob = (jobId) => {
    if (window.confirm('Are you sure you want to delete this job?')) {
      deleteJob(jobId);
    }
  };

  const handleStatusChange = (job, newStatus) => {
    if (canUpdateJobStatus(currentUser, job)) {
      updateJob({ ...job, status: newStatus });
    } else {
      alert("You are not authorized to update this job's status.");
    }
  };

  const filteredJobs = useMemo(() => {
    return jobs.filter(job => {
      const shipMatch = filterShip ? job.shipId === filterShip : true;
      const statusMatch = filterStatus ? job.status === filterStatus : true;
      const priorityMatch = filterPriority ? job.priority === filterPriority : true;
      return shipMatch && statusMatch && priorityMatch;
    });
  }, [jobs, filterShip, filterStatus, filterPriority]);


  if (loading) return <p>Loading jobs...</p>;

  const jobStatusOptions = ["Open", "In Progress", "Completed", "Cancelled"];
  const jobPriorityOptions = ["High", "Medium", "Low"];

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
        <h1 className="text-3xl font-semibold text-gray-800">Maintenance Jobs</h1>
        <div className="flex gap-2">
            {canManageJobs(currentUser) && (
            <button onClick={openModalForCreate} className="btn btn-primary">
                Create New Job
            </button>
            )}
            <button 
                onClick={() => setViewMode(viewMode === 'list' ? 'calendar' : 'list')} 
                className="btn btn-secondary"
            >
            {viewMode === 'list' ? 'Switch to Calendar View' : 'Switch to List View'}
            </button>
        </div>
      </div>

      {/* Filters */}
      <div className="card grid grid-cols-1 md:grid-cols-3 gap-4">
        <SelectField label="Filter by Ship" id="filterShip" value={filterShip} onChange={e => setFilterShip(e.target.value)}>
          <option value="">All Ships</option>
          {ships.map(ship => <option key={ship.id} value={ship.id}>{ship.name}</option>)}
        </SelectField>
        <SelectField label="Filter by Status" id="filterStatus" value={filterStatus} onChange={e => setFilterStatus(e.target.value)}>
          <option value="">All Statuses</option>
          {jobStatusOptions.map(status => <option key={status} value={status}>{status}</option>)}
        </SelectField>
        <SelectField label="Filter by Priority" id="filterPriority" value={filterPriority} onChange={e => setFilterPriority(e.target.value)}>
          <option value="">All Priorities</option>
          {jobPriorityOptions.map(prio => <option key={prio} value={prio}>{prio}</option>)}
        </SelectField>
      </div>

      {viewMode === 'list' ? (
        <>
          {filteredJobs.length === 0 ? (
            <p className="text-gray-600 mt-4">No jobs match your filters, or no jobs created yet.</p>
          ) : (
            <div className="bg-white shadow-md rounded-lg overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <Th>Type</Th>
                    <Th>Ship</Th>
                    <Th>Component</Th>
                    <Th>Priority</Th>
                    <Th>Status</Th>
                    <Th>Scheduled</Th>
                    <Th>Engineer</Th>
                    <Th>Actions</Th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredJobs.map((job) => {
                    const ship = ships.find(s => s.id === job.shipId);
                    const component = components.find(c => c.id === job.componentId);
                    const engineer = engineers.find(e => e.id === job.assignedEngineerId);
                    return (
                      <tr key={job.id}>
                        <Td>{job.type}</Td>
                        <Td>{ship ? ship.name : 'N/A'}</Td>
                        <Td>{component ? component.name : 'N/A'}</Td>
                        <Td>{job.priority}</Td>
                        <Td>
                          {canUpdateJobStatus(currentUser, job) ? (
                             <select 
                                value={job.status} 
                                onChange={(e) => handleStatusChange(job, e.target.value)}
                                className="p-1 border rounded text-xs"
                              >
                                {jobStatusOptions.map(s => <option key={s} value={s}>{s}</option>)}
                              </select>
                          ) : (
                            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                              job.status === 'Open' ? 'bg-blue-100 text-blue-800' :
                              job.status === 'In Progress' ? 'bg-yellow-100 text-yellow-800' :
                              job.status === 'Completed' ? 'bg-green-100 text-green-800' :
                              'bg-gray-100 text-gray-800'
                            }`}>
                              {job.status}
                            </span>
                          )}
                        </Td>
                        <Td>{formatDate(job.scheduledDate)}</Td>
                        <Td>{engineer ? engineer.email.split('@')[0] : 'Unassigned'}</Td>
                        <Td className="space-x-2">
                          {canManageJobs(currentUser) && (
                            <button onClick={() => openModalForEdit(job)} className="text-yellow-600 hover:text-yellow-900 text-sm">Edit</button>
                          )}
                          {currentUser?.role === ROLES.ADMIN && ( // Only Admin can delete jobs directly
                             <button onClick={() => handleDeleteJob(job.id)} className="text-red-600 hover:text-red-900 text-sm">Delete</button>
                          )}
                        </Td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </>
      ) : (
        <JobCalendarView jobs={filteredJobs} onSelectEvent={openModalForEdit} />
      )}

      <Modal isOpen={isModalOpen} onClose={closeModal} title={editingJob ? 'Edit Job' : 'Create New Job'}>
        <JobForm 
          existingJob={editingJob} 
          onFormSubmit={closeModal} 
        />
      </Modal>
    </div>
  );
};

// Helper for table headers/data cells (could be a shared component)
const Th = ({ children }) => <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{children}</th>;
const Td = ({ children, className = "" }) => <td className={`px-4 py-3 whitespace-nowrap text-sm text-gray-700 ${className}`}>{children}</td>;


export default JobsPage;