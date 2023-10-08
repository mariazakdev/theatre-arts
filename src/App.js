import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import Header from "./components/Header/Header";
import HomePage from './pages/HomePage/HomePage';
import Footer from './components/Footer/Footer';
import VideoUploadPage from './pages/VideoUploadPage/VideoUploadPage';
import UserPage from './pages/UserPage/UserPage';
import ActorsPage from './pages/ActorsPage/ActorsPage';
import LoginPage from './pages/LoginPage/LoginPage';
import SignUpPage from './pages/SignUpPage/SignUpPage';

function App() {
  return (
    <Router>
      <div className="App">
        <Header/>
        <Switch>
          <Route exact path="/" component={HomePage} />
          <Route path="/signup" component={SignUpPage} />
          <Route path="/login" component={LoginPage} />
          <Route path="/profile" component={UserPage} />
          <Route path="/actors" component={ActorsPage} />
          <Route path="/upload" component={VideoUploadPage} />
          {/* Catch-all route for 404 should be at the end */}
          <Route path="*" render={() => <div>404 Not Found</div>} />
        </Switch>
      </div>
    </Router>
  );
}

export default App;
