import { useState } from 'react';
import Layout from '../../components/Layout';
import { Card } from '../../components/ui/Card';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import api from '../../utils/api';
import toast from 'react-hot-toast';
import { Brain, Leaf } from 'lucide-react';

export default function MLPredictions() {
  const [activeTab, setActiveTab] = useState('crop');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  // Crop Recommendation State
  const [cropData, setCropData] = useState({
    N: '',
    P: '',
    K: '',
    temperature: '',
    humidity: '',
    ph: '',
    rainfall: '',
  });

  // Disease Detection State
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

        {/* Tabs */}
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

        {/* Crop Recommendation Form */}
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

        {/* Disease Detection Form */}
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

        {/* Results */}
        {result && activeTab === 'crop' && (
          <div className="mt-6 space-y-4">
            {/* Main Recommendation Card */}
            <Card className="bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-200">
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
                  <Leaf className="h-8 w-8 text-green-600" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                  Recommended Crop
                </h2>
                <p className="text-4xl font-extrabold text-green-600 capitalize mb-2">
                  {result.data?.consensus?.crop || 'N/A'}
                </p>
                <p className="text-sm text-gray-600">
                  Confidence: {((result.data?.consensus?.confidence || 0) * 100).toFixed(1)}%
                </p>
                <div className="mt-4 w-full bg-gray-200 rounded-full h-3">
                  <div
                    className="bg-green-500 h-3 rounded-full transition-all duration-500"
                    style={{ width: `${(result.data?.consensus?.confidence || 0) * 100}%` }}
                  ></div>
                </div>
              </div>
            </Card>

            {/* Model Predictions */}
            <Card title="Detailed Analysis from Multiple AI Models">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {result.data?.output && Object.entries(result.data.output).map(([model, prediction]) => (
                  <div
                    key={model}
                    className="bg-white border-2 border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-semibold text-gray-900">{model}</h3>
                      <Brain className="h-5 w-5 text-primary-600" />
                    </div>
                    <p className="text-2xl font-bold text-primary-600 capitalize mb-1">
                      {prediction.crop}
                    </p>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">Confidence</span>
                      <span className="font-semibold text-gray-900">
                        {(prediction.confidence * 100).toFixed(1)}%
                      </span>
                    </div>
                    <div className="mt-2 w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-primary-500 h-2 rounded-full"
                        style={{ width: `${prediction.confidence * 100}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            {/* Helpful Information */}
            <Card className="bg-blue-50 border-2 border-blue-200">
              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0">
                  <div className="flex items-center justify-center h-10 w-10 rounded-full bg-blue-100">
                    <svg className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    💡 Understanding Your Results
                  </h3>
                  <p className="text-gray-700 text-sm leading-relaxed">
                    Our AI analyzed your soil and weather conditions using <strong>5 different machine learning models</strong>. 
                    The recommended crop shows the <strong>best consensus</strong> across all models, giving you the most reliable 
                    prediction for optimal yield. Higher confidence means better soil-crop compatibility!
                  </p>
                </div>
              </div>
            </Card>
          </div>
        )}

        {result && activeTab === 'disease' && (
          <Card title="Detection Results" className="mt-6">
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
                <Brain className="h-8 w-8 text-green-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Disease Detected
              </h2>
              <p className="text-4xl font-extrabold text-primary-600 mb-4">
                {result.prediction || 'No disease detected'}
              </p>
              <p className="text-lg text-gray-600 mb-4">
                Confidence: <span className="font-semibold">
                  {result.raw_confidence 
                    ? `${(result.raw_confidence * 100).toFixed(2)}%`
                    : result.confidence || 'N/A'}
                </span>
              </p>
              {result.raw_confidence && (
                <div className="mt-4 w-full max-w-md mx-auto">
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div
                      className="bg-primary-500 h-3 rounded-full transition-all duration-500"
                      style={{ width: `${(result.raw_confidence * 100)}%` }}
                    ></div>
                  </div>
                </div>
              )}
            </div>
          </Card>
        )}
      </div>
    </Layout>
  );
}
