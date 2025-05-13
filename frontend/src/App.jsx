import { Routes, Route } from "react-router-dom";
import PrivateRoute from "./components/PrivateRoute";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Departments from "./pages/Departments";
import Staff from "./pages/Staff";
import Posts from "./pages/Posts";
import Recruitment from "./pages/Recruitment";
import Profile from "./pages/Profile";
import NotFound from "./pages/NotFound";
import Layout from "./components/Layout";

function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />

      {/* All protected routes */}
      <Route element={<Layout />}>
        {/* <Route element={<PrivateRoute />}> */}
        <Route path="/" element={<Dashboard />} />
        <Route path="/departments/*" element={<Departments />} />
        <Route path="/staff/*" element={<Staff />} />
        <Route path="/posts/*" element={<Posts />} />
        <Route path="/recruitment/*" element={<Recruitment />} />
        <Route path="/profile" element={<Profile />} />
        {/* </Route> */}
      </Route>

      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default App;
