import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useData } from '../contexts/DataContext';
import { useAuth } from '../contexts/AuthContext';
import { ROLES, canCreate } from '../utils/roleUtils'; // Add canEdit, canDelete for components if needed
import { formatDate } from '../utils/helpers';
import Modal from '../components/UI/Modal';
import ComponentForm from '../components/Components/ComponentForm'; // Create next
import JobForm from '../components/Jobs/JobForm'; // Create later

const ShipDetailPage = () => {
  const { shipId } = useParams();
  const { ships, getComponentsByShipId, getJobsByShipId, deleteComponent, components, jobs, engineers } = useData();
  const { currentUser } = useAuth();

  const [ship, setShip] = useState(null);
  const [shipComponents, setShipComponents] = useState([]);
  const [shipJobs, setShipJobs] = useState([]);
  
  const [isComponentModalOpen, setIsComponentModalOpen] = useState(false);
  const [editingComponent, setEditingComponent] = useState(null);
  const [isJobModalOpen, setIsJobModalOpen] = useState(false);
  const [editingJob, setEditingJob] = useState(null); // For editing jobs directly from here
  const [jobForComponent, setJobForComponent] = useState(null); // For creating job for specific component

  useEffect(() => {
    const currentShip = ships.find(s => s.id === shipId);
    setShip(currentShip);
    if (currentShip) {
      setShipComponents(getComponentsByShipId(shipId));
      setShipJobs(getJobsByShipId(shipId));
    }
  }, [shipId, ships, components, jobs, getComponentsByShipId, getJobsByShipId]);

  const openComponentModalForCreate = () => {
    setEditingComponent(null);
    setIsComponentModalOpen(true);
  };
  const openComponentModalForEdit = (component) => {
    setEditingComponent(component);
    setIsComponentModalOpen(true);
  };
  const closeComponentModal = () => {
    setIsComponentModalOpen(false);
    setEditingComponent(null);
  };

  const openJobModalForCreate = (component = null) => { // Optionally pass component
    setJobForComponent(component);
    setEditingJob(null);
    setIsJobModalOpen(true);
  };
  // const openJobModalForEdit = (job) => { /* ... */ }; // If editing jobs here
  const closeJobModal = () => {
    setIsJobModalOpen(false);
    setEditingJob(null);
    setJobForComponent(null);
  };


  const handleDeleteComponent = (componentId) => {
    if (window.confirm('Are you sure you want to delete this component and its associated jobs?')) {
      deleteComponent(componentId);
    }
  };

  if (!ship) return <p>Loading ship details or ship not found...</p>;

  return (
    <div className="space-y-8">
      {/* Ship General Information */}
      <div className="card">
        <div className="flex justify-between items-start">
          <h1 className="text-3xl font-semibold text-gray-800 mb-2">{ship.name}</h1>
          <Link to="/ships" className="btn btn-secondary text-sm">Back to Ships List</Link>
        </div>
        <p className="text-gray-600">IMO: {ship.imo} | Flag: {ship.flag} | Status: 
          <span className={`ml-1 px-2 py-0.5 inline-flex text-xs leading-5 font-semibold rounded-full ${
              ship.status === 'Active' ? 'bg-green-100 text-green-800' : 
              ship.status === 'Under Maintenance' ? 'bg-yellow-100 text-yellow-800' : 
              'bg-red-100 text-red-800'
            }`}>
            {ship.status}
          </span>
        </p>
      </div>

      {/* Components Installed */}
      <div className="card">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-semibold text-gray-700">Components Installed</h2>
          {canCreate(currentUser) && ( // Assuming admin can add components
            <button onClick={openComponentModalForCreate} className="btn btn-primary text-sm">
              Add Component
            </button>
          )}
        </div>
        {shipComponents.length === 0 ? (
          <p>No components installed on this ship.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="th">Name</th>
                  <th className="th">Serial No.</th>
                  <th className="th">Install Date</th>
                  <th className="th">Last Maint.</th>
                  <th className="th">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {shipComponents.map(comp => (
                  <tr key={comp.id}>
                    <td className="td">{comp.name}</td>
                    <td className="td">{comp.serialNumber}</td>
                    <td className="td">{formatDate(comp.installDate)}</td>
                    <td className="td">{formatDate(comp.lastMaintenanceDate)}</td>
                    <td className="td space-x-2">
                       <button onClick={() => openJobModalForCreate(comp)} className="text-green-600 hover:text-green-900 text-sm">New Job</button>
                      {canCreate(currentUser) && ( // Assuming admin can edit/delete components
                        <>
                          <button onClick={() => openComponentModalForEdit(comp)} className="text-yellow-600 hover:text-yellow-900 text-sm">Edit</button>
                          <button onClick={() => handleDeleteComponent(comp.id)} className="text-red-600 hover:text-red-900 text-sm">Delete</button>
                        </>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Maintenance History (Jobs for this ship) */}
      <div className="card">
        <h2 className="text-2xl font-semibold text-gray-700 mb-4">Maintenance History for {ship.name}</h2>
        {shipJobs.length === 0 ? (
          <p>No maintenance jobs recorded for this ship yet.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                    <tr>
                        <th className="th">Job Type</th>
                        <th className="th">Component</th>
                        <th className="th">Priority</th>
                        <th className="th">Status</th>
                        <th className="th">Scheduled</th>
                        <th className="th">Assigned Engineer</th>
                        <th className="th">Description</th>
                    </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                    {shipJobs.map(job => {
                        const component = shipComponents.find(c => c.id === job.componentId);
                        const engineer = engineers.find(e => e.id === job.assignedEngineerId);
                        return (
                            <tr key={job.id}>
                                <td className="td">{job.type}</td>
                                <td className="td">{component ? component.name : 'N/A'}</td>
                                <td className="td">{job.priority}</td>
                                <td className="td">
                                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                    job.status === 'Open' ? 'bg-blue-100 text-blue-800' :
                                    job.status === 'In Progress' ? 'bg-yellow-100 text-yellow-800' :
                                    job.status === 'Completed' ? 'bg-green-100 text-green-800' :
                                    'bg-gray-100 text-gray-800' // Cancelled or other
                                  }`}>
                                    {job.status}
                                  </span>
                                </td>
                                <td className="td">{formatDate(job.scheduledDate)}</td>
                                <td className="td">{engineer ? engineer.email : 'Unassigned'}</td>
                                <td className="td text-sm text-gray-500 truncate max-w-xs">{job.description}</td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Component Modal */}
      <Modal isOpen={isComponentModalOpen} onClose={closeComponentModal} title={editingComponent ? 'Edit Component' : 'Add New Component'}>
        <ComponentForm 
            shipId={shipId} 
            existingComponent={editingComponent} 
            onFormSubmit={closeComponentModal} 
        />
      </Modal>

      {/* Job Modal */}
      <Modal isOpen={isJobModalOpen} onClose={closeJobModal} title={editingJob ? 'Edit Job' : 'Create New Job'}>
        <JobForm 
          existingJob={editingJob}
          defaultShipId={shipId} // Pass shipId
          defaultComponentId={jobForComponent?.id} // Pass componentId if creating for specific component
          onFormSubmit={closeJobModal} 
        />
      </Modal>
    </div>
  );
};

// Helper for table headers/data cells
const Th = ({ children }) => <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{children}</th>;
const Td = ({ children, className = "" }) => <td className={`px-4 py-3 whitespace-nowrap text-sm text-gray-700 ${className}`}>{children}</td>;

export default ShipDetailPage;