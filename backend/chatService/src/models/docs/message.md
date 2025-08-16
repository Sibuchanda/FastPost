# Messages Model — Documentation

The **Messages** model stores **each individual message** (text or image) that is sent inside a chat.




## **Fields**

| Field | Type | | Purpose in Simple Words |
|-------|------|-----------|--------------------------|
| `chatId` | `ObjectId` (ref: "Chat") |  | Links this message to the correct chat room in the **Chat** model. Without this, we won’t know which conversation this message belongs to. |
| `sender` | `string` |  | The person who sent the message (e.g., `"me"`). |
| `text` | `string` |  | The text of the message (only for text messages). Leave empty if sending an image. |
| `image` | `{ url: string, publicId: string }` |  | Info for image messages. `url` is the image location (e.g., Cloudinary link), and `publicId` is used for deleting or managing the image later. |
| `messageType` | `"text"` or `"image"` |  | Tells if the message is text or image. |
| `seen` | `boolean` |   | Shows if the receiver has opened/read this message. |
| `seenAt` | `Date` |  | The date & time when the message was read. |
| `createdAt` | `Date` |  | When the message was created/sent. |
| `updatedAt` | `Date` |  | When the message was last updated (e.g., marked as seen). |

---

## **Example Data**

### Text Message
```json
{
  "_id": "msg001",
  "chatId": "123chatIdWithBheem",
  "sender": "you",
  "text": "Hello Bheem!",
  "messageType": "text",
  "seen": false,
  "createdAt": "2025-08-13T12:00:00Z",
  "updatedAt": "2025-08-13T12:00:00Z"
}
