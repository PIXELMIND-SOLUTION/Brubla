import logo from './logo.svg';
import './App.css';
import Home from './components/Home';
import { Route, Routes } from 'react-router-dom';
import ExclusivePage from './components/Exclusive';

function App() {
  return (
    <>
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/exclusive" element={<ExclusivePage/>} />
    </Routes>
    </>
  );
}


export default App;
