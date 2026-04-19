import { useState } from 'react';

export default function Home() {
  const [userName, setUserName] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadStatus, setUploadStatus] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);

  const validateFile = (file) => {
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'application/pdf'];
    const maxSize = 5 * 1024 * 1024;
    
    if (!allowedTypes.includes(file.type)) {
      return 'Invalid file type. Only JPEG, PNG, PDF files are allowed.';
    }
    
    if (file.size > maxSize) {
      return 'File size exceeds 5MB limit.';
    }
    
    return null;
  };

  const handleFileSelect = (file) => {
    if (file) {
      const error = validateFile(file);
      if (error) {
        setUploadStatus(error);
        setSelectedFile(null);
        setTimeout(() => setUploadStatus(''), 3000);
      } else {
        setUploadStatus('');
        setSelectedFile(file);
      }
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    handleFileSelect(file);
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    const file = e.dataTransfer.files[0];
    handleFileSelect(file);
  };

  const handleUpload = async () => {
    if (!userName.trim()) {
      setUploadStatus('Please enter your name first');
      setTimeout(() => setUploadStatus(''), 3000);
      return;
    }

    if (!selectedFile) {
      setUploadStatus('Please select a file first');
      setTimeout(() => setUploadStatus(''), 3000);
      return;
    }

    setIsUploading(true);
    setUploadProgress(0);
    setUploadStatus('Uploading...');

    const formData = new FormData();
    formData.append('file', selectedFile);
    formData.append('userName', userName);

    try {
      // Try multiple possible URLs
      let response;
      let error;
      
      // Try localhost first
      try {
        response = await fetch('http://localhost:5001/api/upload', {
          method: 'POST',
          body: formData,
        });
      } catch (err) {
        error = err;
        // Try 127.0.0.1 as fallback
        response = await fetch('http://127.0.0.1:5001/api/upload', {
          method: 'POST',
          body: formData,
        });
      }

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Upload failed');
      }

      const result = await response.json();
      
      setUploadProgress(100);
      setUploadStatus(`✅ ${result.message} Thank you, ${userName}!`);
      
      setTimeout(() => {
        setUploadStatus('');
        setSelectedFile(null);
        setUploadProgress(0);
      }, 3000);
      
    } catch (error) {
      console.error('Upload error:', error);
      setUploadStatus(`❌ Cannot connect to server. Please make sure web102 is running on port 5001`);
      setUploadProgress(0);
      setTimeout(() => setUploadStatus(''), 5000);
    } finally {
      setIsUploading(false);
    }
  };

  const handleReset = () => {
    setUserName('');
    setSelectedFile(null);
    setUploadProgress(0);
    setUploadStatus('');
    setIsUploading(false);
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h1 style={styles.title}>File Upload to Web102</h1>
        
        <div style={styles.inputGroup}>
          <label style={styles.label}>Enter Your Name</label>
          <input
            type="text"
            value={userName}
            onChange={(e) => setUserName(e.target.value)}
            placeholder="e.g., John Doe"
            style={styles.nameInput}
            disabled={isUploading}
          />
        </div>

        <div style={styles.uploadSection}>
          <p style={styles.selectFileLabel}>Select File</p>

          <div
            style={{
              ...styles.dropzone,
              ...(dragActive ? styles.dropzoneActive : {}),
              ...(selectedFile ? styles.dropzoneWithFile : {})
            }}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
          >
            <input
              type="file"
              id="fileInput"
              style={styles.fileInput}
              onChange={handleFileChange}
              accept=".jpg,.jpeg,.png,.pdf"
              disabled={isUploading}
            />
            <label htmlFor="fileInput" style={styles.dropzoneLabel}>
              {selectedFile ? (
                <span style={styles.fileName}>{selectedFile.name}</span>
              ) : (
                <span>Drag & drop a file here, or click to select<br/>
                <span style={styles.fileTypes}>JPEG, PNG, PDF — max 5MB</span></span>
              )}
            </label>
          </div>

          {selectedFile && !isUploading && (
            <div style={styles.fileInfo}>
              <p><strong>File:</strong> {selectedFile.name}</p>
              <p><strong>Size:</strong> {(selectedFile.size / 1024).toFixed(2)} KB</p>
              <p><strong>Type:</strong> {selectedFile.type}</p>
            </div>
          )}

          {isUploading && (
            <div style={styles.progressContainer}>
              <div style={styles.progressBar}>
                <div style={{...styles.progressFill, width: `${uploadProgress}%`}} />
              </div>
              <p style={styles.progressText}>{uploadProgress}%</p>
            </div>
          )}

          {uploadStatus && (
            <div style={{
              ...styles.statusMessage,
              ...(uploadStatus.includes('✅') ? styles.successMessage : styles.errorMessage)
            }}>
              {uploadStatus}
            </div>
          )}

          <div style={styles.buttonContainer}>
            <button 
              onClick={handleUpload}
              disabled={isUploading || !selectedFile || !userName.trim()}
              style={styles.uploadButton}
            >
              {isUploading ? 'Uploading...' : 'Upload File'}
            </button>
            
            <button 
              onClick={handleReset}
              disabled={isUploading}
              style={styles.resetButton}
            >
              Reset
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

const styles = {
  container: {
    minHeight: '100vh',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f0f2f5',
    padding: '20px',
  },
  card: {
    backgroundColor: 'white',
    borderRadius: '8px',
    padding: '40px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
    width: '100%',
    maxWidth: '500px',
  },
  title: {
    fontSize: '24px',
    fontWeight: '600',
    color: '#1a1a1a',
    marginBottom: '30px',
    textAlign: 'left',
  },
  inputGroup: {
    marginBottom: '30px',
  },
  label: {
    fontSize: '14px',
    color: '#666',
    marginBottom: '8px',
    display: 'block',
    fontWeight: '500',
  },
  nameInput: {
    width: '100%',
    padding: '10px 12px',
    border: '1px solid #d9d9d9',
    borderRadius: '4px',
    fontSize: '14px',
    outline: 'none',
  },
  uploadSection: {
    marginTop: '10px',
  },
  selectFileLabel: {
    fontSize: '14px',
    color: '#666',
    marginBottom: '10px',
    fontWeight: '500',
  },
  dropzone: {
    border: '2px dashed #d9d9d9',
    borderRadius: '8px',
    backgroundColor: '#fafafa',
    transition: 'all 0.3s',
    marginBottom: '20px',
    cursor: 'pointer',
  },
  dropzoneActive: {
    borderColor: '#1890ff',
    backgroundColor: '#e6f7ff',
  },
  dropzoneWithFile: {
    borderColor: '#52c41a',
    backgroundColor: '#f6ffed',
  },
  fileInput: {
    display: 'none',
  },
  dropzoneLabel: {
    display: 'block',
    padding: '40px 20px',
    textAlign: 'center',
    cursor: 'pointer',
    fontSize: '14px',
    color: '#999',
    lineHeight: '1.5',
  },
  fileTypes: {
    fontSize: '12px',
    color: '#bbb',
    display: 'block',
    marginTop: '5px',
  },
  fileName: {
    color: '#52c41a',
    fontSize: '14px',
    fontWeight: '500',
  },
  fileInfo: {
    backgroundColor: '#f5f5f5',
    padding: '12px',
    borderRadius: '4px',
    marginBottom: '20px',
    fontSize: '13px',
  },
  progressContainer: {
    marginBottom: '20px',
  },
  progressBar: {
    width: '100%',
    height: '8px',
    backgroundColor: '#f0f0f0',
    borderRadius: '4px',
    overflow: 'hidden',
    marginBottom: '8px',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#1890ff',
    transition: 'width 0.3s ease',
    borderRadius: '4px',
  },
  progressText: {
    fontSize: '12px',
    color: '#666',
    textAlign: 'center',
  },
  statusMessage: {
    padding: '10px',
    borderRadius: '4px',
    marginBottom: '20px',
    fontSize: '14px',
    textAlign: 'center',
  },
  successMessage: {
    backgroundColor: '#f6ffed',
    color: '#52c41a',
    border: '1px solid #b7eb8f',
  },
  errorMessage: {
    backgroundColor: '#fff2f0',
    color: '#ff4d4f',
    border: '1px solid #ffccc7',
  },
  buttonContainer: {
    display: 'flex',
    gap: '10px',
  },
  uploadButton: {
    flex: 1,
    padding: '10px 20px',
    backgroundColor: '#1890ff',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    fontSize: '14px',
    cursor: 'pointer',
  },
  resetButton: {
    flex: 1,
    padding: '10px 20px',
    backgroundColor: '#fff',
    color: '#666',
    border: '1px solid #d9d9d9',
    borderRadius: '4px',
    fontSize: '14px',
    cursor: 'pointer',
  },
}; 