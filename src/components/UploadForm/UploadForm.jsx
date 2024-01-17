import React, { useState, useEffect } from "react";
import { auth } from "../../firebase";
import UploadFormRules from "./UploadFormRules";
import ReactPlayer from "react-player";
import './UploadForm.scss';
import { useAuth } from "../../contexts/AuthContext";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { useNavigate } from "react-router-dom";
import "./UploadForm.scss";

const BUCKET_NAME = process.env.REACT_APP_AWS_BUCKET_NAME;
const REGION = process.env.REACT_APP_AWS_REGION;
const ACCESS_KEY = process.env.REACT_APP_AWS_ACCESS_KEY_ID;
const SECRET_KEY = process.env.REACT_APP_AWS_SECRET_ACCESS_KEY;

const s3Client = new S3Client({
  region: REGION,
  credentials: {
    accessKeyId: ACCESS_KEY,
    secretAccessKey: SECRET_KEY,
  },
});

function UploadForm({ backendURL }) {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const [uploadStatus, setUploadStatus] = useState("idle");
  const [showConfirmationMessage, setShowConfirmationMessage] = useState(false);
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [videoPreviewUrl, setVideoPreviewUrl] = useState(null);
  const [isAgreed, setIsAgreed] = useState(false); // Agree to the rules
  const [formData, setFormData] = useState({
    photoUrl: "",
    videoUrl: "",
    description: "",
    name: "",
  });
  const [isFormValid, setIsFormValid] = useState(false);

  useEffect(() => {
    if (!currentUser) {
      navigate("/login");
    }
  }, [currentUser, navigate]);

  const handlePhotoChange = (e) => {
    if (e.target.files[0]) {
      setImageFile(e.target.files[0]);
      setImagePreview(URL.createObjectURL(e.target.files[0]));
    }
  };

  const handleConfirmPhoto = () => {
    if (imageFile) {
      compressImage(imageFile, (compressedImage) => {
        if (compressedImage) {
          setImageFile(compressedImage);
          setShowConfirmationMessage(true);
          setUploadStatus("ready");
        } else {
          alert("There was a problem with the image compression");
        }
      });
    } else {
      alert("No image file selected");
    }
  };

  const compressImage = (file, callback) => {
    const img = new Image();
    img.src = URL.createObjectURL(file);
    img.onload = () => {
      const aspectRatio = img.height / img.width;
      if (aspectRatio <= 1) {
        alert(
          "Please upload a portrait photo (height should be greater than width)."
        );
        callback(null);
        return;
      }
      const canvas = document.createElement("canvas");
      const MAX_WIDTH = 400;
      const MAX_HEIGHT = 400;
      let width = img.width;
      let height = img.height;
      if (width > height) {
        if (width > MAX_WIDTH) {
          height *= MAX_WIDTH / width;
          width = MAX_WIDTH;
        }
      } else {
        if (height > MAX_HEIGHT) {
          width *= MAX_HEIGHT / height;
          height = MAX_HEIGHT;
        }
      }
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext("2d");
      ctx.drawImage(img, 0, 0, width, height);
      canvas.toBlob(callback, "image/jpeg", 0.7);
    };
  };

  const uploadToS3 = async (file) => {
    setUploadStatus("uploading");
    const uploadKey = `uploads/${currentUser.uid}/${Date.now()}-${file.name}`;
    const command = new PutObjectCommand({
      Bucket: BUCKET_NAME,
      Key: uploadKey,
      Body: file,
    });
    try {
      await s3Client.send(command);
      const fileURL = `https://${BUCKET_NAME}.s3.${REGION}.amazonaws.com/${uploadKey}`;
      setUploadStatus("success");
      return fileURL;
    } catch (error) {
      console.error("Error uploading to S3:", error);
      setUploadStatus("failed");
      return null;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (uploadStatus !== "ready") {
      alert("Please confirm the photo before submitting.");
      return;
    }

    // Upload the image to S3
    const photoUrl = await uploadToS3(imageFile);
    if (!photoUrl) {
      alert("Failed to upload the image to S3");
      return;
    }
    // Validate required fields
    if (
      !formData.name ||
      !formData.description ||
      !formData.videoUrl ||
      !imageFile ||
      uploadStatus !== "ready"
    ) {
      alert("Please fill in all the required fields and confirm the photo before submitting.");
      return;
    }
    // Submit the form
    const payload = {
      ...formData,
      photoUrl,
      firebaseId: currentUser ? currentUser.uid : null,
    };

    try {
      const response = await fetch(`${backendURL}/contestants`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const result = await response.json();
      console.log("Upload result:", result);
      navigate("/contestant/dashboard");
    } catch (error) {
      console.error("Error submitting form:", error);
      alert("There was an error submitting the form. Please try again.");
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleVideoChange = (e) => {
    const videoUrl = e.target.value;
    setFormData((prevState) => ({
      ...prevState,
      videoUrl: videoUrl,
    }));
    setVideoPreviewUrl(videoUrl);
  };

  // Agree to the rules
  const handleAgreeChange = () => {
    setIsAgreed(!isAgreed);
  };

  useEffect(() => {
    const isFormValid =
      formData.name &&
      formData.description &&
      formData.videoUrl &&
      imageFile &&
      uploadStatus === "ready";
    setIsFormValid(isFormValid);
  }, [formData, imageFile, uploadStatus]);

  return (
    <div className="form-background-upload">
      <div className="form-container">
        <h2 className="form-container__title">Upload to Enter Contest</h2>
        <form className="form-container__form" onSubmit={handleSubmit}>
          {uploadStatus === "uploading" && <p>Uploading...</p>}
          {uploadStatus === "success" && <p>Upload Successful!</p>}
          {uploadStatus === "failed" && <p>Upload Failed. Please try again.</p>}
          {showConfirmationMessage && (
            <p className="flash-message">Photo Confirmed!</p>
          )}

          <div className="input-group">
            <label>Upload Photo:</label>
            <input type="file" accept="image/*" onChange={handlePhotoChange} />
            {imagePreview && (
              <div>
                <img
                  src={imagePreview}
                  alt="Selected Preview"
                  style={{ maxWidth: "100%", maxHeight: "300px" }}
                />
                <button type="button" onClick={handleConfirmPhoto}>
                  Confirm Photo
                </button>
              </div>
            )}
          </div>

          <div className="input-group">
            <label>Video URL:</label>
            <input
              className="form-container__input"
              type="text"
              name="videoUrl"
              placeholder="Video URL"
              value={formData.videoUrl}
              onChange={handleVideoChange}
            />
            {videoPreviewUrl && (
              <div>
                <ReactPlayer
                  url={videoPreviewUrl}
                  controls
                  width="100%"
                  height="300px"
                />
                <p>Video Preview</p>
              </div>
            )}
          </div>

          <div className="input-group">
            <textarea
              className="form-container__input"
              name="description"
              placeholder="Description"
              value={formData.description}
              onChange={handleInputChange}
            />
          </div>
          <div className="input-group">
            <input
              className="form-container__input"
              type="text"
              name="name"
              placeholder="Name"
              value={formData.name}
              onChange={handleInputChange}
            />
          </div>
          <UploadFormRules onAgree={handleAgreeChange} isAgreed={isAgreed} />

          <button
            className="form-container__submit-button"
            type="submit"
            disabled={!isFormValid}
          >
            Submit
          </button>
        </form>
      </div>
    </div>
  );
}

export default UploadForm;
