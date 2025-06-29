import React, { useState, useEffect } from 'react';
import { useData } from '../../contexts/DataContext';
import { useAuth } from '../../contexts/AuthContext';
import { ROLES, canAssignJobs } from '../../utils/roleUtils';
import InputField, { SelectField } from '../UI/InputField'; // Assuming SelectField is exported from InputField.jsx
import { formatDate } from '../../utils/helpers';

const JobForm = ({ existingJob, onFormSubmit, defaultShipId, defaultComponentId }) => {
  const { addJob, updateJob, ships, components, engineers } = useData();
  const { currentUser } = useAuth();

  const initialFormState = {
    shipId: defaultShipId || '',
    componentId: defaultComponentId || '',
    type: 'Inspection',
    priority: 'Medium',
    status: 'Open',
    assignedEngineerId: '',
    scheduledDate: '',
    description: '',
  };

  const [jobData, setJobData] = useState(initialFormState);
  const [availableComponents, setAvailableComponents] = useState([]);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (existingJob) {
      setJobData({
        ...existingJob,
        scheduledDate: existingJob.scheduledDate ? formatDate(existingJob.scheduledDate, 'yyyy-MM-dd') : '',
        assignedEngineerId: existingJob.assignedEngineerId || ''
      });
      if (existingJob.shipId) {
        setAvailableComponents(components.filter(c => c.shipId === existingJob.shipId));
      }
    } else {
      setJobData({
        ...initialFormState,
        shipId: defaultShipId || '',
        componentId: defaultComponentId || '',
      });
       if (defaultShipId) {
        setAvailableComponents(components.filter(c => c.shipId === defaultShipId));
      }
    }
  }, [existingJob, components, defaultShipId, defaultComponentId]);

  useEffect(() => {
    if (jobData.shipId) {
      setAvailableComponents(components.filter(c => c.shipId === jobData.shipId));
      // If ship changes and current component doesn't belong, reset it
      if (!components.find(c => c.id === jobData.componentId && c.shipId === jobData.shipId)) {
        setJobData(prev => ({ ...prev, componentId: '' }));
      }
    } else {
      setAvailableComponents([]);
      setJobData(prev => ({ ...prev, componentId: '' }));
    }
  }, [jobData.shipId, components]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setJobData(prev => ({ ...prev, [name]: value }));
     if (errors[name]) {
      setErrors(prev => ({...prev, [name]: null}));
    }
  };
  
  const validate = () => {
    const newErrors = {};
    if (!jobData.shipId) newErrors.shipId = 'Ship is required.';
    if (!jobData.componentId) newErrors.componentId = 'Component is required.';
    if (!jobData.type.trim()) newErrors.type = 'Job type is required.';
    if (!jobData.scheduledDate) newErrors.scheduledDate = 'Scheduled date is required.';
    if (!jobData.description.trim()) newErrors.description = 'Description is required.';
    // assignedEngineerId can be optional for 'Open' jobs if admin is creating
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    const dataToSave = {
        ...jobData,
        scheduledDate: jobData.scheduledDate ? new Date(jobData.scheduledDate).toISOString().split('T')[0] : null,
        assignedEngineerId: jobData.assignedEngineerId || null, // Ensure null if empty
    };


    if (existingJob) {
      updateJob(dataToSave);
    } else {
      // If an engineer is creating a job, auto-assign to them if field is empty
      let finalData = { ...dataToSave };
      if (currentUser.role === ROLES.ENGINEER && !finalData.assignedEngineerId) {
        finalData.assignedEngineerId = currentUser.id;
      }
      addJob(finalData);
    }
    onFormSubmit();
    setJobData(initialFormState); // Reset form
  };

  const jobTypeOptions = ["Inspection", "Repair", "Replacement", "Scheduled Maintenance", "Upgrade"];
  const jobPriorityOptions = ["High", "Medium", "Low"];
  const jobStatusOptions = ["Open", "In Progress", "Completed", "Cancelled"];

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <SelectField label="Ship" id="shipId" name="shipId" value={jobData.shipId} onChange={handleChange} error={errors.shipId} required>
        <option value="">Select Ship</option>
        {ships.map(ship => <option key={ship.id} value={ship.id}>{ship.name}</option>)}
      </SelectField>

      <SelectField label="Component" id="componentId" name="componentId" value={jobData.componentId} onChange={handleChange} disabled={!jobData.shipId || availableComponents.length === 0} error={errors.componentId} required>
        <option value="">Select Component</option>
        {availableComponents.map(comp => <option key={comp.id} value={comp.id}>{comp.name} (SN: {comp.serialNumber})</option>)}
      </SelectField>
      
      <SelectField label="Job Type" id="type" name="type" value={jobData.type} onChange={handleChange} error={errors.type} required>
        {jobTypeOptions.map(type => <option key={type} value={type}>{type}</option>)}
      </SelectField>

      <SelectField label="Priority" id="priority" name="priority" value={jobData.priority} onChange={handleChange} required>
        {jobPriorityOptions.map(prio => <option key={prio} value={prio}>{prio}</option>)}
      </SelectField>

      <SelectField label="Status" id="status" name="status" value={jobData.status} onChange={handleChange} required>
        {jobStatusOptions.map(status => <option key={status} value={status}>{status}</option>)}
      </SelectField>
      
      <InputField
        label="Scheduled Date"
        id="scheduledDate"
        name="scheduledDate"
        type="date"
        value={jobData.scheduledDate}
        onChange={handleChange}
        error={errors.scheduledDate}
        required
      />

    {canAssignJobs(currentUser) ? (
        <SelectField label="Assigned Engineer" id="assignedEngineerId" name="assignedEngineerId" value={jobData.assignedEngineerId} onChange={handleChange}>
          <option value="">Unassigned</option>
          {engineers.map(eng => <option key={eng.id} value={eng.id}>{eng.email}</option>)}
        </SelectField>
      ) : (
        currentUser.role === ROLES.ENGINEER && (
          <InputField label="Assigned Engineer" id="assignedEngineer" value={currentUser.email} disabled />
        )
      )}
      
      <div>
        <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">Description <span className="text-red-500">*</span></label>
        <textarea
          id="description"
          name="description"
          rows="3"
          value={jobData.description}
          onChange={handleChange}
          className={`mt-1 block w-full px-3 py-2 border ${errors.description ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm`}
          required
        ></textarea>
        {errors.description && <p className="mt-1 text-xs text-red-500">{errors.description}</p>}
      </div>

      <div className="flex justify-end space-x-3 pt-4">
        <button type="button" onClick={onFormSubmit} className="btn btn-secondary">
          Cancel
        </button>
        <button type="submit" className="btn btn-primary">
          {existingJob ? 'Update Job' : 'Create Job'}
        </button>
      </div>
    </form>
  );
};

export default JobForm;