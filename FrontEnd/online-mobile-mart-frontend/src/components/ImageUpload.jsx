import React, { useState, useRef } from 'react';
import axiosInstance from '../utils/axiosInstance';

const ImageUpload = ({ productId, onUploadSuccess, maxFiles = 5 }) => {
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [previews, setPreviews] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const fileInputRef = useRef(null);

  const handleFileSelect = (e) => {
    const files = Array.from(e.target.files);

    // Validate file types
    const validFiles = files.filter(file => {
      const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif'];
      return validTypes.includes(file.type);
    });

    if (validFiles.length !== files.length) {
      alert('Please select only image files (JPEG, PNG, GIF)');
      return;
    }

    // Validate file count
    if (validFiles.length > maxFiles) {
      alert(`Please select maximum ${maxFiles} files`);
      return;
    }

    // Validate file sizes (max 5MB each)
    const oversizedFiles = validFiles.filter(file => file.size > 5 * 1024 * 1024);
    if (oversizedFiles.length > 0) {
      alert('Each file must be less than 5MB');
      return;
    }

    setSelectedFiles(validFiles);

    // Create previews
    const newPreviews = validFiles.map(file => URL.createObjectURL(file));
    setPreviews(newPreviews);
  };

  const handleUpload = async () => {
    if (selectedFiles.length === 0) return;

    const formData = new FormData();
    selectedFiles.forEach(file => {
      formData.append('files', file);
    });

    try {
      setUploading(true);
      setUploadProgress(0);

      const response = await axiosInstance.post(
        `/admin/products/${productId}/images`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
          onUploadProgress: (progressEvent) => {
            const percentCompleted = Math.round(
              (progressEvent.loaded * 100) / progressEvent.total
            );
            setUploadProgress(percentCompleted);
          },
        }
      );

      // Clean up previews
      previews.forEach(url => URL.revokeObjectURL(url));

      // Reset state
      setSelectedFiles([]);
      setPreviews([]);
      setUploadProgress(0);

      // Clear file input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }

      // Notify parent component
      if (onUploadSuccess) {
        onUploadSuccess(response.data);
      }

      alert('Images uploaded successfully!');
    } catch (error) {
      console.error('Upload error:', error);
      alert('Failed to upload images. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  const removeFile = (index) => {
    const newFiles = selectedFiles.filter((_, i) => i !== index);
    const newPreviews = previews.filter((_, i) => i !== index);

    // Clean up the removed preview URL
    URL.revokeObjectURL(previews[index]);

    setSelectedFiles(newFiles);
    setPreviews(newPreviews);
  };

  const clearAll = () => {
    // Clean up all preview URLs
    previews.forEach(url => URL.revokeObjectURL(url));

    setSelectedFiles([]);
    setPreviews([]);
    setUploadProgress(0);

    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="image-upload">
      <div className="mb-3">
        <label className="form-label">Product Images</label>
        <input
          type="file"
          className="form-control"
          ref={fileInputRef}
          multiple
          accept="image/*"
          onChange={handleFileSelect}
          disabled={uploading}
        />
        <small className="text-muted">
          Select up to {maxFiles} images (JPEG, PNG, GIF). Max 5MB each.
        </small>
      </div>

      {/* Image Previews */}
      {previews.length > 0 && (
        <div className="mb-3">
          <h6>Selected Images:</h6>
          <div className="d-flex flex-wrap gap-2">
            {previews.map((preview, index) => (
              <div key={index} className="position-relative">
                <img
                  src={preview}
                  alt={`Preview ${index + 1}`}
                  className="img-thumbnail"
                  style={{ width: '100px', height: '100px', objectFit: 'cover' }}
                />
                <button
                  type="button"
                  className="btn btn-danger btn-sm position-absolute top-0 end-0"
                  onClick={() => removeFile(index)}
                  disabled={uploading}
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Upload Progress */}
      {uploading && (
        <div className="mb-3">
          <div className="progress">
            <div
              className="progress-bar"
              role="progressbar"
              style={{ width: `${uploadProgress}%` }}
              aria-valuenow={uploadProgress}
              aria-valuemin="0"
              aria-valuemax="100"
            >
              {uploadProgress}%
            </div>
          </div>
        </div>
      )}

      {/* Action Buttons */}
      {selectedFiles.length > 0 && (
        <div className="d-flex gap-2">
          <button
            type="button"
            className="btn btn-success"
            onClick={handleUpload}
            disabled={uploading}
          >
            {uploading ? 'Uploading...' : `Upload ${selectedFiles.length} Image${selectedFiles.length > 1 ? 's' : ''}`}
          </button>
          <button
            type="button"
            className="btn btn-outline-secondary"
            onClick={clearAll}
            disabled={uploading}
          >
            Clear All
          </button>
        </div>
      )}
    </div>
  );
};

export default ImageUpload;