import React from 'react';
import { User, Settings, Edit } from 'lucide-react';

const Profile = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="bg-white shadow rounded-lg p-6">
        <div className="flex items-center mb-6">
          <User className="h-8 w-8 text-primary-600 mr-3" />
          <h1 className="text-2xl font-bold text-gray-900">
            User Profile
          </h1>
        </div>

        <div className="text-center py-12">
          <div className="mx-auto h-24 w-24 bg-gray-200 rounded-full flex items-center justify-center mb-4">
            <User className="h-12 w-12 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Profile Management
          </h3>
          <p className="text-gray-600">
            This page will contain user profile information and settings:
          </p>
          <ul className="text-sm text-gray-500 mt-4 space-y-2">
            <li>• Personal information (name, email, bio)</li>
            <li>• Profile picture upload</li>
            <li>• Account settings and preferences</li>
            <li>• Password change functionality</li>
            <li>• Privacy settings</li>
            <li>• Account statistics and achievements</li>
          </ul>
        </div>

        <div className="border-t border-gray-200 pt-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center text-sm text-gray-500">
              <Settings className="h-4 w-4 mr-1" />
              Profile settings and preferences
            </div>
            <button className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700">
              <Edit className="h-4 w-4 mr-2" />
              Edit Profile
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;

