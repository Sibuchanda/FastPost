# Documentation: Socket Connection Workflow in Chat Application

This document describes how the socket connection system works in the chat application. It covers how a user connects, how socketId and chatId are managed, and how the system ensures real-time communication.


## 1. Establishing a Connection

When a user opens the chat application, the frontend initializes a Socket.IO connection to the backend.

During this connection, the frontend sends the userId as a query parameter in the handshake.

On the backend, this userId is read from:

```ts
const userId = socket.handshake.query.userId;
```

The backend now knows which application user is associated with the new socket connection.


## 2. Mapping User to Socket

Each connected socket has a unique socket.id assigned by Socket.IO.

The backend maintains a mapping between userId and socket.id using an object called userSocketMap:

```ts
const userSocketMap: Record<string, string> = {};
userSocketMap[userId] = socket.id;
```

This mapping is important because it allows the server to identify which socket belongs to a specific user.

Example after two users connect:

```json
{
  "user123": "socketId_ABC",
  "user456": "socketId_XYZ"
}
```



## 3. Tracking Online Users

After mapping a user, the server broadcasts the updated list of online users to everyone:

```ts
io.emit("getOnlineUser", Object.keys(userSocketMap));
```

`Object.keys(userSocketMap)` gives an array of all currently online user IDs.

The frontend uses this event to update the UI (for example, showing online/offline status).


## 4. Joining User Rooms

Each socket is added to a personal room named after its userId:

```ts
socket.join(userId);
```

This allows the server to send messages to all devices of a user at once (if the same user logs in from multiple devices or tabs).

It also allows private delivery of events by targeting the room with:

```ts
io.to(userId).emit("event", data);
```


## 5. Typing Indicators

When a user starts typing, the frontend emits a typing event:

```ts
socket.emit("typing", { chatId, userId });
```

The server listens for this and forwards the event to others in the same chat room:

```ts
socket.to(chatId).emit("userTyping", { chatId, userId });
```

Similarly, when typing stops, the stopTyping event is broadcasted as `userStoppedTyping`.


## 6. Chat Room Management

When a user opens a chat, the frontend emits:

```ts
socket.emit("joinChat", chatId);
```

The server adds that socket to a chat room:

```ts
socket.join(chatId);
```

Messages sent to this chat can then be broadcast using:

```ts
io.to(chatId).emit("newMessage", message);
```

When the chat is closed, the socket leaves the room with:

```ts
socket.leave(chatId);
```


## 7. Disconnecting

When a socket disconnects:

- Its entry is removed from `userSocketMap`.
- The updated list of online users is broadcast to all clients.

```ts
delete userSocketMap[userId];
io.emit("getOnlineUser", Object.keys(userSocketMap));
```


## 8. Overall Workflow Summary

- User connects → `userId` is read from handshake.  
- Server maps `userId` to `socket.id` in `userSocketMap`.  
- Server broadcasts the updated online users list.  
- Socket joins:
  - A personal room named by `userId`.  
  - Any chat rooms the user enters (`chatId`).  
- Typing indicators and new messages are broadcast to the relevant chat rooms.  
- On disconnect, user is removed from `userSocketMap` and the online list is updated.  

---

## Key Points to Explain

- `userSocketMap` stores the relationship between users and their active socket connections.  
- `socket.id` is the unique connection identifier assigned by Socket.IO.  
- `userId` comes from the frontend during the handshake and is mapped to `socket.id`.  
- Rooms (`userId` and `chatId`) are used to efficiently send targeted messages.  
- Events (`typing`, `stopTyping`, `joinChat`, `newMessage`) are the building blocks of real-time features.  
- On disconnect, the user is removed from the map to keep the system clean.  
