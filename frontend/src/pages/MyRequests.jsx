import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { getUserRequests } from '../slice/requestSlice';
import Navbar from '../components/Navbar';

const MyRequests = () => {
  const dispatch = useDispatch();
  const { userRequests } = useSelector((state) => state.requests);

  useEffect(() => {
    dispatch(getUserRequests());
  }, [dispatch]);

  const statusStyle = (status) => {
    switch (status) {
      case 'accepted':
        return { color: 'green' };
      case 'rejected':
        return { color: 'red' };
      case 'detached':
        return { color: 'orange' };
      case 'pending':
        return { color: 'blue' };
      default:
        return {};
    }
  };

  // Display End Date only if duration is 'temporary' and format to dd-mm-yyyy
  const renderEndDate = (rowData) => {
    if (rowData.duration === 'temporary' && rowData.endDate) {
      const date = new Date(rowData.endDate);
      return date.toLocaleDateString('en-GB'); // 'en-GB' formats date as dd-mm-yyyy
    }
    return 'N/A';
  };

  return (
    <>
      <Navbar />
      <div className='mx-10 my-10'>
        <h2 className='mb-4 text-2xl font-bold '>My Requests</h2>
        <DataTable value={userRequests} paginator rows={10} style={{ width: '100%' }} sortMode="single">
          <Column field="hardwareId.name" header="Item Requested" sortable />
          <Column field="description" header="Description" sortable />
          <Column field="duration" header="Duration" sortable />
          <Column
            field="endDate"
            header="End Date"
            body={renderEndDate} 
            sortable
          />
          <Column
            field="status"
            header="Status"
            body={(rowData) => (
              <span style={statusStyle(rowData.status)}>{rowData.status}</span>
            )}
            sortable
          />
        </DataTable>
      </div>
    </>
  );
};

export default MyRequests;
