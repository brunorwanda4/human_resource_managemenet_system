import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import DataTable from '../components/DataTable';
import { BriefcaseIcon, PencilSquareIcon, TrashIcon, PlusIcon } from '@heroicons/react/24/outline';
import { Routes, Route } from 'react-router-dom';
import PostForm from '../components/PostForm';

export default function Posts() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      setLoading(true);
      const response = await api.get('/post');
      setPosts(response.data);
      setError('');
    } catch (error) {
      setError('Failed to fetch posts');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this post?')) return;
    
    try {
      await api.delete(`/post/${id}`);
      fetchPosts();
    } catch (error) {
      console.error(error);
      alert('Failed to delete post');
    }
  };

  const columns = [
    {
      Header: 'ID',
      accessor: 'postId',
    },
    {
      Header: 'Title',
      accessor: 'postTitle',
    },
    {
      Header: 'Actions',
      accessor: 'actions',
      Cell: ({ row }) => (
        <div className="flex space-x-2">
          <Link 
            to={`/posts/edit/${row.original.postId}`}
            className="btn btn-sm btn-ghost"
          >
            <PencilSquareIcon className="h-4 w-4" />
          </Link>
          <button
            onClick={() => handleDelete(row.original.postId)}
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
        <BriefcaseIcon className="h-6 w-6 mr-2" />
        Posts
      </h1>
      <Link to="/posts/new" className="btn btn-primary">
        <PlusIcon className="h-5 w-5 mr-1" />
        Add Post
      </Link>
    </div>
    
    <Routes>
      <Route path="/" element={
        <div className="card bg-base-100 shadow">
          <div className="card-body p-0">
            <DataTable 
              columns={columns} 
              data={posts} 
              className="w-full"
            />
          </div>
        </div>
      } />
      <Route path="/new" element={<PostForm />} />
      <Route path="/edit/:id" element={<PostForm />} />
    </Routes>
  </div>
);
}