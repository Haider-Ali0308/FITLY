import React from "react";
import { Link, useLocation } from "react-router-dom";
import Spline from "@splinetool/react-spline";

const Home = () => {
  const location = useLocation();

  return (
    <div className="bg-white min-h-screen flex flex-col">
      {/* Hero Banner Section */}
      <div 
        className="p-6 md:p-12 rounded-b-3xl shadow-lg"
        style={{
          background: "linear-gradient(135deg, #4F46E5 0%, #7C3AED 100%)",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        {/* Navigation Header */}
        <div className="flex justify-between items-center max-w-7xl mx-auto w-full">
          <div className="flex items-center">
            <span className="text-white font-bold text-3xl lg:text-5xl">
              FITLY
            </span>
            <span
              className="text-white font-bold text-3xl lg:text-5xl ml-2"
              style={{ animation: "pulse 2s infinite" }}
            >
              AI
            </span>
          </div>

          <div className="flex flex-row space-x-3">
            <Link to="/pages/login">
              <button className="bg-white text-indigo-600 py-2 px-6 rounded-full font-semibold hover:bg-gray-100 transition duration-300">
                Login
              </button>
            </Link>
            <Link to="/pages/register">
              <button className="bg-indigo-700 text-white py-2 px-6 rounded-full font-semibold hover:bg-indigo-800 transition duration-300 border border-indigo-400">
                Register
              </button>
            </Link>
          </div>
        </div>

        {/* Hero Content */}
        <div className="flex flex-col md:flex-row items-center max-w-7xl mx-auto mt-8 md:mt-12">
          <div className="w-full md:w-1/2 mb-8 md:mb-0">
            <h1 className="font-bold text-white text-4xl lg:text-5xl leading-tight">
              Achieve your fitness dreams with AI-powered guidance
            </h1>
            <p className="text-indigo-100 mt-4 text-lg max-w-lg">
              Personalized workouts, nutrition plans, and real-time coaching to help you reach your goals faster and more effectively.
            </p>
            <div className="mt-8">
              <Link to="/pages/register">
                <button className="bg-white text-indigo-600 py-3 px-8 rounded-full font-bold text-lg hover:bg-gray-100 transition duration-300 shadow-lg">
                  Start Your Journey
                </button>
              </Link>
            </div>
          </div>
          <div className="w-full md:w-1/2 h-64 md:h-96">
            <Spline scene="/scene.splinecode" />
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="max-w-7xl mx-auto px-6 py-16 w-full">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800">
            The Tools for Your Goals
          </h2>
          <p className="text-gray-600 mt-4 max-w-2xl mx-auto text-lg">
            Trying to lose weight, tone up, lower your BMI, or invest in your overall health? 
            We give you the right features to get there.
          </p>
        </div>

        {/* Feature Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100 hover:shadow-xl transition duration-300">
            <div className="bg-indigo-100 rounded-full w-16 h-16 flex items-center justify-center mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">
              Learn. Track. Improve.
            </h3>
            <p className="text-gray-600">
              Keeping a food diary helps you understand your habits and hit your goals.
              Our AI analyzes your patterns to provide personalized suggestions.
            </p>
          </div>
          
          <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100 hover:shadow-xl transition duration-300">
            <div className="bg-indigo-100 rounded-full w-16 h-16 flex items-center justify-center mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">
              Logging Simplified.
            </h3>
            <p className="text-gray-600">
              Save meals and use Quick Tools for fast and easy food tracking.
              Our smart recognition makes logging your meals a breeze.
            </p>
          </div>
          
          <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100 hover:shadow-xl transition duration-300">
            <div className="bg-indigo-100 rounded-full w-16 h-16 flex items-center justify-center mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">
              Stay Motivated.
            </h3>
            <p className="text-gray-600">
              Join the World's Largest Fitness Community for advice, tips, and
              support 24/7. Connect with others on similar journeys.
            </p>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-gray-50 py-16">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 items-center gap-12">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 leading-tight">
              Start your fitness journey today!
            </h2>
            <p className="text-gray-600 mt-4 text-lg">
              Sign up for FITLY AI and get started on your path to a healthier lifestyle. 
              Our AI-powered platform adapts to your needs, providing personalized guidance 
              every step of the way.
            </p>
            <div className="mt-8">
              <Link to="/pages/register">
                <button className="bg-indigo-600 text-white py-3 px-8 rounded-full font-bold text-lg hover:bg-indigo-700 transition duration-300 shadow-md">
                  Get Started Free
                </button>
              </Link>
              <Link to="/pages/features">
                <button className="ml-4 text-indigo-600 py-3 px-8 rounded-full font-bold text-lg hover:text-indigo-700 transition duration-300">
                  Learn More
                </button>
              </Link>
            </div>
          </div>
          <div className="flex justify-center">
            <img
              src="/fitness-stats.png"
              alt="Fitness Statistics"
              className="w-full max-w-md rounded-lg shadow-xl"
            />
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 py-12">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center">
                <span className="text-indigo-600 font-bold text-2xl">FITLY</span>
                <span className="text-indigo-600 font-bold text-2xl ml-1">AI</span>
              </div>
              <p className="text-gray-600 mt-4">
                Transforming fitness through artificial intelligence.
              </p>
            </div>
            
            <div>
              <h3 className="font-semibold text-gray-800 mb-4">Product</h3>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-600 hover:text-indigo-600">Features</a></li>
                <li><a href="#" className="text-gray-600 hover:text-indigo-600">Pricing</a></li>
                <li><a href="#" className="text-gray-600 hover:text-indigo-600">Testimonials</a></li>
                <li><a href="#" className="text-gray-600 hover:text-indigo-600">FAQ</a></li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold text-gray-800 mb-4">Company</h3>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-600 hover:text-indigo-600">About</a></li>
                <li><a href="#" className="text-gray-600 hover:text-indigo-600">Blog</a></li>
                <li><a href="#" className="text-gray-600 hover:text-indigo-600">Careers</a></li>
                <li><a href="#" className="text-gray-600 hover:text-indigo-600">Contact</a></li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold text-gray-800 mb-4">Legal</h3>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-600 hover:text-indigo-600">Privacy Policy</a></li>
                <li><a href="#" className="text-gray-600 hover:text-indigo-600">Terms of Service</a></li>
                <li><a href="#" className="text-gray-600 hover:text-indigo-600">Cookie Policy</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-200 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-600">© 2025 FITLY AI. All rights reserved.</p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <a href="#" className="text-gray-500 hover:text-indigo-600">
                <span className="sr-only">Facebook</span>
                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                  <path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd" />
                </svg>
              </a>
              <a href="#" className="text-gray-500 hover:text-indigo-600">
                <span className="sr-only">Instagram</span>
                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                  <path fillRule="evenodd" d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z" clipRule="evenodd" />
                </svg>
              </a>
              <a href="#" className="text-gray-500 hover:text-indigo-600">
                <span className="sr-only">Twitter</span>
                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                </svg>
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;