import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import Layout from '../../components/Layout';
import { Card } from '../../components/ui/Card';
import api from '../../utils/api';
import { Users, Database, Activity } from 'lucide-react';
import toast from 'react-hot-toast';

export default function AgronomistDashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    totalFarmers: 0,
    farmers: [],
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const response = await api.get(`/assign/agronomist/${user._id}`);
      const farmersData = response.data.data?.farmers || [];
      
      setStats({
        totalFarmers: farmersData.length,
        farmers: farmersData,
      });
    } catch (error) {
      toast.error('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">
          Agronomist Dashboard
        </h1>

        {loading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <Card className="border-l-4 border-l-blue-500">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Assigned Farmers</p>
                    <p className="text-3xl font-bold text-gray-900">{stats.totalFarmers}</p>
                  </div>
                  <div className="p-3 rounded-full bg-blue-50">
                    <Users className="h-8 w-8 text-blue-500" />
                  </div>
                </div>
              </Card>

              <Card className="border-l-4 border-l-green-500">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Active Monitoring</p>
                    <p className="text-3xl font-bold text-gray-900">Active</p>
                  </div>
                  <div className="p-3 rounded-full bg-green-50">
                    <Activity className="h-8 w-8 text-green-500" />
                  </div>
                </div>
              </Card>

              <Card className="border-l-4 border-l-purple-500">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Data Points</p>
                    <p className="text-3xl font-bold text-gray-900">-</p>
                  </div>
                  <div className="p-3 rounded-full bg-purple-50">
                    <Database className="h-8 w-8 text-purple-500" />
                  </div>
                </div>
              </Card>
            </div>

            <Card title="Your Assigned Farmers">
              {stats.farmers.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {stats.farmers.map((farmer) => (
                    <div
                      key={farmer._id}
                      className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                    >
                      <div className="flex items-center space-x-3">
                        <div className="bg-primary-100 rounded-full p-2">
                          <Users className="h-6 w-6 text-primary-600" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-900">{farmer.name}</h3>
                          <p className="text-sm text-gray-600">{farmer.email}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 text-center py-8">
                  No farmers assigned yet
                </p>
              )}
            </Card>
          </>
        )}
      </div>
    </Layout>
  );
}
