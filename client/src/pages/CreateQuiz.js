import React from 'react';
import { Plus, BookOpen, Settings } from 'lucide-react';

const CreateQuiz = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="bg-white shadow rounded-lg p-6">
        <div className="flex items-center mb-6">
          <Plus className="h-8 w-8 text-primary-600 mr-3" />
          <h1 className="text-2xl font-bold text-gray-900">
            Create New Quiz
          </h1>
        </div>

        <div className="text-center py-12">
          <BookOpen className="mx-auto h-12 w-12 text-gray-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Quiz Creation Interface
          </h3>
          <p className="text-gray-600">
            This page will contain the quiz creation form with the following features:
          </p>
          <ul className="text-sm text-gray-500 mt-4 space-y-2">
            <li>• Quiz title and description</li>
            <li>• Category and difficulty selection</li>
            <li>• Time limit and passing score settings</li>
            <li>• Multiple choice question builder</li>
            <li>• Question options and correct answer selection</li>
            <li>• Preview and publish functionality</li>
          </ul>
        </div>

        <div className="border-t border-gray-200 pt-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center text-sm text-gray-500">
              <Settings className="h-4 w-4 mr-1" />
              Advanced settings will be available here
            </div>
            <button className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700">
              <Plus className="h-4 w-4 mr-2" />
              Create Quiz
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateQuiz;

