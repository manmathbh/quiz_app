import React from 'react';
import { Settings, Users, BarChart3, Shield } from 'lucide-react';

const AdminDashboard = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="bg-white shadow rounded-lg p-6">
        <div className="flex items-center mb-6">
          <Shield className="h-8 w-8 text-primary-600 mr-3" />
          <h1 className="text-2xl font-bold text-gray-900">
            Admin Dashboard
          </h1>
        </div>

        <div className="text-center py-12">
          <Settings className="mx-auto h-12 w-12 text-gray-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Administrative Controls
          </h3>
          <p className="text-gray-600">
            This page will contain administrative features and system management:
          </p>
          <ul className="text-sm text-gray-500 mt-4 space-y-2">
            <li>• User management and role assignments</li>
            <li>• Quiz moderation and approval system</li>
            <li>• System-wide statistics and analytics</li>
            <li>• Content management and curation</li>
            <li>• Platform settings and configuration</li>
            <li>• Security and access control</li>
            <li>• Performance monitoring and reporting</li>
          </ul>
        </div>

        <div className="border-t border-gray-200 pt-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center text-sm text-gray-500">
              <Users className="h-4 w-4 mr-1" />
              Administrative tools and system management
            </div>
            <button className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700">
              <BarChart3 className="h-4 w-4 mr-2" />
              System Analytics
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;

