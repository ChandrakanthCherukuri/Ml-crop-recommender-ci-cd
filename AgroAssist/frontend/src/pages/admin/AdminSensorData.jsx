import { useState, useEffect } from 'react';
import Layout from '../../components/Layout';
import { Card } from '../../components/ui/Card';
import { Table } from '../../components/ui/Table';
import api from '../../utils/api';
import toast from 'react-hot-toast';

export default function AdminSensorData() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSensorData();
  }, []);

  const fetchSensorData = async () => {
    try {
      const response = await api.get('/sensor/all');
      setData(response.data.data || []);
    } catch (error) {
      toast.error('Failed to load sensor data');
    } finally {
      setLoading(false);
    }
  };

  const columns = [
    {
      header: 'Farmer',
      render: (row) => row.farmer?.name || 'N/A',
    },
    {
      header: 'Date',
      accessor: 'createdAt',
      render: (row) => new Date(row.createdAt).toLocaleDateString(),
    },
    { header: 'N', accessor: 'N' },
    { header: 'P', accessor: 'P' },
    { header: 'K', accessor: 'K' },
    { header: 'Temp (°C)', accessor: 'temperature' },
    { header: 'Humidity (%)', accessor: 'humidity' },
    { header: 'pH', accessor: 'ph' },
    { header: 'Rainfall (mm)', accessor: 'rainfall' },
  ];

  return (
    <Layout>
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">
          All Sensor Data
        </h1>

        <Card>
          <Table columns={columns} data={data} loading={loading} />
        </Card>
      </div>
    </Layout>
  );
}
