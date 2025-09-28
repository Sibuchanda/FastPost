# FastPost

A modern real-time chat application built with a **microservices architecture**, offering secure authentication, OTP-based password recovery, and seamless messaging between users.

This repository contains all backend and frontend services of the project.

## Video
https://github.com/user-attachments/assets/9e48c4e0-1128-4669-a8f7-691c565d0776

## Screenshots
<img width="1920" height="878" alt="Screenshot (208)" src="https://github.com/user-attachments/assets/839b32c2-771d-4672-aef4-e0e57020b662" />
<img width="1920" height="875" alt="Screenshot (209)" src="https://github.com/user-attachments/assets/d45fe13d-1ca4-4236-95c2-dfc796ce0318" />
<img width="1920" height="888" alt="Screenshot (210)" src="https://github.com/user-attachments/assets/94a44d4f-b051-4fdc-ade1-c6e80e628f87" />
<img width="1920" height="872" alt="Screenshot (211)" src="https://github.com/user-attachments/assets/3c93477c-7e1d-4839-8785-b5b7c35d0204" />
<img width="1920" height="873" alt="Screenshot (212)" src="https://github.com/user-attachments/assets/83e573f9-2734-4e74-92cb-797e9e3b247f" />
<img width="1920" height="870" alt="Screenshot (213)" src="https://github.com/user-attachments/assets/b5a381e5-9485-429a-9c93-2658dc29a9cc" />
<img width="1920" height="879" alt="Screenshot (214)" src="https://github.com/user-attachments/assets/b8210e13-3b8e-4d44-9618-fca114fd3c7c" />
<img width="1920" height="872" alt="Screenshot (215)" src="https://github.com/user-attachments/assets/43d3fddb-b5e1-4855-862d-44ef2babdc0d" />
<img width="1920" height="871" alt="Screenshot (216)" src="https://github.com/user-attachments/assets/7ba592b7-ee79-4b22-84ab-034cead6c4a5" />



## ✨ Features

## Authentication
- User **Signup** with:
  - Email & Password
  - **reCAPTCHA** verification for spam/bot protection
  - OTP verification
- **Login / Sign In**
- **Forgot Password** with OTP-based reset
- JWT-based authentication stored in **HTTP-only cookies**

### Real-Time Chat
- One-to-one chat between users
- Realtime message delivery using **WebSocket**
- User online/offline/typing indicator 
- Unread message count badge


## 🚀 Tech Stack

### Frontend
- React + Vite
- Tailwind CSS
- TypeScript

### Backend
- Node.js + Express
- MongoDB
- Redis (for temporary OTP/user session caching)
- RabbitMQ ( Used as a message broker)
- Cloudinary (for media storage)

### Authentication
- JSON Web Tokens (JWT)
- SHA-256 + random salt (for password hashing)
- OTP-based verification system



##  🏗️ Microservices Structure

This repository is structured into **4 services**:

1. **User Service**  
   - Handles signup, login, OTP verification, password reset
   - Manages user profile data

2. **Chat Service**  
   - Handles creating and managing chat rooms
   - Stores messages and tracks unread counts
   - Provides real-time updates

3. **Mail Service**  
   - sending mail using Nodemailer

4. **React (Frontend)**
   - Frontend client built with React
   - Communicates with backend services through REST APIs



