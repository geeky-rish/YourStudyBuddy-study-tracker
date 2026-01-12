# Your Study Buddy - MERN Study Tracker

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Status](https://img.shields.io/badge/status-active-success.svg)
![Stack](https://img.shields.io/badge/stack-MERN-orange.svg)

> A comprehensive, full-stack study tracking application to manage subjects, log study sessions, and visualize progress. Built with MongoDB, Express, React, and Node.js.

## 🌟 Features

- **Authentication**: Secure User Signup & Login using JWT.
- **Dashboard**: Real-time overview of today's study time, goal progress, and weekly activity.
- **Subject Management**: Create, edit, and delete subjects with custom color tags.
- **Session Tracking**: Log study sessions with duration, dates, and optional notes.
- **Analytics**: 
  - 📊 Weekly progress bar charts.
  - 🥧 Subject distribution pie charts.
- **History**: Chronological history of all your study sessions.
- **Dark Mode**: Sleek, modern, dark-themed UI for reduced eye strain during late-night study sessions.

## 🛠️ Tech Stack

### Frontend
- **Framework**: React (Vite)
- **Styling**: Vanilla CSS (Variables, Flexbox/Grid, Dark Theme)
- **Routing**: React Router DOM (Protected Routes)
- **State Management**: Context API
- **HTTP Client**: Axios
- **Visualization**: Recharts
- **Notifications**: React Toastify

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB (Mongoose ODM)
- **Authentication**: JSON Web Token (JWT) + BCryptJS
- **Security**: CORS, Environment Variables

## 📂 Project Structure

```bash
study-tracker/
├── backend/            # Express Server & API
│   ├── config/         # DB Connection
│   ├── controllers/    # Request Handlers
│   ├── middleware/     # Auth & Error Handling
│   ├── models/         # Mongoose Schemas
│   └── routes/         # API Routes
├── frontend/           # React Client
│   ├── src/
│   │   ├── components/ # Reusable UI Components
│   │   ├── context/    # Auth Global State
│   │   └── pages/      # Application Pages
│   └── ...
└── DEPLOYMENT.md       # Deployment Instructions
```

## 🚀 Getting Started

### Prerequisites
- Node.js (v14+)
- MongoDB Atlas Connection String

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/geeky-rish/YourStudyBuddy-study-tracker.git
   cd YourStudyBuddy-study-tracker
   ```

2. **Backend Setup**
   ```bash
   cd backend
   npm install
   
   # Create .env file
   echo "PORT=5000" > .env
   echo "MONGO_URI=your_mongodb_connection_string" >> .env
   echo "JWT_SECRET=your_jwt_secret" >> .env
   
   # Run Backend
   npm run dev
   ```

3. **Frontend Setup**
   ```bash
   # Open a new terminal
   cd frontend
   npm install
   npm run dev
   ```

4. **Access the App**
   Open [http://localhost:5173](http://localhost:5173) in your browser.

## 🚢 Deployment

Detailed deployment instructions for Vercel (Frontend) and Render/Railway (Backend) can be found in [DEPLOYMENT.md](./DEPLOYMENT.md).

## 🔌 API Endpoints

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| **POST** | `/api/users` | Register a new user |
| **POST** | `/api/users/login` | Authenticate user & get token |
| **GET** | `/api/subjects` | Get all subjects for user |
| **POST** | `/api/subjects` | Create a new subject |
| **GET** | `/api/sessions` | Get all study sessions |
| **POST** | `/api/sessions` | Log a new study session |
| **GET** | `/api/goals` | Get user's daily goal |

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is open source and available under the [MIT License](LICENSE).
