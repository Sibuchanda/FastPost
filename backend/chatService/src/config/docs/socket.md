# socket.js

This module sets up the **Socket.IO server** for real-time communication in the chat application.  
It manages user connections, tracks online users, handles chat room join/leave events, and provides typing indicators.


## const userSocketMap: Record<string, string> = {};
  - This is just a JavaScript object (like a dictionary). It is In-Memory data structure.
  - It stores a mapping of userId → socketId.
  - Why? Because in real-time chat, we need to know which socket connection belongs to which user.

 - Example : 
   - Suppose 2 users:
   - User A → userId = "123"
   - User B → userId = "456"
- When they connect to our chat server -->

```
 userSocketMap = {
  "123": "socketIdA",
  "456": "socketIdB"
}
```
---

## const userId = socket.handshake.query.userId as string | undefined;
When a Socket.IO client first connects, the browser does an HTTP handshake. socket.handshake holds metadata about that initial handshake. handshake.query is the query-string parameters the client sent while connecting.

 - Why it’s used ? Our frontend connects like -->
 ```
 io(chat_service, { query: { userId: user._id } });
```
 - So the server reads userId from that query so it can identify which application user is associated with this socket connection.

---

## io.emit("getOnlineUser", Object.keys(userSocketMap));
Sends the array of currently-online user IDs (keys of userSocketMap) to all connected clients.

 - Basically, it sends all userId from 'userSocketMap' map in array format so that the frontend can know the users that are online and the frontend can show online sign in the UI for the online users.

 - Example: with userSocketMap = { "123": "abcd1234", "456": "efgh5678" }
   - Object.keys(userSocketMap) → ["123","456"]
   - All clients get event: ("getOnlineUser", ["123","456"]).


---

##  if (userId) { socket.join(userId); }
The socket joins a Socket.IO room whose name is the userId. Rooms are a feature in Socket.IO that let us group sockets and broadcast to a group with io.to(roomName).emit(...).

- Why it helps:
  - If the same user connects from multiple devices, all that user’s sockets can join the room userId. Then sending to the room io.to(userId).emit('newMessage', msg) will reach all devices.

- Example:
  - User 123 connects on phone (socketA) and laptop (socketB).
  - Both socketA.join("123"), socketB.join("123").
  - Server does io.to("123").emit("newMessage", msg) → both phone and laptop receive it.

---

## getRecieverSocketId

`getRecieverSocketId` is a helper function that retrieves the socket ID of a given user if they are currently online.

- **Parameters**  
  - `recieverId: string` – The user ID whose socket ID is to be retrieved.  

- **Returns**  
  - `string | undefined` – The socket ID of the receiver if online, otherwise `undefined`.

---

## Connection Events

### `connection`
Triggered when a new client connects.  
- Maps the connected `userId` to their socket ID.  
- Emits the list of online users via `getOnlineUser`.  
- Automatically joins the socket to a personal room based on `userId`.

---

### `typing`
Triggered when a user starts typing in a chat.  
- **Emits** `userTyping` event to the chat room with `{ chatId, userId }`.

---

### `stopTyping`
Triggered when a user stops typing in a chat.  
- **Emits** `userStoppedTyping` event to the chat room with `{ chatId, userId }`.

---

### `joinChat`
Triggered when a user joins a chat room.  
- Adds the user’s socket to the given `chatId` room.  
- Logs the event.

---

### `leaveChat`
Triggered when a user leaves a chat room.  
- Removes the user’s socket from the given `chatId` room.  
- Logs the event.

---

### `disconnect`
Triggered when a user disconnects.  
- Removes the `userId` from the online users map.  
- Emits the updated online users list via `getOnlineUser`.  
- Logs the disconnection.

---

### `connect_error`
Triggered when there’s an error during socket connection.  
- Logs the error for debugging purposes.

---

## Exports
- `app` – Express application instance.  
- `server` – HTTP server instance wrapping the Express app.  
- `io` – Socket.IO server instance.  
- `getRecieverSocketId` – Utility function to fetch a user’s active socket ID.
