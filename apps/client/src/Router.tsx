import { createBrowserRouter } from 'react-router-dom';
import App from './App';
import Home from '@pages/Home';
import Profile from '@pages/Profile';
import Live from '@pages/Live';

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      {
        path: '',
        element: <Home />,
      },
      {
        path: 'profile',
        element: <Profile />,
      },
      {
        path: 'live',
        element: <Live />,
      },
    ],
  },
]);

export default router;
