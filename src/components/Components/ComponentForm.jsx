import React, { useState, useEffect } from 'react';
import { useData } from '../../contexts/DataContext';
import InputField from '../UI/InputField';
import { formatDate } from '../../utils/helpers';

const ComponentForm = ({ shipId, existingComponent, onFormSubmit }) => {
  const { addComponent, updateComponent } = useData();
  const [componentData, setComponentData] = useState({
    shipId: shipId,
    name: '',
    serialNumber: '',
    installDate: '',
    lastMaintenanceDate: '',
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (existingComponent) {
      setComponentData({
        ...existingComponent,
        installDate: existingComponent.installDate ? formatDate(existingComponent.installDate, 'yyyy-MM-dd') : '',
        lastMaintenanceDate: existingComponent.lastMaintenanceDate ? formatDate(existingComponent.lastMaintenanceDate, 'yyyy-MM-dd') : '',
      });
    } else {
      setComponentData({
        shipId: shipId,
        name: '',
        serialNumber: '',
        installDate: '',
        lastMaintenanceDate: '',
      });
    }
  }, [existingComponent, shipId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setComponentData(prev => ({ ...prev, [name]: value }));
     if (errors[name]) {
      setErrors(prev => ({...prev, [name]: null}));
    }
  };

  const validate = () => {
    const newErrors = {};
    if (!componentData.name.trim()) newErrors.name = 'Component name is required.';
    if (!componentData.serialNumber.trim()) newErrors.serialNumber = 'Serial number is required.';
    if (!componentData.installDate) newErrors.installDate = 'Installation date is required.';
    // lastMaintenanceDate can be optional initially
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if(!validate()) return;

    const dataToSave = {
        ...componentData,
        // Ensure dates are stored consistently, e.g., as ISO strings or YYYY-MM-DD
        installDate: componentData.installDate ? new Date(componentData.installDate).toISOString().split('T')[0] : null,
        lastMaintenanceDate: componentData.lastMaintenanceDate ? new Date(componentData.lastMaintenanceDate).toISOString().split('T')[0] : null,
    };


    if (existingComponent) {
      updateComponent(dataToSave);
    } else {
      addComponent(dataToSave);
    }
    onFormSubmit();
    setComponentData({ shipId: shipId, name: '', serialNumber: '', installDate: '', lastMaintenanceDate: '' }); // Reset
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <InputField
        label="Component Name"
        id="name"
        name="name"
        value={componentData.name}
        onChange={handleChange}
        error={errors.name}
        required
      />
      <InputField
        label="Serial Number"
        id="serialNumber"
        name="serialNumber"
        value={componentData.serialNumber}
        onChange={handleChange}
        error={errors.serialNumber}
        required
      />
      <InputField
        label="Installation Date"
        id="installDate"
        name="installDate"
        type="date"
        value={componentData.installDate}
        onChange={handleChange}
        error={errors.installDate}
        required
      />
      <InputField
        label="Last Maintenance Date"
        id="lastMaintenanceDate"
        name="lastMaintenanceDate"
        type="date"
        value={componentData.lastMaintenanceDate}
        onChange={handleChange}
        error={errors.lastMaintenanceDate}
      />
      <div className="flex justify-end space-x-3 pt-4">
        <button type="button" onClick={onFormSubmit} className="btn btn-secondary">
          Cancel
        </button>
        <button type="submit" className="btn btn-primary">
          {existingComponent ? 'Update Component' : 'Add Component'}
        </button>
      </div>
    </form>
  );
};

export default ComponentForm;