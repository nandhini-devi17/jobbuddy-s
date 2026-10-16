import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const location = useLocation();

  const handleLogout = () => {
    logout();
  };

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="navbar">
      <div className="container">
        <div className="navbar-content">
          <Link to="/" className="logo">
            JobBuddy
          </Link>
          
          <ul className="nav-links">
            <li>
              <Link to="/" className={isActive('/') ? 'active' : ''}>
                Home
              </Link>
            </li>
            <li>
              <Link to="/jobs" className={isActive('/jobs') ? 'active' : ''}>
                Jobs
              </Link>
            </li>

            {isAuthenticated ? (
              <>
                <li>
                  <Link 
                    to={user.role === 'employer' ? '/dashboard/employer' : '/dashboard/seeker'} 
                    className={isActive('/dashboard') ? 'active' : ''}
                  >
                    Dashboard
                  </Link>
                </li>
                
                {user.role === 'seeker' && (
                  <li>
                    <Link 
                      to="/resume-builder" 
                      className={isActive('/resume-builder') ? 'active' : ''}
                    >
                      Resume Builder
                    </Link>
                  </li>
                )}
                
                {user.role === 'employer' && (
                  <li>
                    <Link 
                      to="/post-job" 
                      className={isActive('/post-job') ? 'active' : ''}
                    >
                      Post Job
                    </Link>
                  </li>
                )}

                <li>
                  <Link 
                    to="/applications" 
                    className={isActive('/applications') ? 'active' : ''}
                  >
                    Applications
                  </Link>
                </li>

                <li>
                  <span className="user-welcome">Hello, {user.name}</span>
                </li>
                
                <li>
                  <button onClick={handleLogout} className="btn btn-secondary">
                    Logout
                  </button>
                </li>
              </>
            ) : (
              <>
                <li>
                  <Link to="/login" className="btn btn-secondary">
                    Login
                  </Link>
                </li>
                <li>
                  <Link to="/register" className="btn btn-primary">
                    Register
                  </Link>
                </li>
              </>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;