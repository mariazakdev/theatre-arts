import './VideoUploadPage.scss';
import UploadForm from '../../components/UploadForm/UploadForm';

function VideoUploadPage({backendURL}) {
  
  return (
    <div className="form-background-upload">
    <UploadForm backendURL={backendURL}/>
  
</div>
  );
}

export default VideoUploadPage;
