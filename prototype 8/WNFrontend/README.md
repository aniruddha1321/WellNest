# WellNest Frontend (React)

This is the React frontend for the WellNest Smart Health & Fitness Companion application.

## Prerequisites

- Node.js (version 16 or higher)
- npm or yarn package manager

## Installation

1. Navigate to the WNFrontend directory:
   ```bash
   cd WNFrontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

## Running the Application

1. Start the development server:
   ```bash
   npm run dev
   ```

2. Open your browser and navigate to `http://localhost:3000`

## Available Scripts

- `npm run dev` - Starts the development server
- `npm run build` - Builds the app for production
- `npm run preview` - Preview the production build locally

## Features

- User authentication (login/signup)
- Protected routes
- Responsive design
- Modern React with hooks
- Context API for state management
- Axios for API calls

## Backend Integration

The frontend is configured to work with the Spring Boot backend running on `http://localhost:8080`. Make sure the backend server is running before using the application.

## Project Structure

```
src/
├── components/          # React components
│   ├── Home.jsx        # Dashboard/home page
│   ├── Login.jsx       # Login form
│   ├── Signup.jsx      # Registration form
│   └── ProtectedRoute.jsx # Route guard
├── context/            # React context providers
│   └── AuthContext.jsx # Authentication state management
├── services/           # API service layer
│   └── api.js         # HTTP client and auth services
├── App.jsx            # Main app component with routing
├── main.jsx           # React entry point
└── index.css          # Global styles
```