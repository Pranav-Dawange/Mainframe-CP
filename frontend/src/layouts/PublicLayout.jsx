import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Navbar from '../components/Navbar';

const PublicLayout = () => {
  const location = useLocation();
  // Landing page has its own full header, so we hide the layout navbar there
  const isLanding = location.pathname === '/';

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {!isLanding && <Navbar />}
      <main className="flex-grow">
        <Outlet />
      </main>
    </div>
  );
};

export default PublicLayout;
