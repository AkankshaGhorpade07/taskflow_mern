# TaskFlow — MERN Task Management App

A modern task management application built using the MERN stack. TaskFlow helps users organize their daily tasks, track completion status, and manage priorities through a clean and responsive interface.

## ✨ Features

- Add new tasks
- Edit and delete tasks
- Mark tasks as completed
- Set task priorities: High, Medium, and Low
- Filter and organize tasks
- Light and dark theme toggle
- Responsive user interface
- REST API integration
- MongoDB database for persistent storage

## 🛠️ Tech Stack

**Frontend**
- React.js
- Vite
- CSS

**Backend**
- Node.js
- Express.js
- REST API

**Database**
- MongoDB
- Mongoose

## 📁 Project Structure

```text
TaskFlow/
├── frontend/
│   ├── src/
│   │   ├── App.jsx
│   │   └── style.css
│   ├── package.json
│   └── .env
│
├── backend/
│   ├── models/
│   │   └── Task.js
│   ├── routes/
│   │   └── taskRoutes.js
│   ├── server.js
│   └── package.json
│
└── README.md
```

*Adjust the folder structure above if your actual project is organized differently.*

## 🚀 Getting Started

### Prerequisites

- Node.js and npm
- MongoDB local installation or MongoDB Atlas account

### 1. Clone the repository

```bash
git clone https://github.com/YOUR_USERNAME/taskflow-mern.git
cd taskflow-mern
```

### 2. Set up the backend

```bash
cd backend
npm install
```

Create a `.env` file in the backend folder:

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
```

Start the
