import MessagePopUp from "../../components/MessagePopUp/MessagePopUp";
import UserProfile from '../../components/UserProfile/UserProfile';
import './ContestantDetailPage.scss'; 


export default function ContestantDetailPage() {
  return (
    <div className="contestant-detail-page">
      <MessagePopUp />
      <UserProfile />
    </div>
  )
}
