import React, { useState } from 'react';
import './VideoUploadPage.scss';
import UploadForm from '../../components/UploadForm/UploadForm';
import UploadFormRules from '../../components/UploadForm/UploadFormRules';

function VideoUploadPage({backendURL}) {
  
  return (
    <div className="form-background-upload">
    <UploadForm backendURL={backendURL}/>
  
</div>
  );
}

export default VideoUploadPage;
