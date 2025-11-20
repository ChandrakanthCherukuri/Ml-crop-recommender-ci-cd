import { useState } from 'react';
import Layout from '../../components/Layout';
import { Card } from '../../components/ui/Card';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import api from '../../utils/api';
import toast from 'react-hot-toast';
import { Brain, Leaf } from 'lucide-react';

export default function AgronomistMLPredictions() {
  const [activeTab, setActiveTab] = useState('crop');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  const [cropData, setCropData] = useState({
    N: '',
    P: '',
    K: '',
    temperature: '',
    humidity: '',
    ph: '',
    rainfall: '',
  });

  const [selectedFile, setSelectedFile] = useState(null);
  const [preview, setPreview] = useState(null);

  const handleCropSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setResult(null);

    try {
      const data = Object.entries(cropData).reduce((acc, [key, value]) => {
        acc[key] = parseFloat(value);
        return acc;
      }, {});

      const response = await api.post('/ml/crop-recommend', data);
      setResult(response.data);
      toast.success('Crop recommendation generated!');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Prediction failed');
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDiseaseSubmit = async (e) => {
    e.preventDefault();
    if (!selectedFile) {
      toast.error('Please select an image');
      return;
    }

    setLoading(true);
    setResult(null);

    try {
      const formData = new FormData();
      formData.append('file', selectedFile);

      const response = await api.post('/ml/disease-detect', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setResult(response.data);
      toast.success('Disease detection complete!');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Detection failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">
          ML Predictions
        </h1>

        <div className="flex space-x-4 mb-6">
          <button
            onClick={() => {
              setActiveTab('crop');
              setResult(null);
            }}
            className={`px-6 py-3 rounded-lg font-medium transition-colors ${
              activeTab === 'crop'
                ? 'bg-primary-600 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            <Leaf className="inline-block mr-2 h-5 w-5" />
            Crop Recommendation
          </button>
          <button
            onClick={() => {
              setActiveTab('disease');
              setResult(null);
            }}
            className={`px-6 py-3 rounded-lg font-medium transition-colors ${
              activeTab === 'disease'
                ? 'bg-primary-600 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            <Brain className="inline-block mr-2 h-5 w-5" />
            Disease Detection
          </button>
        </div>

        {activeTab === 'crop' && (
          <Card title="Crop Recommendation">
            <form onSubmit={handleCropSubmit}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  label="Nitrogen (N)"
                  type="number"
                  step="0.01"
                  required
                  value={cropData.N}
                  onChange={(e) => setCropData({ ...cropData, N: e.target.value })}
                />
                <Input
                  label="Phosphorus (P)"
                  type="number"
                  step="0.01"
                  required
                  value={cropData.P}
                  onChange={(e) => setCropData({ ...cropData, P: e.target.value })}
                />
                <Input
                  label="Potassium (K)"
                  type="number"
                  step="0.01"
                  required
                  value={cropData.K}
                  onChange={(e) => setCropData({ ...cropData, K: e.target.value })}
                />
                <Input
                  label="Temperature (°C)"
                  type="number"
                  step="0.01"
                  required
                  value={cropData.temperature}
                  onChange={(e) => setCropData({ ...cropData, temperature: e.target.value })}
                />
                <Input
                  label="Humidity (%)"
                  type="number"
                  step="0.01"
                  required
                  value={cropData.humidity}
                  onChange={(e) => setCropData({ ...cropData, humidity: e.target.value })}
                />
                <Input
                  label="pH Level"
                  type="number"
                  step="0.01"
                  required
                  value={cropData.ph}
                  onChange={(e) => setCropData({ ...cropData, ph: e.target.value })}
                />
                <Input
                  label="Rainfall (mm)"
                  type="number"
                  step="0.01"
                  required
                  value={cropData.rainfall}
                  onChange={(e) => setCropData({ ...cropData, rainfall: e.target.value })}
                />
              </div>
              <Button type="submit" disabled={loading} className="mt-6">
                {loading ? 'Predicting...' : 'Get Recommendation'}
              </Button>
            </form>
          </Card>
        )}

        {activeTab === 'disease' && (
          <Card title="Disease Detection">
            <form onSubmit={handleDiseaseSubmit}>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Upload Plant Image
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-primary-50 file:text-primary-700 hover:file:bg-primary-100"
                />
              </div>

              {preview && (
                <div className="mb-4">
                  <img
                    src={preview}
                    alt="Preview"
                    className="max-w-md rounded-lg border-2 border-gray-300"
                  />
                </div>
              )}

              <Button type="submit" disabled={loading || !selectedFile}>
                {loading ? 'Analyzing...' : 'Detect Disease'}
              </Button>
            </form>
          </Card>
        )}

        {result && (
          <Card title="Prediction Results" className="mt-6 bg-primary-50">
            <pre className="bg-white p-4 rounded-lg overflow-auto">
              {JSON.stringify(result, null, 2)}
            </pre>
          </Card>
        )}
      </div>
    </Layout>
  );
}
