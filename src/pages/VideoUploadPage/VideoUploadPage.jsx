import React, { useState } from 'react';
import './VideoUploadPage.scss';
import UploadForm from '../../components/UploadForm/UploadForm';

function VideoUploadPage({backendURL}) {
  
  return (
<>
<UploadForm backendURL={backendURL}/>
</>
  );
}

export default VideoUploadPage;
