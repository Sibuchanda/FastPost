## createNewChat

`createNewChat` is an asynchronous function (wrapped with `TryCatch`) that creates a new chat between the authenticated user and another specified user. If a chat between these two users already exists, it returns the existing chat ID instead.

- Parameters  
  - `req`: `AuthenticatedRequest` – Express request object containing the authenticated user in `req.user` and `otherUserId` in `req.body`.  
  - `res`: `Response` – Express response object used to send the HTTP response.

- Returns  
  - `Promise<void>` : Sends `201` with new chat ID if created, `200` with existing chat ID if found, or `400` if parameters are missing.

---

## getAllChats

`getAllChats` is an asynchronous function (wrapped with `TryCatch`) that retrieves all chats for the authenticated user. It also fetches the other participant's details from the user service and counts unseen messages.

- Parameters  
  - `req`: `AuthenticatedRequest` – Express request object containing the authenticated user in `req.user`.  
  - `res`: `Response` – Express response object used to send the HTTP response.

- Returns  
  - `Promise<void>` : Sends a JSON array of chat objects containing chat details, other user info, latest message, and unseen message count.

---

## sendMessage

`sendMessage` is an asynchronous function (wrapped with `TryCatch`) that sends a text or image message in a specified chat. It validates chat membership, saves the message, and updates the chat’s latest message.

- Parameters  
  - `req`: `AuthenticatedRequest` – Express request object containing the authenticated user in `req.user`, `chatId` and `text` in `req.body`, and optionally an uploaded image file in `req.file`.  
  - `res`: `Response` – Express response object used to send the HTTP response.

- Returns  
  - `Promise<void>` : Sends `201` with the saved message data, or error codes if chat not found, unauthorized, or parameters are invalid.

---

## getMessagesByChat

`getMessagesByChat` is an asynchronous function (wrapped with `TryCatch`) that retrieves all messages in a given chat, marks unseen messages as seen, and fetches the other participant’s details from the user service.

- Parameters  
  - `req`: `AuthenticatedRequest` – Express request object containing the authenticated user in `req.user` and `chatId` in `req.params`.  
  - `res`: `Response` – Express response object used to send the HTTP response.

- Returns  
  - `Promise<void>` : Sends a JSON object containing the messages array and other user’s details, or appropriate error codes if unauthorized or chat not found.
