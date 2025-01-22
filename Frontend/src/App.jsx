import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import Login from './Components/Login'
import Signup from './Components/Signup'
import Timepass from './Components/Home'
import { createBrowserRouter, Outlet, RouterProvider } from'react-router-dom'
import ForgotPassword from './Components/ForgotPassword '
import ResetPassword from './Components/ResetPassword '
import Footer from './Components/Footer'
import Services from './Components/Services'
import About from './Components/About'
import Navbar from './Components/Navbar'
import CreateProductPage from './Components/CreateProductPage'
import ProductDetails from './Components/ProductDetails'
import CategoryPage from './Components/CategoryPage'
import DashBoard from './Components/DashBoard'
import UpdateProductPage from './Components/UpdateProductPage'
import Home from './Components/Home'
import DeleteProductPage from './Components/DeleteProductPage'
import Cart from './Components/Cart'

const Layout = () => {
  return (
    <>
      <Navbar />
      <main className="min-h-screen">
        <Outlet /> {/* Placeholder for nested routes */}
      </main>
      <Footer />
    </>
  );
};

const appRouter = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    children: [
      {
        path: '/',
        element: <Home />,
      },
      {
        path: 'login',
        element: <Login />,
      },
      {
        path: 'signup',
        element: <Signup />,
      },
      {
        path: 'forgot-password',
        element: <ForgotPassword />,
      },
      {
        path: 'reset-password/:token',
        element: <ResetPassword />,
      },
      {
        path: 'services',
        element: <Services />,
      },
      {
        path: 'about',
        element: <About />,
      },
      {
        path: 'create-product',
        element: <CreateProductPage />,
      },
      {
        path: '/product/:id',
        element: <ProductDetails />,
      },
      {
        path: '/category/:category',
        element: <CategoryPage />,
      },
      {
        path: '/dashboard',
        element: <DashBoard />,
      },
      {
        path: '/update-product/:productId',
        element: <UpdateProductPage />,
      },
      {
        path: '/delete-product/:productId',
        element: <DeleteProductPage />,
      },
      {
        path: '/cart',
        element: <Cart />,
      },
    ],
  },
]);

function App() {
  return <RouterProvider router={appRouter} />;
}

export default App;