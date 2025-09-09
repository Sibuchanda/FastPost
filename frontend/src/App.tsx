import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import './App.css'

import ChatApp from './chat/ChatApp'
import LoginPage from './auth/LoginPage';
import VerifyPage from './verify/VerifyPage';
import ProfilePage from './profile/ProfilePage';
import SignupPage from './auth/SignupPage';
import ForgotPassword from './auth/ForgotPassword';
import ResetPassword from './auth/ResetPassword';


function App() {
  
  const router = createBrowserRouter([
    {
      path: "/",
      element: <SignupPage/>
    },
    {
      path: "/login",
      element: <LoginPage/>
    },
    {
      path: "/signup",
      element: <SignupPage/>
    },
    {
      path: "/verify",
      element: <VerifyPage/>
    },
    {
      path: "/chat",
      element: <ChatApp/>
    },
    {
      path: "/profile",
      element: <ProfilePage/>
    },
    {
      path: "/forgotpassword",
      element: <ForgotPassword/>
    },
    {
      path: "/resetpassword",
      element: <ResetPassword/>
    }
  ]);

  return (
   <div className='h-full'>
    <RouterProvider router={router}></RouterProvider>
   </div>
  )
}

export default App;
