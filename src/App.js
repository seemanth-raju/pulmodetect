import React, { useState } from 'react';

const LungCancerPrediction = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [prediction, setPrediction] = useState(null);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState(null);

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file && file.type.startsWith('image/')) {
      setSelectedFile(file);
      setError(null);
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    } else {
      setError('Please select a valid image file');
      setSelectedFile(null);
      setPreviewUrl(null);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!selectedFile) {
      setError('Please select a file first');
      return;
    }

    setIsLoading(true);
    setError(null);

    const formData = new FormData();
    formData.append('file', selectedFile);

    try {
      const response = await fetch('http://127.0.0.1:8000/predict/', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Prediction failed');
      }

      const result = await response.json();
      setPrediction(result.predicted_class);
    } catch (err) {
      setError('Failed to get prediction. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-black text-white py-8 px-4">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-3xl font-bold mb-4">
            Lung Cancer CT Scan Analysis
          </h1>
          <p className="text-gray-300 max-w-3xl">
            Upload CT scan images for instant analysis. Our advanced AI model helps detect potential lung abnormalities,
            supporting early diagnosis and treatment planning.
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto py-8 px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Upload Section */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4">
              Upload CT Scan
            </h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="flex flex-col items-center p-6 border-2 border-dashed border-gray-300 rounded-lg hover:border-gray-400 transition-colors">
                <div className="mb-4">
                  <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"/>
                  </svg>
                </div>
                <input
                  type="file"
                  onChange={handleFileChange}
                  accept="image/*"
                  className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                />
                {selectedFile && (
                  <p className="mt-2 text-sm text-gray-500">
                    Selected: {selectedFile.name}
                  </p>
                )}
              </div>

              <button 
                type="submit" 
                disabled={isLoading || !selectedFile}
                className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
              >
                {isLoading ? 'Processing...' : 'Analyze CT Scan'}
              </button>
            </form>

            {error && (
              <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-md">
                <p className="text-red-700">{error}</p>
              </div>
            )}
          </div>

          {/* Preview and Results Section */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4">
              Preview & Results
            </h2>
            <div className="space-y-4">
              {previewUrl && (
                <div className="border rounded-lg overflow-hidden">
                  <img 
                    src={previewUrl} 
                    alt="CT Scan Preview" 
                    className="w-full h-64 object-cover"
                  />
                </div>
              )}

              {prediction && (
                <div className="bg-green-50 border border-green-200 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-green-800 mb-2">
                    Analysis Complete
                  </h3>
                  <div className="space-y-2">
                    <p className="text-green-700">
                      <span className="font-medium">Prediction:</span> {prediction}
                    </p>
                    <p className="text-sm text-green-600">
                      This analysis is based on our AI model's interpretation of the CT scan.
                      Please consult with a healthcare professional for medical advice.
                    </p>
                  </div>
                </div>
              )}

              {!previewUrl && !prediction && (
                <div className="text-center text-gray-500 py-12">
                  <svg className="w-12 h-12 mx-auto mb-4 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
                  </svg>
                  <p>Upload a CT scan to see the preview and analysis results here</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Information Section */}
        <div className="mt-8 bg-white rounded-lg shadow-md p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <h3 className="font-semibold mb-2">About the Analysis</h3>
              <p className="text-sm text-gray-600">
                Our AI model analyzes CT scan images to detect potential indicators
                of lung cancer and other respiratory conditions.
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-2">Supported File Types</h3>
              <p className="text-sm text-gray-600">
                We support common medical imaging formats including DICOM, JPEG,
                and PNG files of CT scans.
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-2">Important Note</h3>
              <p className="text-sm text-gray-600">
                This tool is for preliminary analysis only. Always consult with
                healthcare professionals for medical diagnosis.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LungCancerPrediction;