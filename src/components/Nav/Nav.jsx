import "./Nav.scss";

function Nav() {
    return (
        <nav>
            <ul>
                {/* Common Routes */}
                <li><a href="/home">Home</a></li>
                <li><a href="/signup">Sign Up</a></li>
                <li><a href="/login">Login</a></li>
                <li><a href="/forgot-password">Forgot Password</a></li>
                <li><a href="/actors">Actors</a></li>
                
                {/* Routes for Contestants */}
                <li><a href="/contestant/dashboard">Contestant Dashboard</a></li>
                <li><a href="/contestant/upload">Video Upload</a></li>
                <li><a href="/contestant/update-profile">Update Profile</a></li>
                
                {/* Routes for Voters */}
                <li><a href="/voter/dashboard">Voter Dashboard</a></li>
                <li><a href="/voter/vote">Vote</a></li>
                <li><a href="/voter/contestants">View Contestants</a></li>
                {/* Note: For individual contestant pages, you'd navigate by clicking on a contestant in the list, so I've not added a nav link here */}
            </ul>
        </nav>
    );
}

export default Nav;
