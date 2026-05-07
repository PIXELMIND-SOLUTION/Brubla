import logo from './logo.svg';
import './App.css';
import Home from './components/Home';
import { Route, Routes, Navigate } from 'react-router-dom';
import ExclusivePage from './components/Exclusive';
import ExclusiveProductsPage from './components/ExclusiveProducts';
import SingleExclusiveProduct from './components/SingleExclusiveProduct';
import ProfilePage from './components/ProfilePage';
import ScrollToTop from './views/ScrollToTop';
import CategoriesGrid from './components/Categories';
import CategoryProductsPage from './pages/CategoryProductsPage';
import JoinUs from './pages/JoinUs';
import ProductDetails from './pages/ProductDetails';
import AllProducts from './pages/AllProducts';
import CartPage from './pages/CartPage';
import PersonalDetails from './pages/PersonalDetails';
import MyOrders from './pages/MyOrders';
import UserAddresses from './pages/UserAddresses';
import UserNotifications from './pages/UserNotifications';
import Collections from './pages/Collections';
import SingleCollectionProducts from './pages/SingleCollectionProducts';
import { WeddingPlannerPage } from './pages/WeddingPlanner';
import BrublaLogin from './components/Login';

/* =========================
   PRIVATE ROUTE COMPONENT
========================= */

const PrivateRoute = ({ children }) => {
  const token = sessionStorage.getItem("authToken");

  return token ? children : <Navigate to="/" replace />;
};

function App() {
  return (
    <>
      <ScrollToTop />

      <Routes>

        {/* PUBLIC ROUTES */}
        <Route path="/" element={<BrublaLogin />} />

        {/* PRIVATE ROUTES */}
        <Route
          path="/home"
          element={
            <PrivateRoute>
              <Home />
            </PrivateRoute>
          }
        />

        <Route
          path="/exclusive"
          element={
            <PrivateRoute>
              <ExclusivePage />
            </PrivateRoute>
          }
        />

        <Route
          path="/exclusiveproducts"
          element={
            <PrivateRoute>
              <ExclusiveProductsPage />
            </PrivateRoute>
          }
        />

        <Route
          path="/exclusiveproducts/:id"
          element={
            <PrivateRoute>
              <SingleExclusiveProduct />
            </PrivateRoute>
          }
        />

        <Route
          path="/profile"
          element={
            <PrivateRoute>
              <ProfilePage />
            </PrivateRoute>
          }
        />

        <Route
          path="/category"
          element={
            <PrivateRoute>
              <CategoriesGrid />
            </PrivateRoute>
          }
        />

        <Route
          path="/products"
          element={
            <PrivateRoute>
              <AllProducts />
            </PrivateRoute>
          }
        />

        <Route
          path="/category/:name"
          element={
            <PrivateRoute>
              <CategoryProductsPage />
            </PrivateRoute>
          }
        />

        <Route
          path="/product/:id"
          element={
            <PrivateRoute>
              <ProductDetails />
            </PrivateRoute>
          }
        />

        <Route
          path="/joinUs"
          element={
            <PrivateRoute>
              <JoinUs />
            </PrivateRoute>
          }
        />

        <Route
          path="/mycart"
          element={
            <PrivateRoute>
              <CartPage />
            </PrivateRoute>
          }
        />

        <Route
          path="/profile/personal-details"
          element={
            <PrivateRoute>
              <PersonalDetails />
            </PrivateRoute>
          }
        />

        <Route
          path="/profile/my-orders"
          element={
            <PrivateRoute>
              <MyOrders />
            </PrivateRoute>
          }
        />

        <Route
          path="/profile/saved-addresses"
          element={
            <PrivateRoute>
              <UserAddresses />
            </PrivateRoute>
          }
        />

        <Route
          path="/profile/notifications"
          element={
            <PrivateRoute>
              <UserNotifications />
            </PrivateRoute>
          }
        />

        <Route
          path="/collections"
          element={
            <PrivateRoute>
              <Collections />
            </PrivateRoute>
          }
        />

        <Route
          path="/collections/:id"
          element={
            <PrivateRoute>
              <SingleCollectionProducts />
            </PrivateRoute>
          }
        />

        <Route
          path="/wedding"
          element={
            <PrivateRoute>
              <WeddingPlannerPage />
            </PrivateRoute>
          }
        />

      </Routes>
    </>
  );
}

export default App;