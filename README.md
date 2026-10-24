# MERN Task Manager — Web Lab Practical 20

Ready-made MERN Task Manager for practical examination.

## Features
- React frontend
- Express + Node.js backend
- MongoDB + Mongoose
- Create, read, update, delete tasks
- Environment variables
- CORS enabled
- Deployment-ready structure

## Project structure

mern-task-manager/
  frontend/
  backend/

## Run locally

### Backend
```bash
cd backend
npm install
```

Copy `.env.example` to `.env` and set:
```env
MONGO_URI=your_mongodb_connection_string
PORT=5000
```

Then:
```bash
npm start
```

Backend: http://localhost:5000

### Frontend
Open another terminal:
```bash
cd frontend
npm install
```

Create `.env` from `.env.example`:
```env
VITE_API_URL=http://localhost:5000/api
```

Then:
```bash
npm run dev
```

Open the URL shown by Vite.

## MongoDB
Use MongoDB Atlas or a local MongoDB server. For Atlas, create a database user, allow your IP/network access, and copy the connection string into `backend/.env`.

## Deployment
1. Deploy `backend` as a Node/Express web service.
2. Add `MONGO_URI` and `PORT` environment variables on the backend host.
3. Deploy `frontend` as a static/Vite site.
4. Set `VITE_API_URL` to the deployed backend URL plus `/api`.
5. Open the live frontend and demonstrate Add, Update, and Delete.

## Practical demonstration
- Add a task
- Edit/update the task
- Delete the task
- Refresh the page to show MongoDB persistence
