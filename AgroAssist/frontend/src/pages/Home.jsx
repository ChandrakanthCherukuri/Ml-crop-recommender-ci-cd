import { Link } from 'react-router-dom';
import { Sprout, TrendingUp, Users, Brain } from 'lucide-react';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-primary-100">
      <nav className="bg-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <Sprout className="h-8 w-8 text-primary-600" />
              <span className="ml-2 text-xl font-bold text-gray-900">AgroAssist</span>
            </div>
            <div className="flex items-center space-x-4">
              <Link
                to="/login"
                className="text-gray-700 hover:text-primary-600 font-medium"
              >
                Login
              </Link>
              <Link
                to="/register"
                className="bg-primary-600 hover:bg-primary-700 text-white font-medium py-2 px-4 rounded-lg transition-colors"
              >
                Get Started
              </Link>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold text-gray-900 mb-4">
            Smart Agriculture Management
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Empowering farmers with AI-driven insights for better crop management
            and disease detection
          </p>
          <div className="mt-8 flex justify-center space-x-4">
            <Link
              to="/register"
              className="bg-primary-600 hover:bg-primary-700 text-white font-bold py-3 px-8 rounded-lg transition-colors text-lg"
            >
              Start Free Trial
            </Link>
            <Link
              to="/login"
              className="bg-white hover:bg-gray-50 text-primary-600 font-bold py-3 px-8 rounded-lg border-2 border-primary-600 transition-colors text-lg"
            >
              Sign In
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mt-16">
          <div className="bg-white rounded-lg p-6 shadow-md">
            <div className="bg-primary-100 rounded-full p-3 w-12 h-12 flex items-center justify-center mb-4">
              <TrendingUp className="h-6 w-6 text-primary-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Sensor Data Tracking
            </h3>
            <p className="text-gray-600">
              Monitor NPK levels, temperature, humidity, pH, and rainfall in real-time
            </p>
          </div>

          <div className="bg-white rounded-lg p-6 shadow-md">
            <div className="bg-purple-100 rounded-full p-3 w-12 h-12 flex items-center justify-center mb-4">
              <Brain className="h-6 w-6 text-purple-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              AI Crop Recommendations
            </h3>
            <p className="text-gray-600">
              Get intelligent crop suggestions based on soil and weather conditions
            </p>
          </div>

          <div className="bg-white rounded-lg p-6 shadow-md">
            <div className="bg-green-100 rounded-full p-3 w-12 h-12 flex items-center justify-center mb-4">
              <Sprout className="h-6 w-6 text-green-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Disease Detection
            </h3>
            <p className="text-gray-600">
              Upload plant images for instant AI-powered disease identification
            </p>
          </div>

          <div className="bg-white rounded-lg p-6 shadow-md">
            <div className="bg-blue-100 rounded-full p-3 w-12 h-12 flex items-center justify-center mb-4">
              <Users className="h-6 w-6 text-blue-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Expert Support
            </h3>
            <p className="text-gray-600">
              Connect with agronomists for personalized farm management advice
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
