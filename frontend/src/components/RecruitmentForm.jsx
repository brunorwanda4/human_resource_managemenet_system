import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../services/api';

export default function RecruitmentForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    employeeId: '',
    salary: '',
    status: 'pending'
  });
  const [staff, setStaff] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchStaff();
    if (id) {
      fetchRecruitment();
    }
  }, [id]);

  const fetchStaff = async () => {
    try {
      const response = await api.get('/staff');
      setStaff(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  const fetchRecruitment = async () => {
    try {
      const response = await api.get(`/recruitment/${id}`);
      setFormData({
        employeeId: response.data.employeeId,
        salary: response.data.salary,
        status: response.data.status
      });
    } catch (error) {
      setError('Failed to fetch recruitment record');
      console.error(error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      if (id) {
        await api.put(`/recruitment/${id}`, formData);
      } else {
        await api.post('/recruitment', formData);
      }
      navigate('/recruitment');
    } catch (error) {
      setError(error.response?.data?.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card bg-base-100 shadow">
      <div className="card-body">
        <h2 className="card-title">{id ? 'Edit' : 'Add'} Recruitment Record</h2>
        
        {error && (
          <div className="alert alert-error">
            <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="form-control">
            <label className="label">
              <span className="label-text">Employee</span>
            </label>
            <select
              className="select select-bordered"
              name="employeeId"
              value={formData.employeeId}
              onChange={handleChange}
              required
              disabled={!!id}
            >
              <option value="">Select Employee</option>
              {staff.map(employee => (
                <option key={employee.employeeId} value={employee.employeeId}>
                  {employee.firstName} {employee.lastName} ({employee.depName})
                </option>
              ))}
            </select>
          </div>

          <div className="form-control">
            <label className="label">
              <span className="label-text">Salary</span>
            </label>
            <input
              type="number"
              className="input input-bordered"
              name="salary"
              value={formData.salary}
              onChange={handleChange}
              required
              min="0"
              step="0.01"
            />
          </div>

          <div className="form-control">
            <label className="label">
              <span className="label-text">Status</span>
            </label>
            <select
              className="select select-bordered"
              name="status"
              value={formData.status}
              onChange={handleChange}
              required
            >
              <option value="pending">Pending</option>
              <option value="active">Active</option>
              <option value="terminated">Terminated</option>
            </select>
          </div>

          <div className="card-actions justify-end mt-4">
            <button
              type="button"
              className="btn btn-ghost"
              onClick={() => navigate('/recruitment')}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={loading}
            >
              {loading ? (
                <span className="loading loading-spinner"></span>
              ) : id ? 'Update' : 'Save'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}