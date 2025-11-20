import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../../components/Layout';
import { Card } from '../../components/ui/Card';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import api from '../../utils/api';
import toast from 'react-hot-toast';

export default function AddSensorData() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    N: '',
    P: '',
    K: '',
    temperature: '',
    humidity: '',
    ph: '',
    rainfall: '',
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Convert string values to numbers
      const data = Object.entries(formData).reduce((acc, [key, value]) => {
        acc[key] = parseFloat(value);
        return acc;
      }, {});

      await api.post('/sensor/add', data);
      toast.success('Sensor data added successfully!');
      navigate('/farmer/sensor-data');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to add sensor data');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">
          Add Sensor Data
        </h1>

        <Card>
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="Nitrogen (N)"
                type="number"
                name="N"
                step="0.01"
                required
                value={formData.N}
                onChange={handleChange}
                placeholder="0-100"
              />

              <Input
                label="Phosphorus (P)"
                type="number"
                name="P"
                step="0.01"
                required
                value={formData.P}
                onChange={handleChange}
                placeholder="0-100"
              />

              <Input
                label="Potassium (K)"
                type="number"
                name="K"
                step="0.01"
                required
                value={formData.K}
                onChange={handleChange}
                placeholder="0-100"
              />

              <Input
                label="Temperature (°C)"
                type="number"
                name="temperature"
                step="0.01"
                required
                value={formData.temperature}
                onChange={handleChange}
                placeholder="0-50"
              />

              <Input
                label="Humidity (%)"
                type="number"
                name="humidity"
                step="0.01"
                required
                value={formData.humidity}
                onChange={handleChange}
                placeholder="0-100"
              />

              <Input
                label="pH Level"
                type="number"
                name="ph"
                step="0.01"
                required
                value={formData.ph}
                onChange={handleChange}
                placeholder="0-14"
              />

              <Input
                label="Rainfall (mm)"
                type="number"
                name="rainfall"
                step="0.01"
                required
                value={formData.rainfall}
                onChange={handleChange}
                placeholder="0-500"
              />
            </div>

            <div className="flex space-x-4 mt-6">
              <Button type="submit" disabled={loading}>
                {loading ? 'Adding...' : 'Add Sensor Data'}
              </Button>
              <Button 
                type="button" 
                variant="secondary" 
                onClick={() => navigate('/farmer/sensor-data')}
              >
                Cancel
              </Button>
            </div>
          </form>
        </Card>
      </div>
    </Layout>
  );
}
