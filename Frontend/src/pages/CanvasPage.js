import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Board from "../components/Board";
import Toolbar from "../components/Toolbar";
import Toolbox from "../components/Toolbox";
import BoardProvider from "../store/BoardProvider";
import ToolboxProvider from "../store/ToolboxProvider";
import { getAuthToken, removeAuthToken } from "../utils/auth";

const CanvasPage = () => {
  const { canvasId } = useParams();
  const navigate = useNavigate();
  const [canvas, setCanvas] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchCanvas = async () => {
      const token = getAuthToken();
      if (!token) {
        navigate("/login");
        return;
      }

      try {
        const response = await fetch(
          `http://localhost:5000/api/canvas/load/${canvasId}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        if (response.status === 401) {
          removeAuthToken();
          navigate("/login");
          return;
        }

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || "Failed to load canvas");
        }

        setCanvas(data);
      } catch (err) {
        setError(err.message || "An error occurred while loading the canvas");
        console.error("Fetch canvas error:", err);
      }
    };

    fetchCanvas();
  }, [canvasId, navigate]);

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <p className="text-red-500 text-xl">{error}</p>
      </div>
    );
  }

  if (!canvas) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <p className="text-gray-500 text-xl">Loading Canvas...</p>
      </div>
    );
  }

  return (
    <BoardProvider initialElements={canvas.elements || []}>
      <ToolboxProvider>
        <Toolbar />
        <Board />
        <Toolbox />
      </ToolboxProvider>
    </BoardProvider>
  );
};

export default CanvasPage;
