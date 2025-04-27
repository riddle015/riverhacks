import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-gray-100 border-t py-8 mt-auto">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Company Information */}
          <div>
            <h3 className="font-bold text-lg mb-4">Safety Spotlight</h3>
            <p className="text-gray-600 mb-4">
              Helping communities stay safe by providing an easy way to report and track safety issues.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-600 hover:text-gray-900">
                <span className="material-icons">facebook</span>
              </a>
              <a href="#" className="text-gray-600 hover:text-gray-900">
                <span className="material-icons">twitter</span>
              </a>
              <a href="#" className="text-gray-600 hover:text-gray-900">
                <span className="material-icons">instagram</span>
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-bold text-lg mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/about" className="text-gray-600 hover:text-gray-900">About Us</Link>
              </li>
              <li>
                <Link to="/faq" className="text-gray-600 hover:text-gray-900">FAQ</Link>
              </li>
              <li>
                <Link to="/news" className="text-safety-blue font-medium hover:underline">
                  Austin News
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-gray-600 hover:text-gray-900">Contact</Link>
              </li>
              <li>
                <Link to="/privacy" className="text-gray-600 hover:text-gray-900">Privacy Policy</Link>
              </li>
              <li>
                <Link to="/terms" className="text-gray-600 hover:text-gray-900">Terms of Service</Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="font-bold text-lg mb-4">Contact Us</h3>
            <address className="not-italic">
              <p className="text-gray-600 mb-2">1234 Safety Street</p>
              <p className="text-gray-600 mb-2">Anytown, USA 12345</p>
              <p className="text-gray-600 mb-2">
                <span className="material-icons inline-block align-text-bottom mr-1">email</span>
                <a href="mailto:info@safetyspotlight.com" className="hover:text-gray-900">info@safetyspotlight.com</a>
              </p>
              <p className="text-gray-600">
                <span className="material-icons inline-block align-text-bottom mr-1">phone</span>
                <a href="tel:+11234567890" className="hover:text-gray-900">(123) 456-7890</a>
              </p>
            </address>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-gray-200 mt-8 pt-6 text-center text-gray-500 text-sm">
          <p>&copy; {new Date().getFullYear()} Safety Spotlight. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;