import { RouterProvider } from 'react-router-dom';
import { routes } from '@/routes';
import './App.css';
import { PageHeaderProvider } from '@/contexts/PageHeaderContext';

function App() {
  return (
    <PageHeaderProvider>
      <RouterProvider router={routes} />
    </PageHeaderProvider>
  );
}

export default App;
