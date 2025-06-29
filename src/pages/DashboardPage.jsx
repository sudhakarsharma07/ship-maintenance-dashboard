import React from 'react';
import { useData } from '../contexts/DataContext';
import { Link } from 'react-router-dom';
import { isOverdue } from '../utils/helpers';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const KPICard = ({ title, value, linkTo, linkText = "View Details" }) => (
  <div className="bg-white p-6 rounded-lg shadow-lg">
    <h3 className="text-lg font-semibold text-gray-500">{title}</h3>
    <p className="text-3xl font-bold text-gray-800 my-2">{value}</p>
    {linkTo && <Link to={linkTo} className="text-blue-500 hover:text-blue-700 text-sm">{linkText}</Link>}
  </div>
);

const SimpleBarChart = ({ data, dataKey, xAxisKey, title }) => {
    return (
        <div className="bg-white p-6 rounded-lg shadow-lg min-h-[300px]">
            <h3 className="text-lg font-semibold text-gray-700 mb-4">{title}</h3>
            <div className="flex items-center justify-center h-full text-gray-400">
                <ResponsiveContainer width="100%" height={350}>
                    <BarChart data={data}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey={xAxisKey} />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey={dataKey} fill="#8884d8" />
                    </BarChart>
                </ResponsiveContainer>
                {/* Chart Placeholder for "{title}" */}
            </div>
        </div>
    );
};


const DashboardPage = () => {
  const { ships, components, jobs, loading } = useData();

  if (loading) return <p>Loading dashboard data...</p>;

  const totalShips = ships.length;
  
  const componentsWithOverdueMaintenance = components.filter(comp => 
    isOverdue(comp.lastMaintenanceDate) // Assuming a simple check, might need more complex logic
  ).length;

  const jobsInProgress = jobs.filter(job => job.status === 'In Progress').length;
  const jobsCompleted = jobs.filter(job => job.status === 'Completed').length;
  const jobsOpen = jobs.filter(job => job.status === 'Open').length;

  // Prepare data for charts (example)
  const jobStatusData = [
    { name: 'Open', count: jobsOpen },
    { name: 'In Progress', count: jobsInProgress },
    { name: 'Completed', count: jobsCompleted },
  ];

  const shipStatusCounts = ships.reduce((acc, ship) => {
    acc[ship.status] = (acc[ship.status] || 0) + 1;
    return acc;
  }, {});
  const shipStatusChartData = Object.entries(shipStatusCounts).map(([name, count]) => ({ name, count }));


  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-semibold text-gray-800">Dashboard</h1>
      
      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <KPICard title="Total Ships" value={totalShips} linkTo="/ships" />
        <KPICard title="Components Overdue" value={componentsWithOverdueMaintenance} linkTo="/jobs?status=Overdue" linkText="View Overdue" />
        <KPICard title="Jobs In Progress" value={jobsInProgress} linkTo="/jobs?status=In Progress" />
        <KPICard title="Jobs Completed (All Time)" value={jobsCompleted} linkTo="/jobs?status=Completed" />
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
        <SimpleBarChart data={jobStatusData} dataKey="count" xAxisKey="name" title="Job Status Overview" />
        <SimpleBarChart data={shipStatusChartData} dataKey="count" xAxisKey="name" title="Ship Status Overview" />
      </div>

      {/* Quick Links or Recent Activity (Optional) */}
      <div className="mt-8 bg-white p-6 rounded-lg shadow-lg">
        <h2 className="text-xl font-semibold text-gray-700 mb-4">Quick Access</h2>
        <div className="space-x-4">
            <Link to="/ships" className="btn btn-primary">Add New Ship</Link>
            <Link to="/jobs" className="btn btn-primary">Create New Job</Link>
        </div>
      </div>

    </div>
  );
};

export default DashboardPage;