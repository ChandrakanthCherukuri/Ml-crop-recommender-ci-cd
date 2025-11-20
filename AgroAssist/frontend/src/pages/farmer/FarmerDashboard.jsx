import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import Layout from '../../components/Layout';
import { Card } from '../../components/ui/Card';
import api from '../../utils/api';
import { Activity, Database, Brain, TrendingUp } from 'lucide-react';
import toast from 'react-hot-toast';

export default function FarmerDashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    totalSensorData: 0,
    latestData: null,
    predictions: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const [sensorDataRes, latestRes, predictionsRes] = await Promise.all([
        api.get('/sensor'),
        api.get('/sensor/latest'),
        api.get('/ml/history'),
      ]);

      setStats({
        totalSensorData: sensorDataRes.data.data?.length || 0,
        latestData: latestRes.data.data,
        predictions: predictionsRes.data.data?.length || 0,
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
        <div className={`p-3 rounded-full bg-${color}-50`}>
          <Icon className="h-8 w-8" style={{ color }} />
        </div>
      </div>
    </Card>
  );

  return (
    <Layout>
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">
          Welcome back, {user?.name}!
        </h1>

        {loading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <StatCard
                title="Total Sensor Records"
                value={stats.totalSensorData}
                icon={Database}
                color="#3b82f6"
              />
              <StatCard
                title="ML Predictions"
                value={stats.predictions}
                icon={Brain}
                color="#8b5cf6"
              />
              <StatCard
                title="Active Monitoring"
                value={stats.latestData ? 'Active' : 'No Data'}
                icon={Activity}
                color="#10b981"
              />
            </div>

            {stats.latestData && (
              <Card title="Latest Sensor Reading">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div>
                    <p className="text-sm text-gray-600">Nitrogen (N)</p>
                    <p className="text-2xl font-semibold text-gray-900">{stats.latestData.N}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Phosphorus (P)</p>
                    <p className="text-2xl font-semibold text-gray-900">{stats.latestData.P}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Potassium (K)</p>
                    <p className="text-2xl font-semibold text-gray-900">{stats.latestData.K}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Temperature (°C)</p>
                    <p className="text-2xl font-semibold text-gray-900">{stats.latestData.temperature}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Humidity (%)</p>
                    <p className="text-2xl font-semibold text-gray-900">{stats.latestData.humidity}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">pH Level</p>
                    <p className="text-2xl font-semibold text-gray-900">{stats.latestData.ph}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Rainfall (mm)</p>
                    <p className="text-2xl font-semibold text-gray-900">{stats.latestData.rainfall}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Date</p>
                    <p className="text-sm font-medium text-gray-900">
                      {new Date(stats.latestData.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </Card>
            )}
          </>
        )}
      </div>
    </Layout>
  );
}
