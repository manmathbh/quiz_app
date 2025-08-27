import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { 
  BookOpen, 
  Trophy, 
  Users, 
  BarChart3, 
  Play,
  Plus,
  Target,
  Clock
} from 'lucide-react';

const Home = () => {
  const { isAuthenticated } = useAuth();

  const features = [
    {
      icon: <BookOpen className="h-6 w-6" />,
      title: 'Create Quizzes',
      description: 'Build custom quizzes with multiple choice questions and detailed explanations.'
    },
    {
      icon: <Play className="h-6 w-6" />,
      title: 'Take Quizzes',
      description: 'Challenge yourself with quizzes from various categories and difficulty levels.'
    },
    {
      icon: <Trophy className="h-6 w-6" />,
      title: 'Track Progress',
      description: 'Monitor your performance with detailed analytics and progress tracking.'
    },
    {
      icon: <Users className="h-6 w-6" />,
      title: 'Community',
      description: 'Join a community of learners and share your knowledge with others.'
    }
  ];

  const stats = [
    { icon: <BookOpen className="h-5 w-5" />, label: 'Quizzes Available', value: '100+' },
    { icon: <Users className="h-5 w-5" />, label: 'Active Users', value: '1,000+' },
    { icon: <Trophy className="h-5 w-5" />, label: 'Quizzes Taken', value: '5,000+' },
    { icon: <Target className="h-5 w-5" />, label: 'Categories', value: '20+' }
  ];

  return (
    <div className="bg-white">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <div className="relative z-10 pb-8 bg-white sm:pb-16 md:pb-20 lg:max-w-2xl lg:w-full lg:pb-28 xl:pb-32">
            <main className="mt-10 mx-auto max-w-7xl px-4 sm:mt-12 sm:px-6 md:mt-16 lg:mt-20 lg:px-8 xl:mt-28">
              <div className="sm:text-center lg:text-left">
                <h1 className="text-4xl tracking-tight font-extrabold text-gray-900 sm:text-5xl md:text-6xl">
                  <span className="block xl:inline">Master Your Knowledge</span>{' '}
                  <span className="block text-primary-600 xl:inline">with Interactive Quizzes</span>
                </h1>
                <p className="mt-3 text-base text-gray-500 sm:mt-5 sm:text-lg sm:max-w-xl sm:mx-auto md:mt-5 md:text-xl lg:mx-0">
                  Create, take, and track your progress with our comprehensive quiz platform. 
                  Join thousands of learners improving their skills every day.
                </p>
                <div className="mt-5 sm:mt-8 sm:flex sm:justify-center lg:justify-start">
                  {isAuthenticated ? (
                    <div className="space-y-3 sm:space-y-0 sm:space-x-3 sm:flex">
                      <Link
                        to="/quizzes"
                        className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 md:py-4 md:text-lg md:px-10"
                      >
                        <Play className="h-5 w-5 mr-2" />
                        Take a Quiz
                      </Link>
                      <Link
                        to="/create-quiz"
                        className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-primary-700 bg-primary-100 hover:bg-primary-200 md:py-4 md:text-lg md:px-10"
                      >
                        <Plus className="h-5 w-5 mr-2" />
                        Create Quiz
                      </Link>
                    </div>
                  ) : (
                    <div className="space-y-3 sm:space-y-0 sm:space-x-3 sm:flex">
                      <Link
                        to="/register"
                        className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 md:py-4 md:text-lg md:px-10"
                      >
                        Get Started
                      </Link>
                      <Link
                        to="/quizzes"
                        className="w-full flex items-center justify-center px-8 py-3 border border-gray-300 text-base font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 md:py-4 md:text-lg md:px-10"
                      >
                        Browse Quizzes
                      </Link>
                    </div>
                  )}
                </div>
              </div>
            </main>
          </div>
        </div>
        <div className="lg:absolute lg:inset-y-0 lg:right-0 lg:w-1/2">
          <div className="h-56 w-full bg-gradient-to-r from-primary-400 to-primary-600 sm:h-72 md:h-96 lg:w-full lg:h-full flex items-center justify-center">
            <div className="text-center text-white">
              <BookOpen className="h-24 w-24 mx-auto mb-4 opacity-80" />
              <h3 className="text-2xl font-bold">Interactive Learning</h3>
              <p className="mt-2 opacity-90">Engage with dynamic content</p>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="bg-gray-50 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="flex items-center justify-center h-12 w-12 rounded-md bg-primary-500 text-white mx-auto">
                  {stat.icon}
                </div>
                <dt className="mt-4 text-lg font-medium text-gray-900">{stat.value}</dt>
                <dd className="mt-1 text-sm text-gray-500">{stat.label}</dd>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="lg:text-center">
            <h2 className="text-base text-primary-600 font-semibold tracking-wide uppercase">Features</h2>
            <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl">
              Everything you need to learn effectively
            </p>
            <p className="mt-4 max-w-2xl text-xl text-gray-500 lg:mx-auto">
              Our platform provides all the tools you need to create engaging quizzes and track your learning progress.
            </p>
          </div>

          <div className="mt-10">
            <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-4">
              {features.map((feature, index) => (
                <div key={index} className="relative">
                  <div className="absolute flex items-center justify-center h-12 w-12 rounded-md bg-primary-500 text-white">
                    {feature.icon}
                  </div>
                  <p className="ml-16 text-lg leading-6 font-medium text-gray-900">{feature.title}</p>
                  <p className="mt-2 ml-16 text-base text-gray-500">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-primary-700">
        <div className="max-w-2xl mx-auto text-center py-16 px-4 sm:py-20 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-extrabold text-white sm:text-4xl">
            <span className="block">Ready to start learning?</span>
            <span className="block">Join our platform today.</span>
          </h2>
          <p className="mt-4 text-lg leading-6 text-primary-200">
            Create your account and start building your knowledge with our interactive quiz platform.
          </p>
          {!isAuthenticated && (
            <Link
              to="/register"
              className="mt-8 w-full inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-primary-600 bg-white hover:bg-gray-50 sm:w-auto"
            >
              Get started for free
            </Link>
          )}
        </div>
      </div>
    </div>
  );
};

export default Home;

