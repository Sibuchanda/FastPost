import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import './App.css'

import ChatApp from './chat/ChatApp'
import LoginPage from './login/LoginPage';
import VerifyPage from './verify/VerifyPage';


function App() {
  
  const router = createBrowserRouter([
    {
      path: "/",
      element: <LoginPage/>
    },
    {
      path: "/login",
      element: <LoginPage/>
    },
    {
      path: "/verify",
      element: <VerifyPage/>
    },
    {
      path: "/chat",
      element: <ChatApp/>
    }
  ]);

  return (
   <div className='h-full'>
    <RouterProvider router={router}></RouterProvider>
   </div>
  )
}

export default App;
