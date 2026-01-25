import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../../utils/axiosInstance';

const UserProfile = () => {
  const [profile, setProfile] = useState({
    name: '',
    email: '',
    mobile: '',
    role: ''
  });
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const response = await axiosInstance.get('/user/profile');
      setProfile(response.data);
    } catch (err) {
      setError('Failed to load profile');
    }
  };

  const handleChange = (e) => {
    setProfile({
      ...profile,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await axiosInstance.put('/user/profile', {
        name: profile.name,
        mobile: profile.mobile
      });

      setProfile(response.data);
      setIsEditing(false);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-6">
          <div className="card shadow">
            <div className="card-body">
              <h2 className="card-title text-center mb-4">My Profile</h2>
              {error && <div className="alert alert-danger">{error}</div>}

              {isEditing ? (
                <form onSubmit={handleSubmit}>
                  <div className="mb-3">
                    <label htmlFor="name" className="form-label">Name</label>
                    <input
                      type="text"
                      className="form-control"
                      id="name"
                      name="name"
                      value={profile.name}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="email" className="form-label">Email</label>
                    <input
                      type="email"
                      className="form-control"
                      id="email"
                      value={profile.email}
                      readOnly
                    />
                    <small className="text-muted">Email cannot be changed</small>
                  </div>
                  <div className="mb-3">
                    <label htmlFor="mobile" className="form-label">Mobile</label>
                    <input
                      type="tel"
                      className="form-control"
                      id="mobile"
                      name="mobile"
                      value={profile.mobile}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Role</label>
                    <input
                      type="text"
                      className="form-control"
                      value={profile.role}
                      readOnly
                    />
                  </div>
                  <div className="d-flex gap-2">
                    <button type="submit" className="btn btn-primary" disabled={loading}>
                      {loading ? 'Saving...' : 'Save Changes'}
                    </button>
                    <button
                      type="button"
                      className="btn btn-secondary"
                      onClick={() => setIsEditing(false)}
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              ) : (
                <div>
                  <div className="mb-3">
                    <label className="form-label fw-bold">Name:</label>
                    <p className="mb-1">{profile.name}</p>
                  </div>
                  <div className="mb-3">
                    <label className="form-label fw-bold">Email:</label>
                    <p className="mb-1">{profile.email}</p>
                  </div>
                  <div className="mb-3">
                    <label className="form-label fw-bold">Mobile:</label>
                    <p className="mb-1">{profile.mobile}</p>
                  </div>
                  <div className="mb-3">
                    <label className="form-label fw-bold">Role:</label>
                    <p className="mb-1">{profile.role}</p>
                  </div>
                  <button
                    className="btn btn-primary"
                    onClick={() => setIsEditing(true)}
                  >
                    Edit Profile
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;