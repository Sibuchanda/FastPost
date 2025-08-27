import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import './App.css'

import ChatApp from './chat/ChatApp'
import LoginPage from './login/LoginPage';
import VerifyPage from './verify/VerifyPage';
import ProfilePage from './profile/ProfilePage';
import SignupPage from './login/SignupPage';


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
    }
  ]);

  return (
   <div className='h-full'>
    <RouterProvider router={router}></RouterProvider>
   </div>
  )
}

export default App;
