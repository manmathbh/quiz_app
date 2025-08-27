import React from 'react';
import { Trophy, BarChart3, Calendar } from 'lucide-react';

const ScoreHistory = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="bg-white shadow rounded-lg p-6">
        <div className="flex items-center mb-6">
          <Trophy className="h-8 w-8 text-primary-600 mr-3" />
          <h1 className="text-2xl font-bold text-gray-900">
            Score History
          </h1>
        </div>

        <div className="text-center py-12">
          <BarChart3 className="mx-auto h-12 w-12 text-gray-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Performance Analytics
          </h3>
          <p className="text-gray-600">
            This page will display detailed score history and performance analytics:
          </p>
          <ul className="text-sm text-gray-500 mt-4 space-y-2">
            <li>• Complete quiz attempt history</li>
            <li>• Performance trends and statistics</li>
            <li>• Category-wise performance breakdown</li>
            <li>• Score progression over time</li>
            <li>• Achievement badges and milestones</li>
            <li>• Detailed answer analysis for each attempt</li>
          </ul>
        </div>

        <div className="border-t border-gray-200 pt-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center text-sm text-gray-500">
              <Calendar className="h-4 w-4 mr-1" />
              Historical performance data and analytics
            </div>
            <button className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700">
              <BarChart3 className="h-4 w-4 mr-2" />
              View Analytics
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ScoreHistory;

