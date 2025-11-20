import { useState, useEffect } from 'react';
import Layout from '../../components/Layout';
import { Card } from '../../components/ui/Card';
import { Table } from '../../components/ui/Table';
import api from '../../utils/api';
import toast from 'react-hot-toast';

export default function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await api.get('/auth/users');
      setUsers(response.data.data || []);
    } catch (error) {
      toast.error('Failed to load users');
    } finally {
      setLoading(false);
    }
  };

  const columns = [
    { header: 'Name', accessor: 'name' },
    { header: 'Email', accessor: 'email' },
    {
      header: 'Role',
      accessor: 'role',
      render: (row) => (
        <span className={`px-2 py-1 rounded-full text-xs font-medium capitalize ${
          row.role === 'admin' ? 'bg-red-100 text-red-800' :
          row.role === 'agronomist' ? 'bg-purple-100 text-purple-800' :
          'bg-green-100 text-green-800'
        }`}>
          {row.role}
        </span>
      ),
    },
    {
      header: 'Joined',
      accessor: 'createdAt',
      render: (row) => new Date(row.createdAt).toLocaleDateString(),
    },
  ];

  return (
    <Layout>
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">
          All Users
        </h1>

        <Card>
          <Table columns={columns} data={users} loading={loading} />
        </Card>
      </div>
    </Layout>
  );
}
