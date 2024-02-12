import UserProfile from '../../components/UserProfile/UserProfile';
import './ContestantDetailPage.scss'; 


export default function ContestantDetailPage( {URL, CLIENT_URL, groupedContestants }) {
  
  return (
    <div className="contestant-detail-page">
     
      <UserProfile />
    </div>
  )
}
