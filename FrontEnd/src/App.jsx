import { Outlet } from 'react-router-dom';
import './App.css';
import NavBarReact from './Components/NavBar/NavBar';
import Footer from './Components/Home/Footer';

function App() {
  return (
    <>
      <NavBarReact />
      <div className="min-h-[calc(100vh-78px)]">
        <Outlet />
      </div>
      <Footer />
    </>
  );
}

export default App;
