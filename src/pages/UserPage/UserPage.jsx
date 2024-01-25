import ExtraVotes from "../../components/ExtraVotes/ExtraVotes";
import UserProfile from "../../components/UserProfile/UserProfile";

function UserPage( {URL, CLIENT_URL}) {
    return(
        <>
        <UserProfile URL={URL}/>    
        <ExtraVotes CLIENT_URL={CLIENT_URL}/></>
    )
};
export default UserPage;