import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from "./components/Layout";
import Dashboard from "./pages/Dashboard";
import Shipments from "./pages/Shipments";
import Analytics from "./pages/Analytics";
import TrackShipment from "./pages/TrackShipment";
import Login from "./pages/Auth/Login";
import Register from "./pages/Auth/Register";
import ChangePassword from "./pages/Auth/ChangePassword";
import CreateDriver from "./pages/Admin/CreateDriver";
import ProtectedRoute from "./components/ProtectedRoute";
import { AuthProvider } from "./context/AuthContext";

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/change-password" element={<ChangePassword />} />
          <Route
            path="/*"
            element={
              <ProtectedRoute>
                <Layout>
                  <Routes>
                    <Route path="/" element={<Dashboard />} />
                    <Route path="/shipments" element={<Shipments />} />
                    <Route path="/track/:id" element={<TrackShipment />} />
                    <Route
                      path="/analytics"
                      element={
                        <ProtectedRoute allowedRoles={['ADMIN']}>
                          <Analytics />
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="/create-driver"
                      element={
                        <ProtectedRoute allowedRoles={['ADMIN']}>
                          <CreateDriver />
                        </ProtectedRoute>
                      }
                    />
                  </Routes>
                </Layout>
              </ProtectedRoute>
            }
          />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
