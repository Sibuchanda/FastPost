import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import './App.css'
import { Toaster } from 'react-hot-toast';

import ChatApp from './chat/ChatApp'
import LoginPage from './login/LoginPage';
// import VerifyPage from './verify/VerifyPage';
import VerifyOtp from './component/VerifyOtp';

function App() {
  
  const router = createBrowserRouter([
    {
      path: "/",
      element: <ChatApp/>
    },
    {
      path: "/login",
      element: <LoginPage/>
    },
    {
      path: "/verify",
      element: <VerifyOtp/>
    }
  ]);

  return (
   <div className='h-full'>
    <Toaster position="top-right" reverseOrder={false} />
    <RouterProvider router={router}></RouterProvider>
   </div>
  )
}

export default App;
