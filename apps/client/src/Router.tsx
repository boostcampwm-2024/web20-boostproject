import { createBrowserRouter } from 'react-router-dom';
import App from './App';
import Home from '@pages/Home';
import Profile from '@pages/Profile';
import Streaming from '@pages/Streaming';

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
        path: 'streaming',
        element: <Streaming />,
      },
    ],
  },
]);

export default router;
