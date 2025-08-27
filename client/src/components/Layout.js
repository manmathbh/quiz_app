import React from 'react';
import Navigation from './Navigation';

const Layout = ({ children }) => {
  const currentYear = new Date().getFullYear();

  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />
      <main className="flex-1">
        {children}
      </main>
      <footer className="bg-white border-t border-gray-200 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center text-gray-500">
            <p>&copy; {currentYear} Quiz Platform. All rights reserved. Built by Manmath</p>
            <p className="mt-2 text-sm">
              Built with React, Node.js, Express, and MongoDB
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Layout;

