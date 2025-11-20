import { useState, useEffect } from 'react';
import Layout from '../../components/Layout';
import { Card } from '../../components/ui/Card';
import { Table } from '../../components/ui/Table';
import api from '../../utils/api';
import toast from 'react-hot-toast';
import { X, Brain, Leaf } from 'lucide-react';

export default function PredictionHistory() {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedPrediction, setSelectedPrediction] = useState(null);

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    try {
      const response = await api.get('/ml/history');
      setHistory(response.data.data || []);
    } catch (error) {
      toast.error('Failed to load prediction history');
    } finally {
      setLoading(false);
    }
  };

  const columns = [
    {
      header: 'Date',
      accessor: 'createdAt',
      render: (row) => new Date(row.createdAt).toLocaleString(),
    },
    {
      header: 'Type',
      accessor: 'type',
      render: (row) => (
        <span className="capitalize flex items-center">
          {row.type === 'crop-recommendation' ? (
            <Leaf className="h-4 w-4 mr-1 text-green-600" />
          ) : (
            <Brain className="h-4 w-4 mr-1 text-blue-600" />
          )}
          {row.type.replace('-', ' ')}
        </span>
      ),
    },
    {
      header: 'Status',
      accessor: 'status',
      render: (row) => (
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
          row.status === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
        }`}>
          {row.status}
        </span>
      ),
    },
    {
      header: 'Details',
      render: (row) => (
        <button
          onClick={() => setSelectedPrediction(row)}
          className="text-primary-600 hover:text-primary-700 font-medium"
        >
          View Details
        </button>
      ),
    },
  ];

  return (
    <Layout>
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">
          Prediction History
        </h1>

        <Card>
          <Table columns={columns} data={history} loading={loading} />
        </Card>
      </div>

      {/* Modal */}
      {selectedPrediction && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b">
              <h2 className="text-2xl font-bold text-gray-900 capitalize">
                {selectedPrediction.type.replace('-', ' ')}
              </h2>
              <button
                onClick={() => setSelectedPrediction(null)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6">
              {/* Date and Status */}
              <div className="mb-6 flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Predicted on</p>
                  <p className="text-lg font-medium text-gray-900">
                    {new Date(selectedPrediction.createdAt).toLocaleString()}
                  </p>
                </div>
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                  selectedPrediction.status === 'success' 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-red-100 text-red-800'
                }`}>
                  {selectedPrediction.status}
                </span>
              </div>

              {/* Input Data */}
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Input Parameters</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {selectedPrediction.input && Object.entries(selectedPrediction.input).map(([key, value]) => (
                    <div key={key} className="bg-gray-50 p-3 rounded-lg">
                      <p className="text-xs text-gray-600 uppercase">{key}</p>
                      <p className="text-lg font-semibold text-gray-900">
                        {typeof value === 'number' ? value.toFixed(2) : value}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Crop Recommendation Results */}
              {selectedPrediction.type === 'crop-recommendation' && selectedPrediction.output && (
                <div className="space-y-4">
                  {/* Main Recommendation */}
                  {selectedPrediction.output.consensus && (
                    <div className="bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-200 rounded-lg p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-gray-600 mb-1">Recommended Crop</p>
                          <p className="text-3xl font-bold text-green-600 capitalize">
                            {selectedPrediction.output.consensus.crop}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm text-gray-600 mb-1">Confidence</p>
                          <p className="text-2xl font-bold text-gray-900">
                            {(selectedPrediction.output.consensus.confidence * 100).toFixed(1)}%
                          </p>
                        </div>
                      </div>
                      <div className="mt-4 w-full bg-gray-200 rounded-full h-3">
                        <div
                          className="bg-green-500 h-3 rounded-full transition-all"
                          style={{ width: `${selectedPrediction.output.consensus.confidence * 100}%` }}
                        ></div>
                      </div>
                    </div>
                  )}

                  {/* Model Predictions */}
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">AI Model Analysis</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                      {Object.entries(selectedPrediction.output)
                        .filter(([key]) => key !== 'consensus')
                        .map(([model, prediction]) => (
                          <div key={model} className="bg-white border-2 border-gray-200 rounded-lg p-4">
                            <div className="flex items-center justify-between mb-2">
                              <h4 className="font-semibold text-gray-900">{model}</h4>
                              <Brain className="h-5 w-5 text-primary-600" />
                            </div>
                            <p className="text-xl font-bold text-primary-600 capitalize mb-1">
                              {prediction.crop}
                            </p>
                            <div className="flex items-center justify-between text-sm">
                              <span className="text-gray-600">Confidence</span>
                              <span className="font-semibold">
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
                  </div>
                </div>
              )}

              {/* Disease Detection Results */}
              {selectedPrediction.type === 'disease-detection' && (
                <div className="bg-blue-50 border-2 border-blue-200 rounded-lg p-6">
                  <p className="text-lg text-gray-600 mb-2">Detected Disease</p>
                  <p className="text-2xl font-bold text-blue-600">
                    {selectedPrediction.output?.prediction || 'No disease detected'}
                  </p>
                  <p className="text-gray-600 mt-2">
                    Confidence: {((selectedPrediction.output?.confidence || 0) * 100).toFixed(1)}%
                  </p>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="border-t p-6 bg-gray-50">
              <button
                onClick={() => setSelectedPrediction(null)}
                className="w-full bg-primary-600 text-white py-2 px-4 rounded-lg hover:bg-primary-700 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
}
