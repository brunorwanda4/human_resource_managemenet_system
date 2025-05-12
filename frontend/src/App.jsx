import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import PrivateRoute from './components/PrivateRoute';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Departments from './pages/Departments';
import Staff from './pages/Staff';
import Posts from './pages/Posts';
import Recruitment from './pages/Recruitment';
import Profile from './pages/Profile';
import Layout from './components/Layout';
import NotFound from './pages/NotFound';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        
        {/* All protected routes */}
        <Route element={<Layout />}>
          <Route path="/" element={
            <PrivateRoute>
              <Dashboard />
            </PrivateRoute>
          } />
          
          <Route path="/departments/*" element={
            <PrivateRoute>
              <Departments />
            </PrivateRoute>
          } />
          
          <Route path="/staff/*" element={
            <PrivateRoute>
              <Staff />
            </PrivateRoute>
          } />
          
          <Route path="/posts/*" element={
            <PrivateRoute>
              <Posts />
            </PrivateRoute>
          } />
          
          <Route path="/recruitment/*" element={
            <PrivateRoute>
              <Recruitment />
            </PrivateRoute>
          } />
          
          <Route path="/profile" element={
            <PrivateRoute>
              <Profile />
            </PrivateRoute>
          } />
        </Route>
        
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
}

export default App;
