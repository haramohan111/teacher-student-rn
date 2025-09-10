import React, { FC } from 'react';


const Dashboard: FC = () => {
  return (
    <>
      <h1>Dashboard Overview</h1>
      <div className="cards">
        <div className="card">Total Users: 1,234</div>
        <div className="card">Revenue: $12,345</div>
        <div className="card">Orders: 56</div>
        <div className="card">Messages: 23</div>
      </div>
    </>
  );
};

export default Dashboard;
