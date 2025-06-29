import React, { useState, useEffect } from 'react';
import { useData } from '../../contexts/DataContext';
import InputField from '../UI/InputField';

const ShipForm = ({ existingShip, onFormSubmit }) => {
  const { addShip, updateShip } = useData();
  const [shipData, setShipData] = useState({
    name: '',
    imo: '',
    flag: '',
    status: 'Active', // Default status
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (existingShip) {
      setShipData(existingShip);
    } else {
      setShipData({ name: '', imo: '', flag: '', status: 'Active' }); // Reset for new
    }
  }, [existingShip]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setShipData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({...prev, [name]: null}));
    }
  };

  const validate = () => {
    const newErrors = {};
    if (!shipData.name.trim()) newErrors.name = 'Ship name is required.';
    if (!shipData.imo.trim()) newErrors.imo = 'IMO number is required.';
    else if (!/^\d{7}$/.test(shipData.imo.trim())) newErrors.imo = 'IMO number must be 7 digits.';
    if (!shipData.flag.trim()) newErrors.flag = 'Flag is required.';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    if (existingShip) {
      updateShip(shipData);
    } else {
      addShip(shipData);
    }
    onFormSubmit(); // Close modal or navigate
    setShipData({ name: '', imo: '', flag: '', status: 'Active' }); // Reset form
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <InputField
        label="Ship Name"
        id="name"
        name="name"
        value={shipData.name}
        onChange={handleChange}
        error={errors.name}
        required
      />
      <InputField
        label="IMO Number (7 digits)"
        id="imo"
        name="imo"
        value={shipData.imo}
        onChange={handleChange}
        error={errors.imo}
        required
      />
      <InputField
        label="Flag"
        id="flag"
        name="flag"
        value={shipData.flag}
        onChange={handleChange}
        error={errors.flag}
        required
      />
      <div>
        <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1">Status</label>
        <select
          id="status"
          name="status"
          value={shipData.status}
          onChange={handleChange}
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
        >
          <option value="Active">Active</option>
          <option value="Under Maintenance">Under Maintenance</option>
          <option value="Inactive">Inactive</option>
        </select>
      </div>
      <div className="flex justify-end space-x-3 pt-4">
        <button type="button" onClick={onFormSubmit} className="btn btn-secondary">
          Cancel
        </button>
        <button type="submit" className="btn btn-primary">
          {existingShip ? 'Update Ship' : 'Add Ship'}
        </button>
      </div>
    </form>
  );
};

export default ShipForm;