import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import Layout from '../../components/Layout';
import { Card } from '../../components/ui/Card';
import { Table } from '../../components/ui/Table';
import api from '../../utils/api';
import toast from 'react-hot-toast';

export default function AgronomistFarmers() {
  const { user } = useAuth();
  const [farmers, setFarmers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchFarmers();
  }, []);

  const fetchFarmers = async () => {
    try {
      const response = await api.get(`/assign/agronomist/${user._id}`);
      setFarmers(response.data.data?.farmers || []);
    } catch (error) {
      toast.error('Failed to load farmers');
    } finally {
      setLoading(false);
    }
  };

  const columns = [
    { header: 'Name', accessor: 'name' },
    { header: 'Email', accessor: 'email' },
    {
      header: 'Joined',
      accessor: 'createdAt',
      render: (row) => new Date(row.createdAt).toLocaleDateString(),
    },
    {
      header: 'Actions',
      render: (row) => (
        <button
          onClick={() => viewFarmerDetails(row._id)}
          className="text-primary-600 hover:text-primary-700 font-medium"
        >
          View Details
        </button>
      ),
    },
  ];

  const viewFarmerDetails = async (farmerId) => {
    try {
      const response = await api.get(`/sensor?farmerId=${farmerId}`);
      alert(`Farmer Data:\n${JSON.stringify(response.data, null, 2)}`);
    } catch (error) {
      toast.error('Failed to load farmer details');
    }
  };

  return (
    <Layout>
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">
          My Farmers
        </h1>

        <Card>
          <Table columns={columns} data={farmers} loading={loading} />
        </Card>
      </div>
    </Layout>
  );
}
