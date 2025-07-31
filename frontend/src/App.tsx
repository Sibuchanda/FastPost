import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import './App.css'

import ChatApp from './chat/ChatApp'

function App() {
  
  const router = createBrowserRouter([
    {
      path: "/",
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
