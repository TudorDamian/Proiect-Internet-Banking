import { RouterProvider } from 'react-router-dom';
import './App.css';
import { router } from './Router/router';

export const App = (): JSX.Element => {
  return <RouterProvider router={router} />
}

export default App;
