import { useState, useEffect } from 'react';
import api from '../services/api';
import { 
  BuildingOfficeIcon, 
  UserGroupIcon, 
  BriefcaseIcon, 
  DocumentCheckIcon,
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon
} from '@heroicons/react/24/outline';

export default function Dashboard() {
  const [stats, setStats] = useState({
    departments: 0,
    staff: 0,
    posts: 0,
    activeRecruitment: 0,
    pendingRecruitment: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const [depts, staff, posts, recruitment] = await Promise.all([
        api.get('/department'),
        api.get('/staff'),
        api.get('/post'),
        api.get('/recruitment')
      ]);

      const activeRec = recruitment.data.filter(r => r.status === 'active').length;
      const pendingRec = recruitment.data.filter(r => r.status === 'pending').length;

      setStats({
        departments: depts.data.length,
        staff: staff.data.length,
        posts: posts.data.length,
        activeRecruitment: activeRec,
        pendingRecruitment: pendingRec
      });
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="loading loading-spinner loading-lg"></div>;

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <StatCard 
          icon={<BuildingOfficeIcon className="h-8 w-8" />}
          title="Departments"
          value={stats.departments}
          trend="up"
          trendValue="5%"
        />
        <StatCard 
          icon={<UserGroupIcon className="h-8 w-8" />}
          title="Staff"
          value={stats.staff}
          trend="up"
          trendValue="10%"
        />
        <StatCard 
          icon={<BriefcaseIcon className="h-8 w-8" />}
          title="Positions"
          value={stats.posts}
          trend="neutral"
        />
        <StatCard 
          icon={<DocumentCheckIcon className="h-8 w-8" />}
          title="Active"
          value={stats.activeRecruitment}
          trend="up"
          trendValue="3%"
        />
        <StatCard 
          icon={<DocumentCheckIcon className="h-8 w-8" />}
          title="Pending"
          value={stats.pendingRecruitment}
          trend="down"
          trendValue="2%"
        />
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="card bg-base-100 shadow">
          <div className="card-body">
            <h2 className="card-title">Recent Hires</h2>
            <p>Coming soon...</p>
          </div>
        </div>
        <div className="card bg-base-100 shadow">
          <div className="card-body">
            <h2 className="card-title">Department Distribution</h2>
            <p>Coming soon...</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({ icon, title, value, trend, trendValue }) {
  return (
    <div className="card bg-base-100 shadow">
      <div className="card-body">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="p-2 rounded-full bg-primary bg-opacity-20 text-primary">
              {icon}
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500">{title}</h3>
              <p className="text-2xl font-bold">{value}</p>
            </div>
          </div>
          {trend && (
            <div className={`badge ${trend === 'up' ? 'badge-success' : trend === 'down' ? 'badge-error' : 'badge-info'}`}>
              {trend === 'up' ? (
                <ArrowTrendingUpIcon className="h-4 w-4 mr-1" />
              ) : trend === 'down' ? (
                <ArrowTrendingDownIcon className="h-4 w-4 mr-1" />
              ) : null}
              {trendValue}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}