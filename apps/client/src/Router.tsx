import { createBrowserRouter } from 'react-router-dom';
import App from './App';
import Home from '@pages/Home';
import Profile from '@pages/Profile';
import Live from '@pages/Live';
import Broadcast from '@pages/Broadcast';
import Auth from '@pages/Auth';
import Record from '@pages/Record';
import ProtectedRoute from './ProtectedRoute';

const routerOptions = {
  future: {
    v7_startTransition: true,
    v7_relativeSplatPath: true,
    v7_fetcherPersist: true,
    v7_normalizeFormMethod: true,
    v7_partialHydration: true,
    v7_skipActionErrorRevalidation: true,
  },
};

const router = createBrowserRouter(
  [
    {
      path: '/',
      element: <App />,
      children: [
        {
          path: '',
          element: <Home />,
        },
        {
          path: 'live/:liveId',
          element: <Live />,
        },
        {
          path: 'auth',
          element: <Auth />,
        },
        {
          path: '',
          element: <ProtectedRoute />,
          children: [
            {
              path: 'profile',
              element: <Profile />,
            },

            {
              path: 'record/:attendanceId',
              element: <Record />,
            },
          ],
        },
      ],
    },
    {
      path: 'broadcast',
      element: <ProtectedRoute />,
      children: [
        {
          path: '',
          element: <Broadcast />,
        },
      ],
    },
  ],
  routerOptions,
);

export default router;
