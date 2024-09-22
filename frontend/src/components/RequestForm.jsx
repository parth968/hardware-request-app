import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { InputTextarea } from 'primereact/inputtextarea';
import { Dropdown } from 'primereact/dropdown';
import { RadioButton } from 'primereact/radiobutton';
import { Calendar } from 'primereact/calendar';
import { Button } from 'primereact/button';
import { toast } from 'react-toastify';
import { createRequest, fetchHardwareOptions } from '../slice/requestSlice';

const RequestForm = () => {
  const dispatch = useDispatch();
  const { hardwareOptions, loading, error } = useSelector((state) => state.requests);
  const [selectedHardware, setSelectedHardware] = useState(null);
  const [description, setDescription] = useState('');
  const [duration, setDuration] = useState('');
  const [endDate, setEndDate] = useState(null);

  useEffect(() => {
    dispatch(fetchHardwareOptions());
  }, [dispatch]);

  const handleSubmit = () => {
    if (!selectedHardware || !description || (duration === 'temporary' && !endDate)) {
      toast.error("Please fill in all required fields.");
      return;
    }
    
    dispatch(createRequest({ hardwareId: selectedHardware, description, duration, endDate }))
      .unwrap()
      .then(() => {
        toast.success("Request submitted successfully!");
        // Reset form fields after successful submission
        setSelectedHardware(null);
        setDescription('');
        setDuration('');
        setEndDate(null);
      })
      .catch(() => {
        toast.error(error || "Failed to submit request");
      });
  };

  return (
    <div className="bg-gray-100 mx-32 my-4 p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4">Request Form</h2>
      <div className="mb-4">
        <label className="block mb-2">Select Item to Request</label>
        <Dropdown
          options={hardwareOptions}
          value={selectedHardware}
          onChange={(e) => setSelectedHardware(e.value)}
          placeholder="Select an item"
          filter
          showClear
          className="w-full p-2 border border-gray-300 rounded"
        />
      </div>
      <div className="mb-4">
        <label className="block mb-2">Description</label>
        <InputTextarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Enter description"
          className="w-full p-2 border border-gray-300 rounded"
          rows={5}
        />
      </div>
      <div className="mb-4">
        <label className="block mb-2">Duration</label>
        <div className="flex gap-4">
          <div>
            <RadioButton
              inputId="lifetime"
              value="lifetime"
              name="duration"
              onChange={(e) => setDuration(e.value)}
              checked={duration === 'lifetime'}
            />
            <label htmlFor="lifetime" className='ml-2'>Lifetime</label>
          </div>
          <div>
            <RadioButton
              inputId="temporary"
              value="temporary"
              name="duration"
              onChange={(e) => setDuration(e.value)}
              checked={duration === 'temporary'}
            />
            <label htmlFor="temporary" className='ml-2'>Temporary</label>
          </div>
        </div>
        {duration === 'temporary' && (
          <Calendar
            value={endDate}
            onChange={(e) => setEndDate(e.value)}
            placeholder="Select end date"
            className="mt-6  border border-gray-300 rounded"
          />
        )}
      </div>
      <div className="flex justify-center mb-4">
        <Button
          type="button"
          label="Submit Request"
          onClick={handleSubmit}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded shadow-md transition duration-300"
          disabled={loading}
        />
      </div>
    </div>
  );
};

export default RequestForm;