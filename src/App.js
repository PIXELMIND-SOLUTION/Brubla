import logo from './logo.svg';
import './App.css';
import Home from './components/Home';
import { Route, Routes } from 'react-router-dom';
import ExclusivePage from './components/Exclusive';
import ExclusiveProductsPage from './components/ExclusiveProducts';
import SingleExclusiveProduct from './components/SingleExclusiveProduct';

function App() {
  return (
    <>
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/exclusive" element={<ExclusivePage/>} />
      <Route path="/exclusiveproducts" element={<ExclusiveProductsPage/>} /> 
      <Route path="/exclusiveproducts/:id" element={<SingleExclusiveProduct/>} />
    </Routes>
    </>
  );
}


export default App;
