import React, { useState } from 'react';
import './VideoUploadPage.scss';

function VideoUploadPage() {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    url: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Video data submitted:', formData);
    // Here, you can send formData to a server or handle as necessary
  };

  return (
    <div className="video-upload-container" style={{ padding: '20px' }}>
      <h1>Upload Video</h1>
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '10px' }}>
          <label>
            Name:
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              style={{ marginLeft: '10px' }}
            />
          </label>
        </div>
        <div style={{ marginBottom: '10px' }}>
          <label>
            Description:
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows="4"
              style={{ marginLeft: '10px' }}
            ></textarea>
          </label>
        </div>
        <div style={{ marginBottom: '20px' }}>
          <label>
            URL:
            <input
              type="text"
              name="url"
              value={formData.url}
              onChange={handleChange}
              style={{ marginLeft: '10px' }}
            />
          </label>
        </div>
        <button type="submit">Upload</button>
      </form>
    </div>
  );
}

export default VideoUploadPage;
