import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { Play, Clock, Target, Users, ArrowLeft } from 'lucide-react';

const QuizDetail = () => {
  const { id } = useParams();

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-6">
        <Link
          to="/quizzes"
          className="inline-flex items-center text-sm text-gray-500 hover:text-gray-700"
        >
          <ArrowLeft className="h-4 w-4 mr-1" />
          Back to Quizzes
        </Link>
      </div>

      <div className="bg-white shadow rounded-lg p-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          Quiz Detail Page
        </h1>
        <p className="text-gray-600 mb-6">
          This page will show detailed information about quiz ID: {id}
        </p>
        
        <div className="flex items-center space-x-4 mb-6">
          <div className="flex items-center text-sm text-gray-500">
            <Clock className="h-4 w-4 mr-1" />
            30 minutes
          </div>
          <div className="flex items-center text-sm text-gray-500">
            <Target className="h-4 w-4 mr-1" />
            Medium
          </div>
          <div className="flex items-center text-sm text-gray-500">
            <Users className="h-4 w-4 mr-1" />
            0 attempts
          </div>
        </div>

        <Link
          to={`/take-quiz/${id}`}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700"
        >
          <Play className="h-4 w-4 mr-2" />
          Start Quiz
        </Link>
      </div>
    </div>
  );
};

export default QuizDetail;

