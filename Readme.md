# FastPost

A modern real-time chat application built with a **microservices architecture**, offering secure authentication, OTP-based password recovery, and seamless messaging between users.

This repository contains all backend and frontend services of the project.


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



