# SoNhe.vn - Mini Excel Web Application

A beautiful, easy-to-use mini Excel for small shop owners to manage sales, purchases, payroll, and profit.

## Features
- **Authentication**: Phone + password login with HTTP-only cookies
- **Dashboard**: Quick stats (revenue, expenses, profit), book management
- **Spreadsheet**: Airtable/Notion-like grid, inline editing, formula support
- **Export**: Export data to Excel

## Tech Stack
- **Backend**: Node.js v24, Express, MySQL 8.0, JWT
- **Frontend**: React, Vite, Tailwind CSS, Zustand, Lucide React

## Setup Instructions

### 1. Database
First, create the database and tables. Make sure MySQL is running.
```bash
mysql -u root -p < database.sql
```

### 2. Backend
Navigate to the `backend` folder and start the server:
```bash
cd backend
npm install
npm run dev
```
*(The backend runs on port 5000)*

### 3. Frontend
Open a new terminal, navigate to the `frontend` folder and start the client:
```bash
cd frontend
npm install
npm run dev
```
*(The frontend runs on port 5173)*

## Setup with Docker (Recommended)

You can start the entire application (Backend, Frontend, and MySQL) with a single command using Docker Compose.

1. Make sure you have **Docker** and **Docker Compose** installed.
2. Run the following command in the root directory:
   ```bash
   docker-compose up --build
   ```
3. Access the application:
   - Frontend: [http://localhost](http://localhost)
   - Backend API: [http://localhost:5001/api](http://localhost:5001/api)
   - MySQL: `localhost:3306` (User: `root`, Password: `root_password`)

The database will be automatically initialized using `database.sql`.

## Moving to Desktop

As requested, the project was created in the default workspace. You can easily move it to your Desktop:

**Using File Explorer**:
Copy the folder `C:\Users\hi\.gemini\antigravity\scratch\SoNhe_vn` to your Desktop.

**Using Command Line (PowerShell)**:
```powershell
Copy-Item -Path "C:\Users\hi\.gemini\antigravity\scratch\SoNhe_vn" -Destination "C:\Users\hi\Desktop\SoNhe_vn" -Recurse
```
