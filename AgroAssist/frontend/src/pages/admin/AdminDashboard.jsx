import { useState, useEffect } from 'react';
import Layout from '../../components/Layout';
import { Card } from '../../components/ui/Card';
import api from '../../utils/api';
import { Users, UserCog, Database, Activity } from 'lucide-react';
import toast from 'react-hot-toast';

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    totalUsers: 0,
    farmers: 0,
    agronomists: 0,
    assignments: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const [usersRes, assignmentsRes] = await Promise.all([
        api.get('/auth/users'),
        api.get('/assign'),
      ]);

      const users = usersRes.data.data || [];
      const farmers = users.filter(u => u.role === 'farmer').length;
      const agronomists = users.filter(u => u.role === 'agronomist').length;

      setStats({
        totalUsers: users.length,
        farmers,
        agronomists,
        assignments: assignmentsRes.data.data?.length || 0,
      });
    } catch (error) {
      toast.error('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const StatCard = ({ title, value, icon: Icon, color }) => (
    <Card className="border-l-4" style={{ borderLeftColor: color }}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-600 mb-1">{title}</p>
          <p className="text-3xl font-bold text-gray-900">{value}</p>
        </div>
        <div className="p-3 rounded-full" style={{ backgroundColor: `${color}20` }}>
          <Icon className="h-8 w-8" style={{ color }} />
        </div>
      </div>
    </Card>
  );

  return (
    <Layout>
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">
          Admin Dashboard
        </h1>

        {loading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <StatCard
              title="Total Users"
              value={stats.totalUsers}
              icon={Users}
              color="#3b82f6"
            />
            <StatCard
              title="Farmers"
              value={stats.farmers}
              icon={Activity}
              color="#10b981"
            />
            <StatCard
              title="Agronomists"
              value={stats.agronomists}
              icon={UserCog}
              color="#8b5cf6"
            />
            <StatCard
              title="Assignments"
              value={stats.assignments}
              icon={Database}
              color="#f59e0b"
            />
          </div>
        )}
      </div>
    </Layout>
  );
}
