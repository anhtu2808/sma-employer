import { RouterProvider } from 'react-router-dom';
import { routes } from '@/routes';
import './App.css';
import { PageHeaderProvider } from '@/contexts/PageHeaderContext';
import { Toaster } from "react-hot-toast";
import { useNotificationSocket } from '@/hooks/useNotificationSocket';

function App() {
  useNotificationSocket();
  return (
    <>
      <Toaster
        position="bottom-right"
        toastOptions={{
          style: {
            background: "transparent",
            boxShadow: "none"
          }
        }}
      />
      <PageHeaderProvider>
        <RouterProvider router={routes} />
      </PageHeaderProvider>
    </>
  );
}

export default App;
