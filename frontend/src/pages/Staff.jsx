import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import DataTable from '../components/DataTable';
import { UserGroupIcon, PencilSquareIcon, TrashIcon, PlusIcon } from '@heroicons/react/24/outline';
import { Routes, Route } from 'react-router-dom';
import StaffForm from '../components/StaffForm';

export default function Staff() {
  const [staff, setStaff] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchStaff();
  }, []);

  const fetchStaff = async () => {
    try {
      setLoading(true);
      const response = await api.get('/staff');
      setStaff(response.data);
      setError('');
    } catch (error) {
      setError('Failed to fetch staff');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this staff member?')) return;
    
    try {
      await api.delete(`/staff/${id}`);
      fetchStaff();
    } catch (error) {
      console.error(error);
      alert('Failed to delete staff member');
    }
  };

  const columns = [
    {
      Header: 'ID',
      accessor: 'employeeId',
    },
    {
      Header: 'Name',
      accessor: 'firstName',
      Cell: ({ row }) => `${row.original.firstName} ${row.original.lastName}`,
    },
    {
      Header: 'Department',
      accessor: 'depName',
    },
    {
      Header: 'Position',
      accessor: 'postTitle',
    },
    {
      Header: 'Email',
      accessor: 'email',
    },
    {
      Header: 'Actions',
      accessor: 'actions',
      Cell: ({ row }) => (
        <div className="flex space-x-2">
          <Link 
            to={`/staff/edit/${row.original.employeeId}`}
            className="btn btn-sm btn-ghost"
          >
            <PencilSquareIcon className="h-4 w-4" />
          </Link>
          <button
            onClick={() => handleDelete(row.original.employeeId)}
            className="btn btn-sm btn-ghost text-error"
          >
            <TrashIcon className="h-4 w-4" />
          </button>
        </div>
      ),
    },
  ];

  if (loading) return <div className="loading loading-spinner loading-lg"></div>;
  if (error) return <div className="alert alert-error">{error}</div>;

  return (
  <div className="space-y-4">
    <div className="flex justify-between items-center">
      <h1 className="text-2xl font-bold flex items-center">
        <UserGroupIcon className="h-6 w-6 mr-2" />
        Staff
      </h1>
      <Link to="/staff/new" className="btn btn-primary">
        <PlusIcon className="h-5 w-5 mr-1" />
        Add Staff
      </Link>
    </div>
    
    <Routes>
      <Route path="/" element={
        <div className="card bg-base-100 shadow">
          <div className="card-body p-0">
            <DataTable 
              columns={columns} 
              data={staff} 
              className="w-full"
            />
          </div>
        </div>
      } />
      <Route path="/new" element={<StaffForm />} />
      <Route path="/edit/:id" element={<StaffForm />} />
    </Routes>
  </div>
);
}