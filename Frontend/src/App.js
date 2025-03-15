import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Login from "./pages/login";
import Register from "./pages/Register";
import CanvasList from "./pages/CanvasList";
import CanvasPage from "./pages/CanvasPage";
import { getAuthToken } from "./utils/auth";

const ProtectedRoute = ({ children }) => {
  return getAuthToken() ? children : <Navigate to="/login" />;
};

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />{" "}
        {/* ✅ Added Register Route */}
        <Route
          path="/canvases"
          element={
            <ProtectedRoute>
              <CanvasList />
            </ProtectedRoute>
          }
        />
        <Route
          path="/canvas/:canvasId"
          element={
            <ProtectedRoute>
              <CanvasPage />
            </ProtectedRoute>
          }
        />
        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    </Router>
  );
}

export default App;
