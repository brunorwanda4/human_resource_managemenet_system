import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import PrivateRoute from './components/PrivateRoute';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Departments from './pages/Departments';
import Staff from './pages/Staff';
import Posts from './pages/Posts';
import Recruitment from './pages/Recruitment';
import Profile from './pages/Profile';
import Layout from './components/Layout';

function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route element={<Layout />}>
            <Route path="/" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
            <Route path="/departments" element={<PrivateRoute><Departments /></PrivateRoute>} />
            <Route path="/staff" element={<PrivateRoute><Staff /></PrivateRoute>} />
            <Route path="/posts" element={<PrivateRoute><Posts /></PrivateRoute>} />
            <Route path="/recruitment" element={<PrivateRoute><Recruitment /></PrivateRoute>} />
            <Route path="/profile" element={<PrivateRoute><Profile /></PrivateRoute>} />
          </Route>
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;