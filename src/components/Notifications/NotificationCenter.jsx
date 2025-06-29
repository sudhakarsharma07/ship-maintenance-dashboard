import React from 'react';
import { useNotifications } from '../../contexts/NotificationContext';

const Notification = ({ message, type, onDismiss }) => {
  let bgColor, textColor, borderColor;

  switch (type) {
    case 'success':
      bgColor = 'bg-green-100';
      textColor = 'text-green-700';
      borderColor = 'border-green-400';
      break;
    case 'error':
      bgColor = 'bg-red-100';
      textColor = 'text-red-700';
      borderColor = 'border-red-400';
      break;
    case 'warning':
      bgColor = 'bg-yellow-100';
      textColor = 'text-yellow-700';
      borderColor = 'border-yellow-400';
      break;
    default: // info
      bgColor = 'bg-blue-100';
      textColor = 'text-blue-700';
      borderColor = 'border-blue-400';
  }

  return (
    <div
      className={`p-3 rounded-md shadow-md border-l-4 ${bgColor} ${borderColor} ${textColor} flex justify-between items-center`}
      role="alert"
    >
      <p className="text-sm">{message}</p>
      <button
        onClick={onDismiss}
        className={`ml-4 text-sm font-semibold ${textColor} hover:opacity-75 focus:outline-none`}
        aria-label="Dismiss notification"
      >
        ×
      </button>
    </div>
  );
};

const NotificationCenter = () => {
  const { notifications, removeNotification } = useNotifications();

  if (!notifications || notifications.length === 0) {
    return null;
  }

  return (
    <div className="fixed top-5 right-5 z-[100] w-full max-w-sm space-y-3">
      {notifications.map((n) => (
        <Notification
          key={n.id}
          message={n.message}
          type={n.type}
          onDismiss={() => removeNotification(n.id)}
        />
      ))}
    </div>
  );
};

export default NotificationCenter;