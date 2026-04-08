import logo from './logo.svg';
import './App.css';
import Home from './components/Home';
import { Route, Routes } from 'react-router-dom';
import ExclusivePage from './components/Exclusive';
import ExclusiveProductsPage from './components/ExclusiveProducts';
import SingleExclusiveProduct from './components/SingleExclusiveProduct';
import ProfilePage from './components/ProfilePage';
import ScrollToTop from './views/ScrollToTop';
import CategorySection from './components/Category';
import CategoriesGrid from './components/Categories';
import CategoryProductsPage from './pages/CategoryProductsPage';
import JoinUs from './pages/JoinUs';
import ProductDetails from './pages/ProductDetails';
import AllProducts from './pages/AllProducts';

function App() {
  return (
    <>
    <ScrollToTop/>
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/exclusive" element={<ExclusivePage/>} />
      <Route path="/exclusiveproducts" element={<ExclusiveProductsPage/>} /> 
      <Route path="/exclusiveproducts/:id" element={<SingleExclusiveProduct/>} />
      <Route path="/profile" element={<ProfilePage/>} />
      <Route path="/category" element={<CategoriesGrid/>} />
      <Route path='/products' element={<AllProducts/>} />
      <Route path="/category/:name" element={<CategoryProductsPage/>} />
      <Route path="/product/:id" element={<ProductDetails />} />
      <Route path='/joinUs' element={<JoinUs/>} />
    </Routes>
    </>
  );
}


export default App;
