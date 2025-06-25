# 🎨 Real-Time Collaborative Whiteboard

A modern, feature-rich collaborative whiteboard application built with React, Node.js, and Socket.IO. Create, share, and collaborate on digital whiteboards in real-time with multiple users.

![Whiteboard Demo](https://img.shields.io/badge/Status-Live-brightgreen)
![React](https://img.shields.io/badge/React-18.2.0-blue)
![Node.js](https://img.shields.io/badge/Node.js-Express-green)
![Socket.IO](https://img.shields.io/badge/Socket.IO-4.8.1-orange)
![MongoDB](https://img.shields.io/badge/MongoDB-Mongoose-blue)

## ✨ Features

### Core Drawing Tools

- **Freehand Brush**: Natural drawing with smooth strokes using Perfect Freehand
- **Geometric Shapes**: Lines, rectangles, circles with precise rendering via RoughJS
- **Arrows**: Directional arrows for diagrams and flowcharts
- **Text Tool**: Add text annotations with customizable font sizes
- **Eraser**: Remove elements with precision

### Advanced Styling

- **Color Customization**: Full color picker for stroke and fill colors
- **Size Control**: Adjustable stroke width and text size
- **Fill Options**: Transparent or colored fills for shapes
- **Predefined Colors**: Quick access to common colors

### Real-Time Collaboration

- **Live Synchronization**: See others' drawings in real-time via Socket.IO
- **Multi-User Support**: Multiple users can draw simultaneously
- **Real-Time Comments**: Add and view comments instantly with persistent storage

### Canvas Management

- **Create & Save**: Create unlimited whiteboards
- **Share & Collaborate**: Share canvases with specific users by email
- **Canvas List**: View all your canvases and shared ones
- **Rename & Delete**: Edit canvas names inline and delete canvases

### History & Undo/Redo

- **Undo/Redo**: Ctrl+Z and Ctrl+Y keyboard shortcuts
- **Action History**: Track all drawing actions with React Context

### User Authentication

- **Secure Registration**: Email validation and strong password requirements
- **JWT Authentication**: Secure token-based authentication
- **User Profiles**: Personalized experience with user accounts

### Modern UI/UX

- **Tailwind CSS**: Modern, utility-first styling
- **React Icons**: Beautiful, consistent iconography
- **Intuitive Interface**: Easy-to-use drawing tools and controls

## 🛠️ Technology Stack

### Frontend

- **React 18.2.0** - Modern UI framework with hooks and context
- **Socket.IO Client** - Real-time communication
- **Perfect Freehand** - Smooth freehand drawing
- **RoughJS** - Hand-drawn style geometric shapes
- **Tailwind CSS** - Utility-first CSS framework
- **React Router DOM** - Client-side routing
- **React Icons** - Icon library

### Backend

- **Node.js** - JavaScript runtime
- **Express.js** - Web application framework
- **Socket.IO** - Real-time bidirectional communication
- **MongoDB** - NoSQL database
- **Mongoose** - MongoDB object modeling
- **JWT** - JSON Web Token authentication
- **bcrypt** - Password hashing
- **CORS** - Cross-origin resource sharing

### Development Tools

- **Nodemon** - Auto-restart server during development
- **Create React App** - React development environment
- **ESLint** - Code linting and formatting

## 🚀 Getting Started

### Prerequisites

- Node.js (v14 or higher)
- MongoDB (local or cloud instance)
- npm or yarn package manager

### Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/Meet1306/Whiteboard
   ```

2. **Install Backend Dependencies**

   ```bash
   cd Backend
   npm install
   ```

3. **Install Frontend Dependencies**

   ```bash
   cd ../Frontend
   npm install
   ```

4. **Environment Setup**

   Create a `.env` file in the Backend directory:

   ```env
   MONGO_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret_key
   PORT=5000
   ```

5. **Start the Development Servers**

   **Backend (Terminal 1):**

   ```bash
   cd Backend
   npm run dev
   ```

   **Frontend (Terminal 2):**

   ```bash
   cd Frontend
   npm start
   ```

6. **Access the Application**
   - Frontend: https://sketch-sphere-seven.vercel.app/
   - Backend API: https://sketch-sphere-api.onrender.com

## 📖 Usage Guide

### Creating Your First Canvas

1. Register or login to your account
2. Click "Create New Canvas" on the dashboard
3. Give your canvas a meaningful name
4. Start drawing with the available tools

### Drawing Tools

- **Brush Tool**: Click and drag for freehand drawing
- **Line Tool**: Click and drag to create straight lines
- **Rectangle Tool**: Click and drag to create rectangles
- **Circle Tool**: Click and drag to create ellipses
- **Arrow Tool**: Click and drag to create directional arrows
- **Text Tool**: Click anywhere to add text
- **Eraser Tool**: Click on elements to remove them

### Collaboration Features

1. **Share Canvas**: Click the share button and enter email addresses
2. **Real-Time Drawing**: All users see changes instantly
3. **Comments**: Use the comment panel for discussions
4. **Canvas Management**: Rename, delete, and manage your canvases

### Keyboard Shortcuts

- `Ctrl + Z`: Undo last action
- `Ctrl + Y`: Redo last action

## 🔧 API Endpoints

### Authentication

- `POST /api/user/register` - User registration
- `POST /api/user/login` - User login

### Canvas Management

- `GET /api/canvas/getCanvas` - Get user's canvases
- `POST /api/canvas/createCanvas` - Create new canvas
- `GET /api/canvas/load/:canvasId` - Get specific canvas
- `PUT /api/canvas/update/:canvasId` - Update canvas elements
- `DELETE /api/canvas/deleteCanvas/:canvasId` - Delete canvas
- `PATCH /api/canvas/update/canvasName/:canvasId` - Rename canvas
- `PUT /api/canvas/shareWith/:canvasId` - Share canvas
- `PUT /api/canvas/UnshareWith/:canvasId` - Unshare canvas

### Real-Time Events

- `join-canvas` - Join a canvas room
- `load-canvas` - Load canvas data
- `update-canvas` - Update canvas elements
- `add-comment` - Add new comment
- `load-comments` - Load canvas comments

## 🚀 Deployment

### Backend Deployment

1. Set up environment variables on your hosting platform
2. Deploy to platforms like Heroku, Railway, or DigitalOcean
3. Configure MongoDB connection

### Frontend Deployment

1. Build the production version: `npm run build`
2. Deploy to platforms like Vercel, Netlify, or GitHub Pages
3. Update API endpoints to production URLs

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the ISC License.
