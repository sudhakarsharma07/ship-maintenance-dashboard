import { format } from 'date-fns';

export const formatDate = (dateString, dateFormat = 'yyyy-MM-dd') => {
  if (!dateString) return 'N/A';
  try {
    return format(new Date(dateString), dateFormat);
  } catch (error) {
    return dateString; 
  }
};

export const isOverdue = (dateString) => {
  if (!dateString) return false;
  return new Date(dateString) < new Date();
};