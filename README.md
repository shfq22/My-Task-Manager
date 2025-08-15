# Task Manager - Full Stack Application

A full-stack task management system built with **MERN (MongoDB, Express, React, Node.js)** and styled using **Tailwind CSS**. It includes **role-based access**, task assignment with file uploads, and robust filtering capabilities. Designed for both admin and regular users.

---

## 🔗 Live Links

* **Frontend**: \https://task-manager-frontend-mocha-psi.vercel.app/
  (Note: Backend is deployed on render so sometimes it may take some time for login as the free service gets down after inactivity)
* **Backend API**: \https://taskmanagerbackend-nebt.onrender.com
* **Postman Docs**: \https://documenter.getpostman.com/view/44213060/2sB3BALrzc

---
## 🔐 Demo Credentials

### 👤 Admin
- Email: `admin@email.com`
- Password: `1234`

### 👥 User
- Email: `user@email.com`
- Password: `1234`
---

## 👥 Roles & Permissions

* **Admin**:

  * Can manage all users and tasks
  * Assign tasks with up to 3 documents
  * Delete or update any task or user
* **User**:

  * Can only view and complete tasks assigned to them
  * Cannot create or delete tasks/users

---

## 📦 Features

* 🔐 JWT Authentication (Login/Register)
* 👤 Admin & User Roles
* 📝 Task Assignment with File Upload (Multer + Cloudinary)
* 📅 Due Date + Overdue Highlighting
* 📊 Filters: Status, Priority, Due Date
* ✅ Task Completion by Assigned User
* 🖥️ Admin Panel with User Task Management
* 📁 Document Previews (PDF/Image/Word)
* 🔄 Optimistic UI with Toasts + Loaders

---

## 🛠️ Tech Stack

* **Frontend**: React + Vite, Tailwind CSS
* **Backend**: Express + MongoDB (Mongoose)
* **Auth**: JWT-based (Token stored in cookies)
* **File Uploads**: Multer + Cloudinary
* **Testing**: Postman

---

## 🚀 Setup Instructions

### Backend

```bash
cd backend
npm install
npm run dev
```

### Frontend

```bash
cd frontend
npm install
npm run dev
```

### Environment Variables (Backend)

```
MONGO_URI=your_mongo_connection_string
JWT_SECRET=your_secret
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

---

## 📬 API Documentation

Full Postman documentation for testing all endpoints:
👉 [View in Postman](https://documenter.getpostman.com/view/44213060/2sB3BALrzc)



---

## ✅ Submission Notes

* [x] All required features implemented
* [x] Polished modern UI with Tailwind
* [x] Deployment done


---

## 🙌 Author

**Satvic Bajpai**
Email: [satvicbajpai@gmail.com](mailto:satvicbajpai@gmail.com)
GitHub: [bajpaisatvic](https://github.com/bajpaisatvic)
