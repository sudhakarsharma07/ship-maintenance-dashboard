# 🚢 ENTNT Ship Maintenance Dashboard

![React](https://img.shields.io/badge/React-18-blue?logo=react)
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-v3-38B2AC?logo=tailwindcss)
![Vite](https://img.shields.io/badge/Vite-Build_Tool-646CFF?logo=vite)
![Status](https://img.shields.io/badge/Status-Frontend_Only-yellow)
![License](https://img.shields.io/badge/License-Assignment_Use_Only-lightgrey)

This project is a **frontend-only Ship Maintenance Dashboard** built as part of the ENTNT Technical Assignment. It simulates the management of ships, components, and maintenance jobs using **React**, **React Router**, **Context API**, and **TailwindCSS**. All data operations are managed through `localStorage`.

---

<details>
<summary>✅ Features Implemented</summary>

### 👥 User Authentication (Simulated)
- Hardcoded users with roles: Admin, Inspector, Engineer.
- Login/logout flow.
- Role-based UI access (RBAC).
- Session persistence using `localStorage`.

### 🚢 Ships Management
- Create, Read, Update, Delete ships.
- View ship profile with general info, components, and job history.

### ⚙️ Component Management
- Manage ship components (add/edit/delete).
- View component details with metadata.

### 🧰 Maintenance Jobs
- CRUD for maintenance jobs (Admin only).
- Job status updates and filtering.
- Role-based access to job management.

### 📆 Maintenance Calendar
- Monthly/Weekly/Daily views via `react-big-calendar`.
- View/edit jobs by date.
- Modal-based interaction.

### 🔔 Notifications
- In-app notifications for user actions (job updates, CRUD).
- Auto-dismiss and styled alerts.

### 📊 KPIs Dashboard
- Cards for:
  - Total Ships
  - Overdue Components
  - Jobs in Progress
  - Completed Jobs
- Placeholder charts for visual insight (`recharts`).

### 💾 Data Persistence
- All data stored in `localStorage` as JSON.

### 📱 Responsive Design
- Fully responsive using TailwindCSS.

### ✅ Form Validation
- Basic form validation with visual feedback.

</details>

---

## 🛠 Tech Stack

| Category            | Tool/Library                     |
|---------------------|----------------------------------|
| Framework           | React 18                         |
| State Management    | React Context API                |
| Routing             | React Router DOM v6              |
| Styling             | TailwindCSS v3                   |
| Calendar            | react-big-calendar               |
| Charts              | recharts (basic placeholder use) |
| Build Tool          | Vite                             |
| Date Handling       | date-fns                         |
| Utility             | uuid                             |

---

## ⚙️ Setup Instructions

```bash
# 1. Clone the repository
git clone https://github.com/<your-username>/entnt-ship-maintenance-dashboard.git
cd ship-maintenance-dashboard

# 2. Install dependencies
npm install


# 3. Run in development
npm run dev


# App will be available at: http://localhost:5173

# 4. Build for production
npm run build
```

---

<details>
<summary>📁 Project Structure Overview</summary>

```
src/
├── App.jsx                # Routes
├── main.jsx               # App entry point
├── components/
│   ├── Auth/              # Login form
│   ├── Dashboard/         # KPI and chart components
│   ├── Layout/            # Navbar, Sidebar, MainLayout
│   ├── Ships/             # Ship CRUD & profile UI
│   ├── Components/        # Component forms/lists
│   ├── Jobs/              # Job management
│   ├── Notifications/     # Alerts
│   └── UI/                # Modal, Button, InputField, etc.
├── contexts/
│   ├── AuthContext.jsx
│   ├── DataContext.jsx
│   └── NotificationContext.jsx
├── pages/                 # Login, Dashboard, etc.
├── services/              # localStorage abstraction
├── styles/                # Tailwind styles
├── utils/                 # Helpers and RBAC
└── config/                # Initial data
```

</details>

---

## 🧩 Data Model (Simplified for `localStorage`)

| Entity      | Fields |
|-------------|--------|
| User        | id, email, password, role |
| Ship        | id, name, imo, flag, status |
| Component   | id, shipId, name, serialNumber, installDate, lastMaintenanceDate |
| Job         | id, componentId, shipId, type, priority, status, assignedEngineerId, scheduledDate, description, completionDate |
| Notification| id, message, type |
| Session     | currentUser, token (simulated) |

---

## 🧠 Technical Highlights

- 📦 Context API for state
- 🎨 TailwindCSS for responsive design
- 💾 `localStorage` via abstraction layer
- 🔗 Modular component structure
- 📅 Calendar with `react-big-calendar`
- 📊 Charts (placeholder) with `recharts`

---

## ⚠️ Known Limitations

- 🔐 Passwords are hardcoded (not secure)
- 💾 `localStorage` not scalable for large data
- ❌ No real API/backend
- 📊 Charts are placeholders
- ❌ Real-time features not included

---

## 🧪 Test Credentials

| Email                 | Password     |
|----------------------|--------------|
| `admin@entnt.in`     | `admin123`   |
| `inspector@entnt.in` | `inspect123` |
| `engineer@entnt.in`  | `engine123`  |

---

## 📝 License

This project is developed for ENTNT's technical assignment purposes. Not for commercial use.

---

> 💡 Built with ❤️ by Sudhakar Sharma using React + TailwindCSS
