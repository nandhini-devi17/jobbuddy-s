import React from 'react';
import { Link } from 'react-router-dom';

const VerifyEmail = () => {
  return (
    <div className="container">
      <div className="form-container card">
        <div className="text-center">
          <h2>Email Verification</h2>
          <div className="alert alert-success mt-2">
            Email verification is not required for this demo. You can login directly after registration!
          </div>
          <Link to="/login" className="btn btn-primary mt-2">
            Go to Login
          </Link>
        </div>
      </div>
    </div>
  );
};

export default VerifyEmail;