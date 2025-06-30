import React, { useState, useMemo } from 'react';
import { useData } from '../contexts/DataContext';
import { useAuth } from '../contexts/AuthContext';
import { ROLES, canManageJobs, canUpdateJobStatus } from '../utils/roleUtils';
import { formatDate } from '../utils/helpers';
import Modal from '../components/UI/Modal';
import JobForm from '../components/Jobs/JobForm';
import JobCalendarView from '../components/Jobs/JobCalendarView';
import { SelectField } from '../components/UI/InputField';
import { FaCalendarAlt, FaList, FaPlus, FaEdit, FaTrash } from 'react-icons/fa';

const JobsPage = () => {
  const { jobs, ships, components, engineers, updateJob, deleteJob, loading } = useData();
  const { currentUser } = useAuth();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingJob, setEditingJob] = useState(null);
  const [viewMode, setViewMode] = useState('list');
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

  if (loading) return <p className="text-gray-500 text-center mt-6">Loading jobs...</p>;

  const jobStatusOptions = ["Open", "In Progress", "Completed", "Cancelled"];
  const jobPriorityOptions = ["High", "Medium", "Low"];

  return (
    <div className="space-y-6 px-4 md:px-8 py-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <h1 className="text-3xl font-bold text-gray-800">🛠️ Maintenance Jobs</h1>
        <div className="flex gap-2 flex-wrap">
          {canManageJobs(currentUser) && (
            <button onClick={openModalForCreate} className="btn btn-primary flex items-center gap-2 text-sm">
              <FaPlus /> Create Job
            </button>
          )}
          <button
            onClick={() => setViewMode(viewMode === 'list' ? 'calendar' : 'list')}
            className="btn btn-secondary flex items-center gap-2 text-sm"
          >
            {viewMode === 'list' ? <><FaCalendarAlt /> Calendar View</> : <><FaList /> List View</>}
          </button>
        </div>
      </div>

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
            <div className="bg-white shadow-md rounded-xl overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 text-sm">
                <thead className="bg-gray-50 text-gray-600 uppercase text-xs tracking-wider">
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
                <tbody className="bg-white divide-y divide-gray-100">
                  {filteredJobs.map(job => {
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
                            <span className={`px-2 inline-flex text-xs font-semibold rounded-full ${
                              job.status === 'Open' ? 'bg-blue-100 text-blue-700' :
                              job.status === 'In Progress' ? 'bg-yellow-100 text-yellow-700' :
                              job.status === 'Completed' ? 'bg-green-100 text-green-700' :
                              'bg-gray-100 text-gray-800'
                            }`}>
                              {job.status}
                            </span>
                          )}
                        </Td>
                        <Td>{formatDate(job.scheduledDate)}</Td>
                        <Td>{engineer ? engineer.email.split('@')[0] : 'Unassigned'}</Td>
                        <Td>
                          <div className="flex items-center gap-3">
                            {canManageJobs(currentUser) && (
                              <button
                                onClick={() => openModalForEdit(job)}
                                className="bg-yellow-100 text-yellow-800 hover:bg-yellow-200 px-2 py-1 rounded-md text-xs flex items-center gap-1"
                                title="Edit"
                              >
                                <FaEdit /> Edit
                              </button>
                            )}
                            {currentUser?.role === ROLES.ADMIN && (
                              <button
                                onClick={() => handleDeleteJob(job.id)}
                                className="bg-red-100 text-red-800 hover:bg-red-200 px-2 py-1 rounded-md text-xs flex items-center gap-1"
                                title="Delete"
                              >
                                <FaTrash /> Delete
                              </button>
                            )}
                          </div>
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
        <JobForm existingJob={editingJob} onFormSubmit={closeModal} />
      </Modal>
    </div>
  );
};

const Th = ({ children }) => (
  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{children}</th>
);
const Td = ({ children, className = "" }) => (
  <td className={`px-4 py-3 whitespace-nowrap text-sm text-gray-700 ${className}`}>{children}</td>
);

export default JobsPage;
