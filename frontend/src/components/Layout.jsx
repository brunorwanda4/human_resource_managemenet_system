import { Link, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { HomeIcon, BuildingOfficeIcon, UserGroupIcon, BriefcaseIcon, DocumentCheckIcon, UserIcon } from '@heroicons/react/24/outline';

export default function Layout() {
  const auth = useAuth();
  const user = auth?.user; // Safe access to user
  const logout = auth?.logout;

   if (!auth) {
    return null; // Or a loading spinner
  }
  if (!user) return null;

  const navigation = [
    { name: 'Dashboard', href: '/', icon: HomeIcon },
    { name: 'Departments', href: '/departments', icon: BuildingOfficeIcon },
    { name: 'Staff', href: '/staff', icon: UserGroupIcon },
    { name: 'Posts', href: '/posts', icon: BriefcaseIcon },
    { name: 'Recruitment', href: '/recruitment', icon: DocumentCheckIcon },
  ];

  return (
    <div className="drawer lg:drawer-open">
      <input id="my-drawer" type="checkbox" className="drawer-toggle" />
      
      <div className="drawer-content flex flex-col">
        {/* Navbar */}
        <div className="navbar bg-base-100 shadow-sm lg:hidden">
          <div className="flex-none">
            <label htmlFor="my-drawer" className="btn btn-square btn-ghost">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="inline-block w-5 h-5 stroke-current">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path>
              </svg>
            </label>
          </div>
          <div className="flex-1">
            <a className="btn btn-ghost normal-case text-xl">HRMS</a>
          </div>
        </div>
        
        {/* Main content */}
        <main className="flex-1 p-4">
          <Outlet />
        </main>
      </div>
      
      {/* Sidebar */}
      <div className="drawer-side">
        <label htmlFor="my-drawer" className="drawer-overlay"></label>
        <div className="menu p-4 w-80 h-full bg-base-200 text-base-content">
          <div className="mb-4 flex items-center space-x-2">
            <div className="avatar">
              <div className="w-12 rounded-full">
                <img src={`https://ui-avatars.com/api/?name=${user.name}&background=random`} alt="User" />
              </div>
            </div>
            <div>
              <div className="font-bold">{user.name}</div>
              <div className="text-sm opacity-50">{user.email}</div>
            </div>
          </div>
          
          <ul className="space-y-1">
            {navigation.map((item) => (
              <li key={item.name}>
                <Link to={item.href} className="flex items-center">
                  <item.icon className="h-5 w-5" />
                  {item.name}
                </Link>
              </li>
            ))}
          </ul>
          
          <div className="mt-auto">
            <div className="divider"></div>
            <ul>
              <li>
                <Link to="/profile" className="flex items-center">
                  <UserIcon className="h-5 w-5" />
                  Profile
                </Link>
              </li>
              <li>
                <button onClick={logout} className="flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                  </svg>
                  Logout
                </button>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}