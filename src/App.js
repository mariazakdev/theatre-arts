import './App.scss';
import Header from './components/Header/Header';
import HomePage from './pages/HomePage/HomePage';
import Login from './pages/LoginPage/LoginPage';
import Footer from './components/Footer/Footer';


function App() {
  return (
    <main className="App">
      <Header />
      <HomePage/>
      <Login/>
      <Footer />
    </main>
  );
}

export default App;
