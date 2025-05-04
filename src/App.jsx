import './index.css';

import { Menu } from './components/footer-menu/menu';
import { RutasPrivadas } from './routes/rutasGeneral';
import { Footer } from './components/footer-menu/footer';
import { ToastContainer } from 'react-toastify';

function App() {

  return (
    <>
   
        <Menu />
        <RutasPrivadas />
        <Footer />
        <ToastContainer />

    </>
  )
}

export default App
