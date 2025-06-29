import { initialUsers, initialShips, initialComponents, initialJobs } from '../config/initialData';

const USERS_KEY = 'entnt_users';
const SHIPS_KEY = 'entnt_ships';
const COMPONENTS_KEY = 'entnt_components';
const JOBS_KEY = 'entnt_jobs';
const SESSION_KEY = 'entnt_session';

const initializeData = (key, initialData) => {
  if (!localStorage.getItem(key)) {
    localStorage.setItem(key, JSON.stringify(initialData));
  }
};

// Initialize data if not present
initializeData(USERS_KEY, initialUsers);
initializeData(SHIPS_KEY, initialShips);
initializeData(COMPONENTS_KEY, initialComponents);
initializeData(JOBS_KEY, initialJobs);

// Generic Get/Set
const getItem = (key) => JSON.parse(localStorage.getItem(key)) || [];
const setItem = (key, data) => localStorage.setItem(key, JSON.stringify(data));

// User Session
export const getSession = () => JSON.parse(localStorage.getItem(SESSION_KEY));
export const setSession = (sessionData) => localStorage.setItem(SESSION_KEY, JSON.stringify(sessionData));
export const clearSession = () => localStorage.removeItem(SESSION_KEY);

// Users (Primarily for login, not full CRUD in this example)
export const getUsers = () => getItem(USERS_KEY);

// Ships
export const getShips = () => getItem(SHIPS_KEY);
export const saveShips = (ships) => setItem(SHIPS_KEY, ships);

// Components
export const getComponents = () => getItem(COMPONENTS_KEY);
export const saveComponents = (components) => setItem(COMPONENTS_KEY, components);

// Jobs
export const getJobs = () => getItem(JOBS_KEY);
export const saveJobs = (jobs) => setItem(JOBS_KEY, jobs);