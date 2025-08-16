# Chat Models — Documentation

This document explains the **Chat** model  including the purpose of each field in simple language.

---

## **1. Chat Model**
This model stores **overall chat room details** between users.

### **Fields**
| Field | Type | Purpose |
|-------|------|---------|
| `users` | `string[]` | The list of people in this chat. Example: `["you", "bheem"]`. [ Each users filed contains maximum 2 user one is creator another is sender. Now if we chat with kalia then another user field will create `["you", "kalia"]`
| `latestMessage` | `{ text: string, sender: string }` | Stores the **most recent** message text and who sent it. This is used to quickly show a chat preview in the chat list without loading all messages. |
| `createdAt` | `Date` | The date & time when this chat was created. |
| `updatedAt` | `Date` | The date & time when this chat was last updated (e.g., new message sent). |

---

### **Example**
```json
{
  "_id": "123chatIdWithBheem",
  "users": ["you", "bheem"],
  "latestMessage": {
    "text": "What are you doing",
    "sender": "you"
  },
  "createdAt": "2025-08-13T12:00:00Z",
  "updatedAt": "2025-08-13T12:03:00Z"
}
