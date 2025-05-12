import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import DataTable from '../components/DataTable';
import { BuildingOfficeIcon, PencilSquareIcon, TrashIcon, PlusIcon } from '@heroicons/react/24/outline';
import { Routes, Route } from 'react-router-dom';
import DepartmentForm from '../components/DepartmentForm';

export default function Departments() {
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchDepartments();
  }, []);

  const fetchDepartments = async () => {
    try {
      setLoading(true);
      const response = await api.get('/department');
      setDepartments(response.data);
      setError('');
    } catch (error) {
      setError('Failed to fetch departments');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this department?')) return;
    
    try {
      await api.delete(`/department/${id}`);
      fetchDepartments();
    } catch (error) {
      console.error(error);
      alert('Failed to delete department');
    }
  };

  const columns = [
    {
      Header: 'ID',
      accessor: 'depId',
    },
    {
      Header: 'Department Name',
      accessor: 'depName',
    },
    {
      Header: 'Actions',
      accessor: 'actions',
      Cell: ({ row }) => (
        <div className="flex space-x-2">
          <Link 
            to={`/departments/edit/${row.original.depId}`}
            className="btn btn-sm btn-ghost"
          >
            <PencilSquareIcon className="h-4 w-4" />
          </Link>
          <button
            onClick={() => handleDelete(row.original.depId)}
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
        <BuildingOfficeIcon className="h-6 w-6 mr-2" />
        Departments
      </h1>
      <Link to="/departments/new" className="btn btn-primary">
        <PlusIcon className="h-5 w-5 mr-1" />
        Add Department
      </Link>
    </div>
    
    <Routes>
      <Route path="/" element={
        <div className="card bg-base-100 shadow">
          <div className="card-body p-0">
            <DataTable 
              columns={columns} 
              data={departments} 
              className="w-full"
            />
          </div>
        </div>
      } />
      <Route path="/new" element={<DepartmentForm />} />
      <Route path="/edit/:id" element={<DepartmentForm />} />
    </Routes>
  </div>
)
}