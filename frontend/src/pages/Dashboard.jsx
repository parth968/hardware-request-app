import React from 'react';
import Navbar from '../components/Navbar';
import RequestForm from '../components/RequestForm';

const Dashboard = () => {
  return (
    <div>
      <Navbar />
      <div className="container mx-auto p-4">
        <RequestForm />
      </div>
    </div>
  );
};

export default Dashboard;
