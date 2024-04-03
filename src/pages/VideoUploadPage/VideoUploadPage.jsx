import './VideoUploadPage.scss';
import UploadForm from '../../components/UploadForm/UploadForm';

function VideoUploadPage({ URL, API_KEY }) {
  
  return (
    <div className="form-background-upload">
    <UploadForm URL={URL} API_KEY={API_KEY}/>
  
</div>
  );
}

export default VideoUploadPage;
