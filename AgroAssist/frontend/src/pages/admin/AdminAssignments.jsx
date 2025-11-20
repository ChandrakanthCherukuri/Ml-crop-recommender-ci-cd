import { useState, useEffect } from 'react';
import Layout from '../../components/Layout';
import { Card } from '../../components/ui/Card';
import { Table } from '../../components/ui/Table';
import { Modal } from '../../components/ui/Modal';
import { Select } from '../../components/ui/Select';
import { Button } from '../../components/ui/Button';
import api from '../../utils/api';
import toast from 'react-hot-toast';

export default function AdminAssignments() {
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // For new assignment
  const [agronomists, setAgronomists] = useState([]);
  const [farmers, setFarmers] = useState([]);
  const [selectedAgronomist, setSelectedAgronomist] = useState('');
  const [selectedFarmers, setSelectedFarmers] = useState([]);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchAssignments();
    fetchUsers();
  }, []);

  const fetchAssignments = async () => {
    try {
      const response = await api.get('/assign');
      setAssignments(response.data.data || []);
    } catch (error) {
      toast.error('Failed to load assignments');
    } finally {
      setLoading(false);
    }
  };

  const fetchUsers = async () => {
    try {
      const response = await api.get('/auth/users');
      const users = response.data.data || [];
      
      setAgronomists(users.filter(u => u.role === 'agronomist'));
      setFarmers(users.filter(u => u.role === 'farmer'));
    } catch (error) {
      toast.error('Failed to load users');
    }
  };

  const handleAssign = async (e) => {
    e.preventDefault();
    
    if (!selectedAgronomist || selectedFarmers.length === 0) {
      toast.error('Please select agronomist and at least one farmer');
      return;
    }

    setSubmitting(true);

    try {
      await api.post('/assign', {
        agronomistId: selectedAgronomist,
        farmerIds: selectedFarmers,
      });
      
      toast.success('Assignment created successfully!');
      setIsModalOpen(false);
      setSelectedAgronomist('');
      setSelectedFarmers([]);
      fetchAssignments();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to create assignment');
    } finally {
      setSubmitting(false);
    }
  };

  const handleFarmerSelection = (farmerId) => {
    setSelectedFarmers(prev => {
      if (prev.includes(farmerId)) {
        return prev.filter(id => id !== farmerId);
      } else {
        return [...prev, farmerId];
      }
    });
  };

  const columns = [
    {
      header: 'Agronomist',
      render: (row) => row.agronomist?.name || 'N/A',
    },
    {
      header: 'Agronomist Email',
      render: (row) => row.agronomist?.email || 'N/A',
    },
    {
      header: 'Farmers Count',
      render: (row) => row.farmers?.length || 0,
    },
    {
      header: 'Farmers',
      render: (row) => (
        <div className="max-w-xs">
          {row.farmers?.map(f => f.name).join(', ') || 'None'}
        </div>
      ),
    },
  ];

  return (
    <Layout>
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Farmer-Agronomist Assignments
          </h1>
          <Button onClick={() => setIsModalOpen(true)}>
            New Assignment
          </Button>
        </div>

        <Card>
          <Table columns={columns} data={assignments} loading={loading} />
        </Card>

        <Modal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          title="Assign Farmers to Agronomist"
        >
          <form onSubmit={handleAssign}>
            <Select
              label="Select Agronomist"
              options={agronomists.map(a => ({ value: a._id, label: `${a.name} (${a.email})` }))}
              value={selectedAgronomist}
              onChange={(e) => setSelectedAgronomist(e.target.value)}
            />

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Select Farmers
              </label>
              <div className="max-h-60 overflow-y-auto border border-gray-300 rounded-lg p-3">
                {farmers.map(farmer => (
                  <label key={farmer._id} className="flex items-center space-x-2 py-2 hover:bg-gray-50 px-2 rounded">
                    <input
                      type="checkbox"
                      checked={selectedFarmers.includes(farmer._id)}
                      onChange={() => handleFarmerSelection(farmer._id)}
                      className="rounded text-primary-600 focus:ring-primary-500"
                    />
                    <span className="text-sm">{farmer.name} ({farmer.email})</span>
                  </label>
                ))}
              </div>
            </div>

            <div className="flex space-x-3">
              <Button type="submit" disabled={submitting}>
                {submitting ? 'Assigning...' : 'Assign'}
              </Button>
              <Button 
                type="button" 
                variant="secondary" 
                onClick={() => setIsModalOpen(false)}
              >
                Cancel
              </Button>
            </div>
          </form>
        </Modal>
      </div>
    </Layout>
  );
}
