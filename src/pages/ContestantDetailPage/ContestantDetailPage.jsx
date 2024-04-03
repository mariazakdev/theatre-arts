import UserProfile from '../../components/UserProfile/UserProfile';
import './ContestantDetailPage.scss'; 


export default function ContestantDetailPage( {URL, CLIENT_URL, API_KEY}) {
  
  return (
    <div className="contestant-detail-page">
     
      <UserProfile API_KEY={API_KEY} URL={URL} CLIENT_URL={CLIENT_URL} />
    </div>
  )
}
