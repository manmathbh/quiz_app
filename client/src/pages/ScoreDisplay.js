import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { CheckCircle, XCircle, Trophy, Clock, Target, ArrowLeft, BarChart3 } from 'lucide-react';
import axios from 'axios';
import toast from 'react-hot-toast';

const ScoreDisplay = () => {
  const { scoreId } = useParams();
  const navigate = useNavigate();
  
  const [score, setScore] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchScore = async () => {
      try {
        const response = await axios.get(`/api/score/${scoreId}`, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });
        setScore(response.data);
        setLoading(false);
      } catch (err) {
        setError('Failed to load score');
        setLoading(false);
        toast.error('Failed to load score');
      }
    };

    fetchScore();
  }, [scoreId]);

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white shadow rounded-lg p-6">
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading results...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error || !score) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white shadow rounded-lg p-6">
          <div className="text-center py-12">
            <XCircle className="mx-auto h-12 w-12 text-red-500 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Error Loading Results</h3>
            <p className="text-gray-600">{error || 'Score not found'}</p>
            <button
              onClick={() => navigate('/dashboard')}
              className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Back to Dashboard
            </button>
          </div>
        </div>
      </div>
    );
  }

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="bg-white shadow rounded-lg p-6 mb-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Quiz Results</h1>
            <p className="text-gray-600">{score.quiz.title}</p>
          </div>
          <button
            onClick={() => navigate('/dashboard')}
            className="flex items-center px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Dashboard
          </button>
        </div>
      </div>

      {/* Score Summary */}
      <div className="bg-white shadow rounded-lg p-6 mb-6">
        <div className="text-center mb-6">
          <div className={`inline-flex items-center justify-center w-20 h-20 rounded-full mb-4 ${
            score.passed ? 'bg-green-100' : 'bg-red-100'
          }`}>
            {score.passed ? (
              <Trophy className="h-10 w-10 text-green-600" />
            ) : (
              <XCircle className="h-10 w-10 text-red-600" />
            )}
          </div>
          <h2 className={`text-3xl font-bold mb-2 ${
            score.passed ? 'text-green-600' : 'text-red-600'
          }`}>
            {score.passed ? 'Congratulations!' : 'Better luck next time!'}
          </h2>
          <p className="text-gray-600">
            You {score.passed ? 'passed' : 'did not pass'} this quiz
          </p>
        </div>

        {/* Score Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center p-4 bg-blue-50 rounded-lg">
            <div className="text-3xl font-bold text-blue-600 mb-2">
              {score.percentage}%
            </div>
            <div className="flex items-center justify-center text-blue-600 mb-1">
              <Target className="h-4 w-4 mr-1" />
              <span className="text-sm font-medium">Score</span>
            </div>
            <p className="text-xs text-gray-600">
              {score.score} / {score.totalPoints} points
            </p>
          </div>

          <div className="text-center p-4 bg-green-50 rounded-lg">
            <div className="text-3xl font-bold text-green-600 mb-2">
              {score.answers.filter(a => a.correct).length}
            </div>
            <div className="flex items-center justify-center text-green-600 mb-1">
              <CheckCircle className="h-4 w-4 mr-1" />
              <span className="text-sm font-medium">Correct</span>
            </div>
            <p className="text-xs text-gray-600">
              out of {score.answers.length} questions
            </p>
          </div>

          <div className="text-center p-4 bg-purple-50 rounded-lg">
            <div className="text-3xl font-bold text-purple-600 mb-2">
              {formatTime(score.timeTaken)}
            </div>
            <div className="flex items-center justify-center text-purple-600 mb-1">
              <Clock className="h-4 w-4 mr-1" />
              <span className="text-sm font-medium">Time</span>
            </div>
            <p className="text-xs text-gray-600">
              taken to complete
            </p>
          </div>
        </div>
      </div>

      {/* Detailed Results */}
      <div className="bg-white shadow rounded-lg p-6">
        <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
          <BarChart3 className="h-5 w-5 mr-2" />
          Question Analysis
        </h3>
        
        <div className="space-y-4">
          {score.answers.map((answer, index) => (
            <div
              key={index}
              className={`p-4 rounded-lg border ${
                answer.correct
                  ? 'bg-green-50 border-green-200'
                  : 'bg-red-50 border-red-200'
              }`}
            >
              <div className="flex items-start justify-between mb-2">
                <h4 className="font-medium text-gray-900">
                  Question {index + 1}
                </h4>
                <div className={`flex items-center text-sm ${
                  answer.correct ? 'text-green-600' : 'text-red-600'
                }`}>
                  {answer.correct ? (
                    <CheckCircle className="h-4 w-4 mr-1" />
                  ) : (
                    <XCircle className="h-4 w-4 mr-1" />
                  )}
                  {answer.correct ? 'Correct' : 'Incorrect'}
                </div>
              </div>
              
              <p className="text-gray-700 mb-2">{answer.question}</p>
              
              <div className="space-y-1">
                <p className="text-sm">
                  <span className="font-medium">Your answer:</span>{' '}
                  <span className={answer.correct ? 'text-green-600' : 'text-red-600'}>
                    {answer.selectedAnswer}
                  </span>
                </p>
                
                {!answer.correct && (
                  <p className="text-sm">
                    <span className="font-medium">Correct answer:</span>{' '}
                    <span className="text-green-600">{answer.correctAnswer}</span>
                  </p>
                )}
                
                {answer.explanation && (
                  <p className="text-sm text-gray-600 mt-2">
                    <span className="font-medium">Explanation:</span> {answer.explanation}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="mt-6 flex flex-col sm:flex-row gap-4">
        <button
          onClick={() => navigate('/quizzes')}
          className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
        >
          Take Another Quiz
        </button>
        <button
          onClick={() => navigate('/dashboard')}
          className="flex-1 px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors font-medium"
        >
          View Dashboard
        </button>
      </div>
    </div>
  );
};

export default ScoreDisplay;
