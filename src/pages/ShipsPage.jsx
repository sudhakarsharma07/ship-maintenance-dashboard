import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useData } from '../contexts/DataContext';
import { useAuth } from '../contexts/AuthContext';
import { ROLES, canCreate, canEdit, canDelete } from '../utils/roleUtils';
import Modal from '../components/UI/Modal';
import ShipForm from '../components/Ships/ShipForm'; // We'll create this next

const ShipsPage = () => {
  const { ships, deleteShip, loading } = useData();
  const { currentUser } = useAuth();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingShip, setEditingShip] = useState(null);

  const openModalForCreate = () => {
    setEditingShip(null);
    setIsModalOpen(true);
  };

  const openModalForEdit = (ship) => {
    setEditingShip(ship);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingShip(null);
  };

  const handleDelete = (shipId) => {
    if (window.confirm('Are you sure you want to delete this ship and all its components and jobs?')) {
      deleteShip(shipId);
    }
  };

  if (loading) return <p>Loading ships...</p>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-semibold text-gray-800">Ships Management</h1>
        {canCreate(currentUser) && (
          <button onClick={openModalForCreate} className="btn btn-primary">
            Add New Ship
          </button>
        )}
      </div>

      {ships.length === 0 ? (
        <p className="text-gray-600">No ships found. Add one to get started!</p>
      ) : (
        <div className="bg-white shadow-md rounded-lg overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">IMO Number</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Flag</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {ships.map((ship) => (
                <tr key={ship.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    <Link to={`/ships/${ship.id}`} className="text-blue-600 hover:text-blue-800">
                      {ship.name}
                    </Link>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{ship.imo}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{ship.flag}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        ship.status === 'Active' ? 'bg-green-100 text-green-800' : 
                        ship.status === 'Under Maintenance' ? 'bg-yellow-100 text-yellow-800' : 
                        'bg-red-100 text-red-800'
                      }`}>
                      {ship.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                    <Link to={`/ships/${ship.id}`} className="text-indigo-600 hover:text-indigo-900">View</Link>
                    {canEdit(currentUser) && (
                      <button onClick={() => openModalForEdit(ship)} className="text-yellow-600 hover:text-yellow-900">Edit</button>
                    )}
                    {canDelete(currentUser) && (
                      <button onClick={() => handleDelete(ship.id)} className="text-red-600 hover:text-red-900">Delete</button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <Modal isOpen={isModalOpen} onClose={closeModal} title={editingShip ? 'Edit Ship' : 'Add New Ship'}>
        <ShipForm existingShip={editingShip} onFormSubmit={closeModal} />
      </Modal>
    </div>
  );
};

export default ShipsPage;