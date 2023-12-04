import "./Nav.scss";

function Nav() {
    return (
        <nav>
            <ul>
                {/* Common Routes */}
                <li><a href="/home">Home</a></li>
                <li><a href="/signup">Sign Up</a></li>
                <li><a href="/login">Login</a></li>
                <li><a href="/actors">Actors</a></li>
                
                {/* Routes for Contestants */}
                <li><a href="/contestant/dashboard">Contestant Dashboard</a></li>
                <li><a href="/contestant/upload">Video Upload</a></li>
                <li><a href="/contestant/update-profile">Update Profile</a></li>
           
            </ul>
        </nav>
    );
}

export default Nav;
