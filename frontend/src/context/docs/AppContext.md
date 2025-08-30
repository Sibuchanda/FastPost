# AppContext

This manages **global state** in the React application using React Context.  
It handles user authentication, chat data, and user data, and makes them available across the app.


## AppProvider

`AppProvider` is a React component that wraps the application and provides state and functions via React Context.

### Props
- `children`: `ReactNode` – The React elements/components that will be wrapped inside this provider.

### State
- `user`: `User | null` – The logged-in user's data.
- `isAuth`: `boolean` – Tracks if the user is authenticated.
- `loading`: `boolean` – Tracks loading state during data fetching.
- `chats`: `Chats[] | null` – Stores all chat objects.
- `users`: `User[] | null` – Stores all users.

### Provides
- `user`, `setUser`
- `isAuth`, `setIsAuth`
- `loading`
- `chats`, `setChats`
- `users`
- `logoutUser`
- `fetchUsers`
- `fetchChats`


## fetchUser

Retrieves the currently logged-in user’s profile using the JWT token stored in cookies.

- **Parameters**
  - None
- **Returns**
  - `Promise<void>` : Updates `user`, `isAuth`, and `loading` state. Logs error if fetching fails.



## logoutUser

Logs the user out of the app.

- **Parameters**
  - None
- **Returns**
  - `Promise<void>` :  
    - Removes JWT token from cookies  
    - Resets `user` and `isAuth` state  
    - Shows a success toast



## fetchChats

Retrieves all chat conversations for the logged-in user.

- **Parameters**
  - None
- **Returns**
  - `Promise<void>` : Updates the `chats` state with the latest chat list. Logs error if fetching fails.


## fetchUsers

Retrieves all registered users from the backend.

- **Parameters**
  - None
- **Returns**
  - `Promise<void>` : Updates the `users` state with the list of users. Logs error if fetching fails.


## useEffect (Inside AppProvider)

On initial render (mount), it:
1. Calls `fetchUser` → Validates JWT token and loads logged-in user data.
2. Calls `fetchChats` → Loads all chat conversations.
3. Calls `fetchUsers` → Loads all registered users.


## useAppData

A **custom React hook** for accessing context values easily.

- **Returns**
  - `AppContextType` object containing:
    - `user`, `isAuth`, `loading`, `chats`, `users`
    - Functions: `setUser`, `setIsAuth`, `setChats`, `logoutUser`, `fetchChats`, `fetchUsers`
- **Notes**
  - Throws an error if used outside `<AppProvider>`.


