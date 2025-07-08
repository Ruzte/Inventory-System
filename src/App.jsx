import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Products from './pages/Products';
import Profile from './pages/Profile';
import Topbar from './components/Topbar';

// Protected route wrapper
const ProtectedRoute = ({ children }) => {
  const isLoggedIn = localStorage.getItem("loggedIn") === "true";
  return isLoggedIn ? children : <Navigate to="/" replace />;
};

// Wrapper to conditionally show Topbar
const Layout = ({ children }) => {
  const location = useLocation();
  const isLoginPage = location.pathname === "/";
  
  return (
    <div className={`${isLoginPage ? '' : 'bg-[#E4DED0] h-screen overflow-hidden'}`}>
      {!isLoginPage && <Topbar />}
      <main className={`${isLoginPage ? '' : 'p-4 h-full overflow-hidden'}`}>
        {children}
      </main>
    </div>
  );
};

function App() {
  if (!localStorage.getItem("user")) {
    localStorage.setItem("user", JSON.stringify({ username: "admin", password: "123456" }));
  }
  
  return (
    <Router>
      <Layout>
        <Routes>
          {/* Login route (default) */}
          <Route path="/" element={<Login />} />

          {/* Protected Routes */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/products"
            element={
              <ProtectedRoute>
                <Products />
              </ProtectedRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            }
          />

          {/* Catch-all route */}
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;