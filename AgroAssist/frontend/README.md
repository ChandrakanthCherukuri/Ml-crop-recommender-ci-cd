# AgroAssist Frontend

A modern React-based frontend for the AgroAssist agricultural management system.

## Features

### For Farmers
- 📊 Dashboard with sensor data overview
- 📈 Add and view sensor data (NPK, temperature, humidity, pH, rainfall)
- 🤖 ML-powered crop recommendations
- 🌿 Disease detection through image upload
- 📜 Prediction history tracking

### For Agronomists
- 👥 View assigned farmers
- 📊 Access farmer sensor data
- 🤖 ML predictions for crop recommendation and disease detection
- 📈 Monitor multiple farms

### For Admins
- 👤 User management
- 🔗 Assign farmers to agronomists
- 📊 View all sensor data
- 📈 System-wide statistics

## Tech Stack

- **Framework**: React 18 with Vite
- **Styling**: TailwindCSS
- **Routing**: React Router v6
- **HTTP Client**: Axios
- **Icons**: Lucide React
- **Notifications**: React Hot Toast

## Setup Instructions

1. **Install Dependencies**
   ```bash
   cd frontend
   npm install
   ```

2. **Configure Backend URL**
   The frontend is configured to proxy API requests to `http://localhost:5000` (see `vite.config.js`)

3. **Start Development Server**
   ```bash
   npm run dev
   ```
   The app will be available at `http://localhost:3000`

4. **Build for Production**
   ```bash
   npm run build
   ```

## Project Structure

```
frontend/
├── src/
│   ├── components/
│   │   ├── ui/           # Reusable UI components
│   │   ├── Layout.jsx
│   │   ├── Navbar.jsx
│   │   ├── Sidebar.jsx
│   │   └── ProtectedRoute.jsx
│   ├── context/
│   │   └── AuthContext.jsx
│   ├── pages/
│   │   ├── farmer/       # Farmer-specific pages
│   │   ├── agronomist/   # Agronomist-specific pages
│   │   ├── admin/        # Admin-specific pages
│   │   ├── Login.jsx
│   │   └── Register.jsx
│   ├── utils/
│   │   └── api.js        # Axios configuration
│   ├── App.jsx
│   ├── main.jsx
│   └── index.css
├── index.html
├── package.json
├── vite.config.js
└── tailwind.config.js
```

## Environment Variables

No environment variables are required. The API proxy is configured in `vite.config.js`.

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build

## Role-Based Access

- **Farmers**: Access to sensor data management and ML predictions
- **Agronomists**: View assigned farmers and their data, use ML features
- **Admins**: Full system access, user management, and assignments

## API Integration

The frontend communicates with the backend API through Axios interceptors that automatically:
- Add JWT tokens to requests
- Handle authentication errors
- Redirect to login on 401 responses

## Features in Detail

### Authentication
- JWT-based authentication
- Role-based access control
- Persistent login with localStorage
- Automatic token refresh handling

### Sensor Data Management
- Add new sensor readings
- View historical data
- Real-time dashboard updates

### ML Predictions
- Crop recommendation based on soil and weather data
- Disease detection via image upload
- Prediction history tracking

### Admin Features
- Create farmer-agronomist assignments
- View system-wide statistics
- Manage all users

## Contributing

1. Follow the existing code structure
2. Use functional components with hooks
3. Maintain consistent styling with TailwindCSS
4. Add proper error handling and loading states
