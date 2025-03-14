import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getAuthToken, removeAuthToken } from "../utils/auth";

const CanvasList = () => {
  const [canvases, setCanvases] = useState([]);
  const [error, setError] = useState("");
  const [newCanvasName, setNewCanvasName] = useState(""); // State for new canvas name
  const navigate = useNavigate();

  // Fetch Canvases
  useEffect(() => {
    const fetchCanvases = async () => {
      const token = getAuthToken();
      if (!token) return navigate("/login");

      try {
        const response = await fetch(
          "http://localhost:5000/api/canvas/getCanvas",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        const data = await response.json();
        if (!response.ok)
          throw new Error(data.error || "Failed to fetch canvases");

        setCanvases(data);
      } catch (err) {
        setError(err.message);
        removeAuthToken();
        navigate("/login");
      }
    };

    fetchCanvases();
  }, [navigate]);

  // Create a New Canvas
  const handleCreateCanvas = async () => {
    const token = getAuthToken();
    if (!token) return navigate("/login");

    if (!newCanvasName.trim()) {
      setError("Canvas name cannot be empty!");
      return;
    }

    try {
      const response = await fetch(
        "http://localhost:5000/api/canvas/createCanvas",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ name: newCanvasName }),
        }
      );

      const data = await response.json();
      if (!response.ok)
        throw new Error(data.error || "Failed to create canvas");

      setCanvases([...canvases, data]); // Add new canvas to the list
      setNewCanvasName(""); // Reset input field
    } catch (err) {
      setError(err.message);
    }
  };

  // Delete a Canvas
  const handleDeleteCanvas = async (canvasId) => {
    const token = getAuthToken();
    if (!token) return navigate("/login");

    try {
      const response = await fetch(
        `http://localhost:5000/api/canvas/deleteCanvas/${canvasId}`,
        {
          method: "DELETE",
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (!response.ok) throw new Error("Failed to delete canvas");

      setCanvases(canvases.filter((canvas) => canvas._id !== canvasId)); // Remove from UI
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-6">
      <h2 className="text-4xl font-bold text-gray-700 mb-6">Your Canvases</h2>

      {error && <p className="text-red-500 mb-4">{error}</p>}

      {/* Create Canvas Input */}
      <div className="flex mb-6 w-full max-w-lg">
        <input
          type="text"
          placeholder="Enter canvas name"
          className="w-full p-3 border border-gray-300 rounded-l-lg shadow-sm focus:ring-2 focus:ring-blue-300"
          value={newCanvasName}
          onChange={(e) => setNewCanvasName(e.target.value)}
        />
        <button
          className="bg-green-500 text-white px-6 py-3 rounded-r-lg font-medium hover:bg-green-600 transition"
          onClick={handleCreateCanvas}
        >
          Create
        </button>
      </div>

      {/* Display Canvases */}
      {canvases.length === 0 ? (
        <p className="text-gray-500">No canvases available.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 w-full max-w-6xl">
          {canvases.map((canvas) => (
            <div
              key={canvas._id}
              className="bg-white p-6 rounded-lg shadow-lg flex flex-col justify-between min-h-[200px]"
            >
              <div>
                <h3 className="text-2xl font-semibold text-gray-800">
                  {canvas.name}
                </h3>
                <p className="text-gray-500 text-sm mt-2">
                  Created At: {new Date(canvas.createdAt).toLocaleString()}
                </p>
                {/* Display Owner Name */}
                {canvas.owner && canvas.owner.name && (
                  <p className="text-gray-700 font-medium mt-1">
                    Owner: {canvas.owner.name}
                  </p>
                )}
              </div>
              <div className="flex justify-end mt-4">
                <button
                  className="mr-3 px-3 py-1 bg-blue-500 text-white text-sm font-medium rounded hover:bg-blue-600 transition"
                  onClick={() => navigate(`/canvas/${canvas._id}`)}
                >
                  Open
                </button>
                <button
                  className="px-3 py-1 bg-red-500 text-white text-sm font-medium rounded hover:bg-red-600 transition"
                  onClick={() => handleDeleteCanvas(canvas._id)}
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Logout Button */}
      <button
        className="mt-8 px-6 py-3 bg-red-500 text-white font-medium rounded shadow-md hover:bg-red-600 transition"
        onClick={() => {
          removeAuthToken();
          navigate("/login");
        }}
      >
        Logout
      </button>
    </div>
  );
};

export default CanvasList;
