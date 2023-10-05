import './App.scss';
import Header from './components/Header/Header';
import HomePage from './pages/HomePage/HomePage';
import Login from './pages/LoginPage/LoginPage';
import Footer from './components/Footer/Footer';
import VideoUploadPage from './pages/VideoUploadPage/VideoUploadPage';
import UserPage from './pages/UserPage/UserPage';


function App() {
  return (
    <main className="App">
      <Header />
      <HomePage/>
      <Login/>
      <VideoUploadPage/>
      <UserPage />
      <Footer />
    </main>
  );
}

export default App;
