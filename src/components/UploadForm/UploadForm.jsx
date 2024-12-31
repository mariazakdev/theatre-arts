// import React, { useState, useEffect } from "react";
// import UploadFormRules from "./UploadFormRules";
// import ReactPlayer from "react-player";
// import "./UploadForm.scss";
// import { useAuth } from "../../contexts/AuthContext";
// import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
// import { useNavigate } from "react-router-dom";
// import "./UploadForm.scss";
// import axios from "axios";

// const BUCKET_NAME = process.env.REACT_APP_AWS_BUCKET_NAME;
// const REGION = process.env.REACT_APP_AWS_REGION;
// const ACCESS_KEY = process.env.REACT_APP_AWS_ACCESS_KEY_ID;
// const SECRET_KEY = process.env.REACT_APP_AWS_SECRET_ACCESS_KEY;

// const s3Client = new S3Client({
//   region: REGION,
//   credentials: {
//     accessKeyId: ACCESS_KEY,
//     secretAccessKey: SECRET_KEY,
//   },
// });

// function UploadForm({ URL, API_KEY }) {
//   const navigate = useNavigate();
//   const { currentUser } = useAuth();
//   const [uploadStatus, setUploadStatus] = useState("idle");
//   const [showConfirmationMessage, setShowConfirmationMessage] = useState(false);
//   const [imageFile, setImageFile] = useState(null);
//   const [imagePreview, setImagePreview] = useState(null);
//   const [videoPreviewUrl, setVideoPreviewUrl] = useState(null);
//   const [showVideoConfirmation, setShowVideoConfirmation] = useState(false);
//   const [videoConfirmed, setVideoConfirmed] = useState(false);
//   const [isAgreed, setIsAgreed] = useState(false);
//   const [charCount, setCharCount] = useState(0);

//   const [formData, setFormData] = useState({
//     photoUrl: "",
//     videoUrl: "",
//     description: "",
//     name: "",
//   });
//   const [isFormValid, setIsFormValid] = useState(false);

//   // If didn't pay, redirect to payment page, if paid, redirect to home
//   useEffect(() => {
//     const fetchUserData = async () => {
//       try {
//         const response = await axios.get(`${URL}/users/${currentUser.uid}`, {
//           headers: { Authorization: `${API_KEY}` },
//         });
//         const user = response.data.user;
//         if (user.uploadStatus === 1 && user.hasPaid === 1) {
//           navigate("/contestant/dashboard");
//         } else if (user.hasPaid === 0 && user.uploadStatus === 0) {
//           navigate("/contestant/enter");
//         } else if (user.hasPaid === 1 && user.uploadStatus === 0) {
//           navigate("/contestant/upload");
//         }
//       } catch (error) {
//         console.error("Error fetching user data:", error);
//       }
//     };

//     if (currentUser) {
//       fetchUserData();
//     } else {
//       navigate("/login");
//     }
//   }, [currentUser, navigate]);

//   useEffect(() => {
//     if (!currentUser) {
//       navigate("/login");
//     }
//   }, [currentUser, navigate]);

//   const handlePhotoChange = (e) => {
//     if (e.target.files[0]) {
//       setImageFile(e.target.files[0]);
//       setImagePreview(window.URL.createObjectURL(e.target.files[0]));
//     }
//   };

//   const handleConfirmPhoto = () => {
//     if (imageFile) {
//       compressImage(imageFile, (compressedImage) => {
//         if (compressedImage) {
//           setImageFile(compressedImage);
//           setShowConfirmationMessage(true);
//           setUploadStatus("ready");
//         } else {
//           alert("There was a problem with the image compression");
//         }
//       });
//     } else {
//       alert("No image file selected");
//     }
//   };

//   const compressImage = (file, callback) => {
//     const img = new Image();
//     img.src = window.URL.createObjectURL(file);
//     img.onload = () => {
//       const aspectRatio = img.height / img.width;
//       if (aspectRatio <= 1) {
//         alert(
//           "Please upload a portrait photo (height should be greater than width)."
//         );
//         callback(null);
//         return;
//       }
//       const canvas = document.createElement("canvas");
//       const MAX_WIDTH = 400;
//       const MAX_HEIGHT = 400;
//       let width = img.width;
//       let height = img.height;
//       if (width > height) {
//         if (width > MAX_WIDTH) {
//           height *= MAX_WIDTH / width;
//           width = MAX_WIDTH;
//         }
//       } else {
//         if (height > MAX_HEIGHT) {
//           width *= MAX_HEIGHT / height;
//           height = MAX_HEIGHT;
//         }
//       }
//       canvas.width = width;
//       canvas.height = height;
//       const ctx = canvas.getContext("2d");
//       ctx.drawImage(img, 0, 0, width, height);
//       canvas.toBlob(callback, "image/jpeg", 0.7);
//     };
//   };

//   const uploadToS3 = async (file) => {
//     setUploadStatus("uploading");
//     const uploadKey = `uploads/${currentUser.uid}/${Date.now()}-${file.name}`;
//     const command = new PutObjectCommand({
//       Bucket: BUCKET_NAME,
//       Key: uploadKey,
//       Body: file,
//     });
//     try {
//       await s3Client.send(command);
//       const fileURL = `https://${BUCKET_NAME}.s3.${REGION}.amazonaws.com/${uploadKey}`;
//       setUploadStatus("success");
//       return fileURL;
//     } catch (error) {
//       console.error("Error uploading to S3:", error);
//       setUploadStatus("failed");
//       return null;
//     }
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     if (uploadStatus !== "ready") {
//       alert("Please confirm the photo before submitting.");
//       return;
//     }
//     if (uploadStatus !== "ready" || !videoConfirmed) {
//       alert("Please confirm the photo and video before submitting.");
//       return;
//     }
//     // Upload the image to S3
//     const photoUrl = await uploadToS3(imageFile);
//     if (!photoUrl) {
//       alert("Failed to upload the image to S3");
//       return;
//     }
//     // Validate required fields
//     if (
//       !formData.name ||
//       !formData.description ||
//       !formData.videoUrl ||
//       !imageFile ||
//       uploadStatus !== "ready"
//     ) {
//       alert(
//         "Please fill in all the required fields and confirm the photo before submitting."
//       );
//       return;
//     }
//     // Submit the form
//     const payload = {
//       ...formData,
//       photoUrl,
//       firebaseId: currentUser ? currentUser.uid : null,
//     };

//     try {
//       const response = await axios.post(`${URL}/contestants`, payload, {
//         headers: { Authorization: `${API_KEY}` },
//       });

//       // Update user's upload status to 1
//       const updateResponse = await axios.put(
//         `${URL}/users/upload-status/${currentUser.uid}`,
//         { uploadStatus: 1 },
//         { headers: { Authorization: `${API_KEY}` } }
//       );

//       if (updateResponse.status === 200) {
//         navigate("/contestant/dashboard");
//       } else {
//         throw new Error("Failed to update user's upload status");
//       }
//     } catch (error) {
//       console.error("Error submitting form:", error);
//       alert("There was an error submitting the form. Please try again.");
//     }
//   };


//   const handleInputChange = (e) => {
//     const { name, value } = e.target;
//     if (name === "description") {
//       if (value.length <= 400) {
//         setFormData((prevState) => ({
//           ...prevState,
//           [name]: value,
//         }));
//         setCharCount(value.length);
//       }
//     } else {
//       setFormData((prevState) => ({
//         ...prevState,
//         [name]: value,
//       }));
//     }
//   };
//   const handleVideoChange = (e) => {
//     const videoUrl = e.target.value;
//     setFormData((prevState) => ({
//       ...prevState,
//       videoUrl: videoUrl,
//     }));
//     setVideoPreviewUrl(videoUrl); // Set the video preview URL
//     setShowVideoConfirmation(true); // Show the video confirmation message
//   };

//   // Agree to the rules
//   const handleAgreeChange = () => {
//     setIsAgreed(!isAgreed);
//   };

//   useEffect(() => {
//     const isFormValid =
//       formData.name &&
//       formData.description &&
//       formData.videoUrl &&
//       imageFile &&
//       uploadStatus === "ready";
//     setIsFormValid(isFormValid);
//   }, [formData, imageFile, uploadStatus]);

//   return (
//     <div className="form-background-upload">
//       <div className="form-container">
//         <h2 className="form-container__title">Upload to Enter Contest</h2>
//         <form className="form-container__form" onSubmit={handleSubmit}>
//           {uploadStatus === "uploading" && <p>Uploading...</p>}
//           {uploadStatus === "success" && <p>Upload Successful!</p>}
//           {uploadStatus === "failed" && <p>Upload Failed. Please try again.</p>}
//           {showConfirmationMessage && (
//             <h4 className="flash-message">Photo Confirmed!</h4>
//           )}

//           <div className="input-group">
//             <label>Upload Photo:</label>
//             <input type="file" accept="image/*" onChange={handlePhotoChange} />
//             {imagePreview && (
//               <div>
//                 <img
//                   src={imagePreview}
//                   alt="Selected Preview"
//                   style={{ maxWidth: "100%", maxHeight: "300px" }}
//                 />
//                 <button type="button" onClick={handleConfirmPhoto}>
//                   Confirm Photo
//                 </button>
//               </div>
//             )}
//           </div>
//           <p>
//             Photo instructions: Portrait, full body shot. It remains the same
//             and is the purpose of indentification throughout the competition.
//             Unable to change after submission.{" "}
//           </p>
//           <div className="input-group">
//             <label>Video URL:</label>
//             <input
//               className="form-container__input"
//               type="text"
//               name="videoUrl"
//               placeholder="Video URL"
//               value={formData.videoUrl}
//               onChange={handleVideoChange}
//             />
//             {videoPreviewUrl && (
//               <div>
//                 <ReactPlayer
//                   url={videoPreviewUrl}
//                   controls
//                   width="100%"
//                   height="300px"
//                 />
//                 <p>Video Preview</p>
//               </div>
//             )}
//             {showVideoConfirmation && !videoConfirmed && (
//               <button
//                 className="form-container__confirm-button"
//                 onClick={() => setVideoConfirmed(true)}
//               >
//                 Confirm Video
//               </button>
//             )}
//           </div>
//           <p>Only <strong>Youtube and Vimeo </strong> accepted.</p>
//           <p>Please play through the video to make sure you approve of it. You will not be able to change it till next round.</p>
//           <p>Make sure that embeding is allowed.</p>
//           <p>Choose a nice thumbnail in the site where you uploaded the video.</p>
//           <p>You may only change the video at the beginning of each round.</p>
//           <p>
//             Please note that the video once uploaded will{" "}
//             <strong>stop playing at exactly 60 seconds.</strong>
//           </p>
//           <div className="input-group">


//             <div className="form-container__char-count">
//               {charCount} / 400 characters
//             </div>
//             <textarea
//               className="form-container__input"
//               name="description"
//               placeholder="Tell us about yourself"
//               value={formData.description}
//               onChange={handleInputChange}
//               maxLength="600"

//             />
//           </div>
//           <div className="input-group">
//             <input
//               className="form-container__input"
//               type="text"
//               name="name"
//               placeholder="Name"
//               value={formData.name}
//               onChange={handleInputChange}
//             />
//           </div>
//           <UploadFormRules onAgree={handleAgreeChange} isAgreed={isAgreed} />

//           <button
//             className="form-container__submit-button"
//             type="submit"
//             disabled={!isFormValid}
//           >
//             Submit
//           </button>
//         </form>
//       </div>
//     </div>
//   );
// }

// export default UploadForm;


import React, { useState, useEffect, useRef } from "react";
import UploadFormRules from "./UploadFormRules";
import ReactPlayer from "react-player";
import "./UploadForm.scss";
import { useAuth } from "../../contexts/AuthContext";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { useNavigate } from "react-router-dom";
import axios from "axios";

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

function UploadForm({ URL, API_KEY }) {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const playerRef = useRef(null);

  const [uploadStatus, setUploadStatus] = useState("idle");
  const [showConfirmationMessage, setShowConfirmationMessage] = useState(false);
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [videoPreviewUrl, setVideoPreviewUrl] = useState(null);
  const [showVideoConfirmation, setShowVideoConfirmation] = useState(false);
  const [videoConfirmed, setVideoConfirmed] = useState(false);
  const [isAgreed, setIsAgreed] = useState(false);
  const [charCount, setCharCount] = useState(0);

  const [formData, setFormData] = useState({
    photoUrl: "",
    videoUrl: "",
    description: "",
    name: "",
  });
  const [isFormValid, setIsFormValid] = useState(false);

  // URL validation for YouTube and Vimeo
  const isValidVideoUrl = (url) => {
    const youtubeRegex = /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.be)\/.+$/;
    const vimeoRegex = /^(https?:\/\/)?(www\.)?vimeo\.com\/.+$/;
    return youtubeRegex.test(url) || vimeoRegex.test(url);
  };

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axios.get(`${URL}/users/${currentUser.uid}`, {
          headers: { Authorization: `${API_KEY}` },
        });
        const user = response.data.user;
        if (user.uploadStatus === 1 && user.hasPaid === 1) {
          navigate("/contestant/dashboard");
        } else if (user.hasPaid === 0 && user.uploadStatus === 0) {
          navigate("/contestant/enter");
        } else if (user.hasPaid === 1 && user.uploadStatus === 0) {
          navigate("/contestant/upload");
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    if (currentUser) {
      fetchUserData();
    } else {
      navigate("/login");
    }
  }, [currentUser, navigate]);

  const handlePhotoChange = (e) => {
    if (e.target.files[0]) {
      setImageFile(e.target.files[0]);
      setImagePreview(window.URL.createObjectURL(e.target.files[0]));
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
    img.src = window.URL.createObjectURL(file);
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

    if (!videoConfirmed) {
      alert("Please confirm the video before submitting.");
      return;
    }
    
    const photoUrl = await uploadToS3(imageFile);
    if (!photoUrl) {
      alert("Failed to upload the image to S3");
      return;
    }

    if (!formData.name || !formData.description || !isValidVideoUrl(formData.videoUrl)) {
      alert("Please fill in all fields with valid data.");
      return;
    }

    const payload = {
      ...formData,
      photoUrl,
      firebaseId: currentUser ? currentUser.uid : null,
    };

    try {
      await axios.post(`${URL}/contestants`, payload, {
        headers: { Authorization: `${API_KEY}` },
      });
      await axios.put(
        `${URL}/users/upload-status/${currentUser.uid}`,
        { uploadStatus: 1 },
        { headers: { Authorization: `${API_KEY}` } }
      );
      navigate("/contestant/dashboard");
    } catch (error) {
      console.error("Error submitting form:", error);
      alert("There was an error submitting the form. Please try again.");
    }
  };

  const handleVideoChange = (e) => {
    const videoUrl = e.target.value;
    if (isValidVideoUrl(videoUrl)) {
      setFormData((prevState) => ({
        ...prevState,
        videoUrl: videoUrl,
      }));
      setVideoPreviewUrl(videoUrl);
      setShowVideoConfirmation(true);
    } else {
      alert("Please provide a valid YouTube or Vimeo URL.");
    }
  };

  const handleVideoProgress = (state) => {
    if (state.playedSeconds >= 60) {
      alert("The video has reached the 60-second limit.");
      playerRef.current?.seekTo(0);
    }
  };

  useEffect(() => {
    const isFormValid =
      formData.name &&
      formData.description &&
      isValidVideoUrl(formData.videoUrl) &&
      imageFile &&
      uploadStatus === "ready" &&
      videoConfirmed;
    setIsFormValid(isFormValid);
  }, [formData, imageFile, uploadStatus, videoConfirmed]);

  return (
    <div className="form-background-upload">
      <div className="form-container">
        <h2 className="form-container__title">Upload to Enter Contest</h2>
        <form className="form-container__form" onSubmit={handleSubmit}>
          {uploadStatus === "uploading" && <p>Uploading...</p>}
          {uploadStatus === "success" && <p>Upload Successful!</p>}
          {uploadStatus === "failed" && <p>Upload Failed. Please try again.</p>}
          {showConfirmationMessage && (
            <h4 className="flash-message">Photo Confirmed!</h4>
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
          <p>
            Photo instructions: Portrait, full body shot. It remains the same
            and is the purpose of identification throughout the competition.
            Unable to change after submission.
          </p>

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
                  ref={playerRef}
                  url={videoPreviewUrl}
                  controls
                  width="100%"
                  height="300px"
                  onProgress={handleVideoProgress}
                  onError={() =>
                    alert("The video could not be loaded. Please check the URL.")
                  }
                />
                <p>Video Preview</p>
              </div>
            )}
            {showVideoConfirmation && !videoConfirmed && (
              <button
                className="form-container__confirm-button"
                onClick={() => setVideoConfirmed(true)}
              >
                Confirm Video
              </button>
            )}
          </div>

          <p>Only <strong>YouTube and Vimeo</strong> accepted.</p>
          <p>Please play through the video to make sure you approve of it. You will not be able to change it until the next round.</p>
          <p>Make sure that embedding is allowed.</p>

          <div className="input-group">
            <textarea
              className="form-container__input"
              name="description"
              placeholder="Tell us about yourself"
              value={formData.description}
              onChange={(e) => {
                const value = e.target.value;
                if (value.length <= 400) {
                  setFormData((prevState) => ({
                    ...prevState,
                    description: value,
                  }));
                  setCharCount(value.length);
                }
              }}
              maxLength="400"
            />
            <div className="form-container__char-count">
              {charCount} / 400 characters
            </div>
          </div>

          <div className="input-group">
            <input
              className="form-container__input"
              type="text"
              name="name"
              placeholder="Name"
              value={formData.name}
              onChange={(e) =>
                setFormData((prevState) => ({
                  ...prevState,
                  name: e.target.value,
                }))
              }
            />
          </div>

          <UploadFormRules onAgree={() => setIsAgreed(!isAgreed)} isAgreed={isAgreed} />

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
