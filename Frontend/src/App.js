import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Login from "./components/login";
import CanvasList from "./components/CanvasList";
import Board from "./components/Board";
import Toolbar from "./components/Toolbar";
import Toolbox from "./components/Toolbox";
import BoardProvider from "./store/BoardProvider";
import ToolboxProvider from "./store/ToolboxProvider";
import { getAuthToken } from "./utils/auth";

const ProtectedRoute = ({ children }) => {
  return getAuthToken() ? children : <Navigate to="/login" />;
};

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route
          path="/canvases"
          element={
            <ProtectedRoute>
              <CanvasList />
            </ProtectedRoute>
          }
        />
        <Route
          path="/canvas/:id"
          element={
            <ProtectedRoute>
              <BoardProvider>
                <ToolboxProvider>
                  <Toolbar />
                  <Board />
                  <Toolbox />
                </ToolboxProvider>
              </BoardProvider>
            </ProtectedRoute>
          }
        />
        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    </Router>
  );
}

export default App;
