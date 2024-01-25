import './VideoUploadPage.scss';
import UploadForm from '../../components/UploadForm/UploadForm';

function VideoUploadPage({ URL }) {
  
  return (
    <div className="form-background-upload">
    <UploadForm URL={URL}/>
  
</div>
  );
}

export default VideoUploadPage;
