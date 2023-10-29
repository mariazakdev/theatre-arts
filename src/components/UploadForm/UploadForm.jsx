import React, { useState } from 'react';
import { auth } from '../../firebase';
import { currentUser } from 'firebase/auth';
import { useStripe, useElements } from "@stripe/react-stripe-js";
import { CardNumberElement, CardExpiryElement, CardCvcElement } from "@stripe/react-stripe-js";
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';

import "../../styles/forms.scss";

// photo upload
    const BUCKET_NAME = process.env.REACT_APP_AWS_BUCKET_NAME;
    const REGION = process.env.REACT_APP_AWS_REGION;
    const s3Client = new S3Client({ region: REGION}); 
    const MAX_SIZE = 5 * 1024 * 1024;


function UploadForm({backendURL}) {

    const [uploadStatus, setUploadStatus] = useState("idle");
    //payments
    const stripe = useStripe();
    const elements = useElements();
    
    const [formData, setFormData] = useState({
        photoUrl: '', // Keeping this, will be null for now.
        videoUrl: '',
        description: '',
        name: ''
    });

    const [hasPaid, setHasPaid] = useState(false);

    const CARD_STYLES = {
        style: {
            base: {
                color: "#32325d",
                fontFamily: '"Helvetica Neue", Helvetica, sans-serif',
                fontSmoothing: "antialiased",
                fontSize: "16px",
                "::placeholder": {
                    color: "#aab7c4"
                }
            },
            invalid: {
                color: "#fa755a",
                iconColor: "#fa755a"
            }
        }
    };

    const uploadToS3 = async (file) =>{
        setUploadStatus("uploading");

        try{
            const uploadKey = `${Date.now()}-${file.name}`;
            const command = new PutObjectCommand({
                Bucket: BUCKET_NAME,
                Key: uploadKey,
                Body: file
            });
            await s3Client.send(command);
            const fileURL = `https://${BUCKET_NAME}.s3.${REGION}.amazonaws.com/${uploadKey}`;
            setUploadStatus("success");
            return fileURL;
        }catch (error) {
            console.error("Error uploading to S3:", error);
            setUploadStatus("failed");

            return null;
        }
    };

    const compressImage = (file, callback) =>{
        const img =new Image();
        img.src =URL.createObjectURL(file);
        img.onload = () =>{
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

        const ctx =canvas.getContext("2d");
        ctx.drawImage(img, 0,0, width, height);

        //convert canvas into blob
        canvas.toBlob(callback, "image/jpeg", 0.7); 
        };
    };


    const handlePhotoChange = async (e) => {
        const file = e.target.files[0];
        compressImage(file, async (blob) => {
            const url = await uploadToS3(blob)
        });

        if (file.size > MAX_SIZE) {  // Assuming MAX_SIZE is defined
            alert("File is too large!");
            return;
        }
        if (!["image/jpeg", "image/png"].includes(file.type)) {
            alert("Invalid file type!");
            return;
        }

        const url = await uploadToS3(file);
        if (url) {
            setFormData(prevState => ({
                ...prevState, 
                photoUrl: url
            }));
        }
    }
    
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const user = auth.currentUser;
            if (user) {
                formData.firebaseId = user.uid;
                const response = await fetch(`${backendURL}/upload`, {
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

    // payments
    const handlePayment = async () => {
        console.log("handlePayment triggered");
    
        if (!stripe || !elements) {
            console.error("Stripe or Elements not loaded");
            return;
        }
    
        // Get individual card elements
        const cardNumberElement = elements.getElement(CardNumberElement);
        const cardExpiryElement = elements.getElement(CardExpiryElement);
        const cardCvcElement = elements.getElement(CardCvcElement);
    
        if (!cardNumberElement || !cardExpiryElement || !cardCvcElement) {
            console.error("Some card elements are not loaded correctly");
            return;
        }
    
        console.log("Creating token...");
    
        // Use the `createToken` function
        const result = await stripe.createToken(cardNumberElement);
    
        if (result.error) {
            console.error("Error creating token:", result.error.message);
        } else {
            console.log("Token created:", result.token);
    
            // Send token to your server to handle the actual payment process
            const user = auth.currentUser;
            if (user && user.email) {  // Ensure user and their email exists
                const paymentResponse = await fetch(`${backendURL}/payment`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        stripeToken: result.token.id,
                        email: user.email
                    })
                });
    
                const paymentResult = await paymentResponse.json();
                if (paymentResult.success) {
                    setHasPaid(true);
                } else {
                    console.error("Error during payment:", paymentResult.error);
                    // might add alert here later
                }
            } else {
                console.error("User not logged in or email not available");
            }
        }
    }
    return (
        <div className="form-container">
            <h2 className="form-container__title">Upload to Enter Contest</h2>
            
            {!hasPaid ? (
                <div className="form-container__payment-info">
                    <h3 className="form-container__instruction">Please pay to participate in the contest</h3>
                    <label>
                        Name on Card
                        <input 
                            className="form-container__input form-container__input--text"
                            type="text"
                            placeholder="Name"
                        />
                    </label>
                    <label>
                        Card number
                        <CardNumberElement options={CARD_STYLES} />
                    </label>
                    <label>
                        Expiration date
                        <CardExpiryElement options={CARD_STYLES} />
                    </label>
                    <label>
                        CVC
                        <CardCvcElement options={CARD_STYLES} />
                    </label>

                    <button className="form-container__form__submit-button" onClick={handlePayment}>Pay To Enter and Upload</button>

                    
                </div> 
            ) : (




                <form className="form-container__form" onSubmit={handleSubmit}>
                    <div>
    {uploadStatus === "uploading" && <p>Uploading...</p>}
    {uploadStatus === "success" && <p>Upload Successful!</p>}
    {uploadStatus === "failed" && <p>Upload Failed. Please try again.</p>}
</div>
                    <div className="input-group">
                        <label>Upload Photo:</label>
                        <input 
                            type="file" 
                            accept="image/*" 
                            onChange={handlePhotoChange}
                        />
                    </div>

                    <div className="input-group">
                        <input
                            className="form-container__input form-container__input--text"
                            type="text"
                            name="videoUrl"
                            placeholder="Video URL"
                            value={formData.videoUrl}
                            onChange={handleInputChange}
                        />
                    </div>

                    <div className="input-group">
                        <input
                            className="form-container__input form-container__input--text"
                            type="text"
                            name="description"
                            placeholder="Description"
                            value={formData.description}
                            onChange={handleInputChange}
                        />
                    </div>

                    <div className="input-group">
                        <input
                            className="form-container__input form-container__input--text"
                            type="text"
                            name="name"
                            placeholder="Name"
                            value={formData.name}
                            onChange={handleInputChange}
                        />
                    </div>

                    <button className="form-container__submit-button" type="submit">Submit</button>
                </form>
            )}
        </div>
    );
    
    
}

export default UploadForm;
