import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import { PencilSquareIcon, CheckIcon, XMarkIcon } from '@heroicons/react/24/outline';

export default function Profile() {
  const { user } = useAuth();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({
    phone: '',
    address: ''
  });
  const [error, setError] = useState('');

  useEffect(() => {
    if (user) {
      fetchProfile();
    }
  }, [user]);

  const fetchProfile = async () => {
    try {
      const response = await api.get('/user/profile');
      setProfile(response.data);
      setFormData({
        phone: response.data.phone,
        address: response.data.address
      });
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleEditToggle = () => {
    setEditMode(!editMode);
    if (editMode) {
      // Reset form data when canceling edit
      setFormData({
        phone: profile.phone,
        address: profile.address
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await api.put(`/staff/${profile.employeeId}`, formData);
      setProfile({
        ...profile,
        phone: response.data.phone,
        address: response.data.address
      });
      setEditMode(false);
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to update profile');
      console.error(error);
    }
  };

  if (loading) return <div className="loading loading-spinner loading-lg"></div>;
  if (!profile) return <div className="alert alert-error">Profile not found</div>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">My Profile</h1>
        <button 
          onClick={handleEditToggle}
          className="btn btn-sm btn-outline"
        >
          {editMode ? (
            <>
              <XMarkIcon className="h-4 w-4 mr-1" />
              Cancel
            </>
          ) : (
            <>
              <PencilSquareIcon className="h-4 w-4 mr-1" />
              Edit Profile
            </>
          )}
        </button>
      </div>
      
      <div className="card bg-base-100 shadow">
        <div className="card-body">
          <div className="flex flex-col md:flex-row items-start md:items-center space-y-4 md:space-y-0 md:space-x-6">
            <div className="avatar">
              <div className="w-24 rounded-full">
                <img 
                  src={`https://ui-avatars.com/api/?name=${profile.firstName}+${profile.lastName}&background=random`} 
                  alt="Profile" 
                />
              </div>
            </div>
            
            <div className="space-y-2 flex-1">
              <h2 className="text-xl font-bold">{profile.firstName} {profile.lastName}</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p><span className="font-semibold">Email:</span> {profile.email}</p>
                  <p>
                    <span className="font-semibold">Gender:</span> {profile.gender}
                  </p>
                  <p>
                    <span className="font-semibold">Date of Birth:</span> {new Date(profile.DOB).toLocaleDateString()}
                  </p>
                </div>
                <div>
                  <p><span className="font-semibold">Department:</span> {profile.depName}</p>
                  <p><span className="font-semibold">Position:</span> {profile.postTitle}</p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="divider"></div>
          
          {error && (
            <div className="alert alert-error">
              <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>{error}</span>
            </div>
          )}
          
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="form-control">
                <label className="label">
                  <span className="label-text">Phone</span>
                </label>
                {editMode ? (
                  <input
                    type="tel"
                    className="input input-bordered"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    required
                  />
                ) : (
                  <p>{profile.phone}</p>
                )}
              </div>
              
              <div className="form-control">
                <label className="label">
                  <span className="label-text">Address</span>
                </label>
                {editMode ? (
                  <textarea
                    className="textarea textarea-bordered"
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    required
                  />
                ) : (
                  <p>{profile.address}</p>
                )}
              </div>
            </div>
            
            {editMode && (
              <div className="flex justify-end mt-4 space-x-2">
                <button
                  type="submit"
                  className="btn btn-primary"
                >
                  <CheckIcon className="h-4 w-4 mr-1" />
                  Save Changes
                </button>
              </div>
            )}
          </form>
          
          <div className="divider"></div>
          
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Employment Details</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p><span className="font-semibold">Employee ID:</span> {profile.employeeId}</p>
                <p>
                  <span className="font-semibold">Hire Date:</span> 
                  {profile.hireDate ? new Date(profile.hireDate).toLocaleDateString() : 'N/A'}
                </p>
              </div>
              <div>
                <p>
                  <span className="font-semibold">Status:</span> 
                  <span className={`badge ml-2 ${profile.status === 'active' ? 'badge-success' : profile.status === 'pending' ? 'badge-warning' : 'badge-error'}`}>
                    {profile.status}
                  </span>
                </p>
                <p>
                  <span className="font-semibold">Salary:</span> 
                  {profile.salary ? `$${profile.salary.toLocaleString()}` : 'N/A'}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}