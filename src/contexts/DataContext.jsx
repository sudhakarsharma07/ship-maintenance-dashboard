import React, { createContext, useState, useContext, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { 
    getShips, saveShips, 
    getComponents, saveComponents, 
    getJobs, saveJobs, getUsers
} from '../services/localStorageService';
import { useNotifications } from './NotificationContext';

const DataContext = createContext(null);

export const useData = () => useContext(DataContext);

export const DataProvider = ({ children }) => {
  const [ships, setShips] = useState([]);
  const [components, setComponents] = useState([]);
  const [jobs, setJobs] = useState([]);
  const [engineers, setEngineers] = useState([]);
  const [loading, setLoading] = useState(true);
  const { addNotification } = useNotifications();

  useEffect(() => {
    setShips(getShips());
    setComponents(getComponents());
    setJobs(getJobs());
    const allUsers = getUsers();
    setEngineers(allUsers.filter(user => user.role === 'Engineer'));
    setLoading(false);
  }, []);

  // --- Ships ---
  const addShip = (ship) => {
    const newShip = { ...ship, id: uuidv4() };
    const updatedShips = [...ships, newShip];
    setShips(updatedShips);
    saveShips(updatedShips);
    addNotification('Ship created successfully', 'success');
    return newShip;
  };

  const updateShip = (updatedShip) => {
    const updatedShips = ships.map(ship => ship.id === updatedShip.id ? updatedShip : ship);
    setShips(updatedShips);
    saveShips(updatedShips);
    addNotification('Ship updated successfully', 'success');
    return updatedShip;
  };

  const deleteShip = (shipId) => {
    // Also delete associated components and jobs
    const updatedComponents = components.filter(comp => comp.shipId !== shipId);
    setComponents(updatedComponents);
    saveComponents(updatedComponents);

    const updatedJobs = jobs.filter(job => job.shipId !== shipId);
    setJobs(updatedJobs);
    saveJobs(updatedJobs);
    
    const updatedShips = ships.filter(ship => ship.id !== shipId);
    setShips(updatedShips);
    saveShips(updatedShips);
    addNotification('Ship and associated data deleted', 'success');
  };

  // --- Components ---
  const addComponent = (component) => {
    const newComponent = { ...component, id: uuidv4() };
    const updatedComponents = [...components, newComponent];
    setComponents(updatedComponents);
    saveComponents(updatedComponents);
    addNotification('Component added successfully', 'success');
    return newComponent;
  };

  const updateComponent = (updatedComponent) => {
    const updatedComponents = components.map(comp => comp.id === updatedComponent.id ? updatedComponent : comp);
    setComponents(updatedComponents);
    saveComponents(updatedComponents);
    addNotification('Component updated successfully', 'success');
    return updatedComponent;
  };

  const deleteComponent = (componentId) => {
    // Also delete associated jobs
    const updatedJobs = jobs.filter(job => job.componentId !== componentId);
    setJobs(updatedJobs);
    saveJobs(updatedJobs);

    const updatedComponents = components.filter(comp => comp.id !== componentId);
    setComponents(updatedComponents);
    saveComponents(updatedComponents);
    addNotification('Component and associated jobs deleted', 'success');
  };
  
  // --- Jobs ---
  const addJob = (job) => {
    const newJob = { ...job, id: uuidv4() };
    const updatedJobs = [...jobs, newJob];
    setJobs(updatedJobs);
    saveJobs(updatedJobs);
    addNotification('Job created successfully: ' + newJob.description, 'success');
    return newJob;
  };

  const updateJob = (updatedJob) => {
    const updatedJobs = jobs.map(j => j.id === updatedJob.id ? updatedJob : j);
    setJobs(updatedJobs);
    saveJobs(updatedJobs);
    addNotification(`Job updated: ${updatedJob.description} to ${updatedJob.status}`, 'info');
    return updatedJob;
  };

  const deleteJob = (jobId) => {
    const updatedJobs = jobs.filter(job => job.id !== jobId);
    setJobs(updatedJobs);
    saveJobs(updatedJobs);
    addNotification('Job deleted successfully', 'success');
  };

  const value = {
    ships, addShip, updateShip, deleteShip,
    components, addComponent, updateComponent, deleteComponent,
    getComponentsByShipId: (shipId) => components.filter(c => c.shipId === shipId),
    jobs, addJob, updateJob, deleteJob,
    getJobsByShipId: (shipId) => jobs.filter(j => j.shipId === shipId),
    getJobsByComponentId: (componentId) => jobs.filter(j => j.componentId === componentId),
    engineers,
    loading
  };

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
};