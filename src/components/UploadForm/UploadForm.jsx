import React, { useState } from 'react';
import firebase from '../../firebase';
import "../../styles/forms.scss";

function UploadForm() {
  const [formData, setFormData] = useState({
    photoUrl: '',
    videoUrl: '',
    description: '',
    name: ''
  });

  const [file, setFile] = useState(null);
  const [hasPaid, setHasPaid] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) setFile(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const storageRef = firebase.storage().ref();
      const fileRef = storageRef.child(`photos/${file.name}`);
      await fileRef.put(file);
      const fileURL = await fileRef.getDownloadURL();

      formData.photoUrl = fileURL;

      const user = firebase.auth().currentUser;
      if (user) {
        formData.firebaseId = user.uid;
        const response = await fetch('YOUR_BACKEND_ROUTE', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(formData)
        });
        const result = await response.json();
        console.log(result);
      } else {
        console.log("User not logged in");
      }
    } catch (error) {
      console.error("Error submitting form:", error);
    }
  };

  return (
    <div className="form-container">                                            
      <h2 className="form-container__title">Upload to Enter Contest</h2>
      {!hasPaid ? (
        <div className="form-container__payment-info">
          <h3 className="form-container__instruction">Please pay to participate in the contest</h3>
          {/* Mock payment button */}
          <button className="form-container__pay-button" onClick={() => setHasPaid(true)}>Pay Now (Mock)</button>
        </div>
      ) : (
        <form className="form-container__form" onSubmit={handleSubmit}>
          <input
            className="form-container__input form-container__input--file"
            type="file"
            accept="image/*"
            onChange={handleFileChange}
          />
          <input
            className="form-container__input form-container__input--text"
            type="text"
            name="videoUrl"
            placeholder="Video URL"
            value={formData.videoUrl}
            onChange={handleInputChange}
          />
          <input
            className="form-container__input form-container__input--text"
            type="text"
            name="description"
            placeholder="Description"
            value={formData.description}
            onChange={handleInputChange}
          />
          <input
            className="form-container__input form-container__input--text"
            type="text"
            name="name"
            placeholder="Name"
            value={formData.name}
            onChange={handleInputChange}
          />
          <button className="form-container__submit-button" type="submit">Submit</button>
        </form>
      )}
    </div>
  );
}

export default UploadForm;
