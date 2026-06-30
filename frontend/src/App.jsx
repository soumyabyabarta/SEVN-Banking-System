import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';

import AuthLayout from './layouts/AuthLayout';
import DashboardLayout from './layouts/DashboardLayout';
import ProtectedRoute from './components/ProtectedRoute';

import Landing from './pages/Landing';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Transfer from './pages/Transfer';
import History from './pages/History';

const router = createBrowserRouter([
  {
    path: '/',
    element: <Landing />,
  },
  {
    element: <AuthLayout />,
    children: [
      {
        path: '/login',
        element: <Login />,
      },
      {
        path: '/register',
        element: <Register />,
      },
    ],
  },
  {
    element: <ProtectedRoute />,
    children: [
      {
        element: <DashboardLayout />,
        children: [
          {
            path: '/dashboard',
            element: <Dashboard />,
          },
          {
            path: '/transfer',
            element: <Transfer />,
          },
          {
            path: '/history',
            element: <History />,
          },
        ],
      },
    ],
  },
]);

function App() {
  return (
    <>
      <RouterProvider router={router} />
      <Toaster 
        position="top-center"
        toastOptions={{
          duration: 4000,
          style: {
            background: '#0D3B2E',
            color: '#fff',
            borderRadius: '9999px',
            fontWeight: '600',
            padding: '16px 24px',
          },
          success: {
            iconTheme: {
              primary: '#A8FF35',
              secondary: '#0D3B2E',
            },
          },
        }}
      />
    </>
  );
}

export default App;
