# Library Management System (AWT Full Stack Project)

A full-stack Library Management System with:
- React frontend (hooks + React Router + Axios)
- Node.js/Express backend (strict MVC)
- MongoDB Atlas
- JWT authentication with role-based access (admin + user)
- Book/Student CRUD + Issue/Return workflow + Dashboard stats

## Project Structure

```text
yussu/
  backend/
    src/
      config/
      controllers/
      middleware/
      models/
      routes/
      seeds/
  frontend/
    src/
      api/
      components/
      context/
      pages/
      styles/
```

## 1. Backend Setup (Step-by-Step)

1. Navigate to backend folder:
   ```bash
   cd backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create `.env` from `.env.example` and configure:
   ```env
   MONGO_URI=your_mongodb_atlas_connection_string
   JWT_SECRET=your_super_secret_jwt_key
   PORT=5000
   CORS_ORIGIN=http://localhost:5173
   ADMIN_EMAIL=admin@library.com
   ADMIN_PASSWORD=admin12345
   ```
4. Run backend in development:
   ```bash
   npm run dev
   ```

## 2. Seed Database (Sample Data)

Run these commands inside `backend`:

```bash
npm run seed
```

This inserts:
- 1 admin user (from `ADMIN_EMAIL` and `ADMIN_PASSWORD`)
- 12 books
- 12 students
- 3 users (`reader1@library.com`, `reader2@library.com`, `reader3@library.com`)
- Seeded user password: `Reader@123`
- 12 issue records (7 issued + 5 returned)
- Auto-updated book stock and availability based on active issues

To clear seeded collections:

```bash
npm run seed:destroy
```

## 3. Frontend Setup

1. Navigate to frontend folder:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create `.env` from `.env.example`:
   ```env
   VITE_API_BASE_URL=http://localhost:5000/api
   ```
4. Run frontend:
   ```bash
   npm run dev
   ```

## 4. API Endpoints

### Auth
- `POST /api/auth/register`
- `POST /api/auth/login`

### Users
- `GET /api/users/me`

### Books
- `GET /api/books/public`
- `POST /api/books/add`
- `GET /api/books/all`
- `PUT /api/books/update/:id`
- `DELETE /api/books/delete/:id`

### Students
- `POST /api/students/add`
- `GET /api/students/all`
- `PUT /api/students/update/:id`
- `DELETE /api/students/delete/:id`

### Issues
- `POST /api/issues/issue`
- `POST /api/issues/return`
- `GET /api/issues/all`

### Dashboard
- `GET /api/dashboard/stats`

## 5. Feature Coverage

- Public home page
- User registration and secure login
- Role-based frontend routes for admin and user
- Admin-only protected routes on backend with JWT + role middleware
- Auth rate limiting on login/register
- Security headers via Helmet
- Form validation on frontend and backend
- Responsive UI (mobile/tablet/desktop)
- Loading indicators and API error messages
- Dashboard cards for total books, issued books, returned books, total students
- Book Management CRUD
- Student Management CRUD
- Issue/Return flow with quantity and availability tracking
- Token expiration handling (auto logout on 401)

## 6. Deployment Guide

### Backend (Render or Railway)
1. Push code to GitHub.
2. Create a new Web Service.
3. Set root directory to `backend`.
4. Build command: `npm install`
5. Start command: `npm start`
6. Add environment variables:
   - `MONGO_URI`
   - `JWT_SECRET`
   - `PORT`
   - `CORS_ORIGIN` (set to your Vercel domain, e.g. `https://your-app.vercel.app`)
   - `ADMIN_EMAIL`
   - `ADMIN_PASSWORD`
7. Deploy and copy backend URL.

### Frontend (Vercel or Netlify)
1. Create a new frontend deployment from GitHub.
2. Set root directory to `frontend`.
3. Build command: `npm run build`
4. Output directory: `dist`
5. Add env var:
   - `VITE_API_BASE_URL=<your_deployed_backend_url>/api`
6. Deploy.
7. The project already includes `frontend/vercel.json` for React Router rewrites.

## 7. Local Run Instructions

Open two terminals:

Terminal 1:
```bash
cd backend
npm run dev
```

Terminal 2:
```bash
cd frontend
npm run dev
```

Then open the frontend URL from Vite.

Admin login:
- Email: value from `ADMIN_EMAIL`
- Password: value from `ADMIN_PASSWORD`

Seeded user login:
- Email: `reader1@library.com`
- Password: `Reader@123`

## 8. Notes for Submission

- Add your real deployment links below before final submission:
  - Backend URL: `<add backend link>`
  - Frontend URL: `<add frontend link>`
- Keep this repository public if required by rubric.
