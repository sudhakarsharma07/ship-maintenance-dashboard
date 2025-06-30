import React from 'react';
import { useData } from '../contexts/DataContext';
import { Link } from 'react-router-dom';
import { isOverdue } from '../utils/helpers';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, Legend, ResponsiveContainer
} from 'recharts';

import {
  HiExclamationCircle,
  HiRefresh,
  HiCheckCircle,
  HiLightningBolt,
} from 'react-icons/hi';
import { FaShip } from 'react-icons/fa'; // ✅ Valid Ship Icon from Font Awesome

const KPICard = ({ icon: Icon, title, value, linkTo, linkText = "View Details" }) => (
  <div className="bg-white/70 backdrop-blur-sm p-6 rounded-xl shadow-md hover:shadow-lg border border-gray-100 transition space-y-2">
    <div className="flex items-center gap-3">
      <Icon className="text-2xl text-blue-600" />
      <h3 className="text-sm text-gray-500 font-medium uppercase">{title}</h3>
    </div>
    <p className="text-4xl font-bold text-blue-900">{value}</p>
    {linkTo && (
      <Link
        to={linkTo}
        className="text-sm text-blue-600 hover:text-indigo-700 transition font-medium"
      >
        {linkText}
      </Link>
    )}
  </div>
);

const SimpleBarChart = ({ data, dataKey, xAxisKey, title }) => (
  <div className="bg-white/80 backdrop-blur p-6 rounded-xl shadow border border-gray-200 min-h-[320px]">
    <div className="flex items-center gap-2 mb-4 text-gray-700">
      <HiLightningBolt className="text-xl text-indigo-600" />
      <h3 className="text-md font-semibold">{title}</h3>
    </div>
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={data}>
        <defs>
          <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#6366f1" stopOpacity={0.8} />
            <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.5} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
        <XAxis dataKey={xAxisKey} />
        <YAxis />
        <Tooltip />
        <Legend />
        <Bar dataKey={dataKey} fill="url(#barGradient)" radius={[6, 6, 0, 0]} barSize={40} />
      </BarChart>
    </ResponsiveContainer>
  </div>
);

const DashboardPage = () => {
  const { ships, components, jobs, loading } = useData();

  if (loading) return <p className="text-center text-gray-500 mt-10">Loading dashboard data...</p>;

  const totalShips = ships.length;

  const componentsWithOverdueMaintenance = components.filter(comp =>
    isOverdue(comp.lastMaintenanceDate)
  ).length;

  const jobsInProgress = jobs.filter(job => job.status === 'In Progress').length;
  const jobsCompleted = jobs.filter(job => job.status === 'Completed').length;
  const jobsOpen = jobs.filter(job => job.status === 'Open').length;

  const jobStatusData = [
    { name: 'Open', count: jobsOpen },
    { name: 'In Progress', count: jobsInProgress },
    { name: 'Completed', count: jobsCompleted }
  ];

  const shipStatusCounts = ships.reduce((acc, ship) => {
    acc[ship.status] = (acc[ship.status] || 0) + 1;
    return acc;
  }, {});
  const shipStatusChartData = Object.entries(shipStatusCounts).map(([name, count]) => ({
    name,
    count
  }));

  return (
    <div className="space-y-10 px-4 md:px-8 lg:px-16 py-10">
      <h1 className="text-4xl font-extrabold text-gray-800 tracking-tight">Dashboard Overview</h1>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <KPICard icon={FaShip} title="Total Ships" value={totalShips} linkTo="/ships" />
        <KPICard icon={HiExclamationCircle} title="Overdue Components" value={componentsWithOverdueMaintenance} linkTo="/jobs?status=Overdue" linkText="View Overdue" />
        <KPICard icon={HiRefresh} title="Jobs In Progress" value={jobsInProgress} linkTo="/jobs?status=In Progress" />
        <KPICard icon={HiCheckCircle} title="Jobs Completed" value={jobsCompleted} linkTo="/jobs?status=Completed" />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <SimpleBarChart data={jobStatusData} dataKey="count" xAxisKey="name" title="Job Status Distribution" />
        <SimpleBarChart data={shipStatusChartData} dataKey="count" xAxisKey="name" title="Ship Status Overview" />
      </div>

      {/* Quick Access */}
      <div className="bg-white/80 backdrop-blur-md p-6 rounded-xl shadow border border-gray-200">
        <h2 className="text-xl font-semibold text-gray-700 mb-4">🚀 Quick Access</h2>
        <div className="flex flex-wrap gap-4">
          <Link to="/ships" className="btn btn-primary">Add New Ship</Link>
          <Link to="/jobs" className="btn btn-primary">Create New Job</Link>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
