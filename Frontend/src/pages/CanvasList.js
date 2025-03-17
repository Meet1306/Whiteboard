import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getAuthToken, removeAuthToken } from "../utils/auth";
import { FiEdit3 } from "react-icons/fi";
import { IoShareSocialOutline } from "react-icons/io5";
import { IoMdClose } from "react-icons/io";


const CanvasList = () => {
  const [canvases, setCanvases] = useState([]);
  const [error, setError] = useState("");
  const [newCanvasName, setNewCanvasName] = useState("");
  const [editingCanvasId, setEditingCanvasId] = useState(null);
  const [editingCanvasName, setEditingCanvasName] = useState("");
  const [sharingCanvasId, setSharingCanvasId] = useState(null);
  const [shareEmail, setShareEmail] = useState("");
  const [confirmUnshare, setConfirmUnshare] = useState(null); // { canvasId, email }

  const navigate = useNavigate();

  useEffect(() => {
    const fetchCanvases = async () => {
      const token = getAuthToken();
      if (!token) return navigate("/login");

      try {
        const response = await fetch(
          `${process.env.REACT_APP_BACKEND_URL}/api/canvas/getCanvas`,
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

  const handleCreateCanvas = async () => {
    const token = getAuthToken();
    if (!token) return navigate("/login");

    if (!newCanvasName.trim()) {
      setError("Canvas name cannot be empty!");
      return;
    }

    try {
      const response = await fetch(
        `${process.env.REACT_APP_BACKEND_URL}/api/canvas/createCanvas`,
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

      setCanvases([...canvases, data]);
      setNewCanvasName("");
    } catch (err) {
      setError(err.message);
    }
  };

  const handleDeleteCanvas = async (canvasId) => {
    const token = getAuthToken();
    if (!token) return navigate("/login");

    try {
      const response = await fetch(
        `${process.env.REACT_APP_BACKEND_URL}/api/canvas/deleteCanvas/${canvasId}`,
        {
          method: "DELETE",
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (!response.ok) throw new Error("Failed to delete canvas");

      setCanvases(canvases.filter((canvas) => canvas._id !== canvasId));
    } catch (err) {
      setError(err.message);
    }
  };

  const handleEditCanvas = (canvasId, currentName) => {
    setEditingCanvasId(canvasId);
    setEditingCanvasName(currentName);
  };

  const handleUpdateCanvas = async (e, canvasId) => {
    if (e.key !== "Enter") return;
    e.preventDefault();

    const token = getAuthToken();
    if (!token) return navigate("/login");

    try {
      const response = await fetch(
        `${process.env.REACT_APP_BACKEND_URL}/api/canvas/update/canvasName/${canvasId}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ name: editingCanvasName }),
        }
      );

      const data = await response.json();

      if (!response.ok)
        throw new Error(data.error || "Failed to update canvas");

      setCanvases((prevCanvases) =>
        prevCanvases.map((canvas) =>
          canvas._id === data._id ? { ...canvas, name: data.name } : canvas
        )
      );

      setEditingCanvasId(null);
      setEditingCanvasName("");
    } catch (err) {
      setError(err.message);
    }
  };

  const handleShareCanvas = async (canvasId) => {
    const token = getAuthToken();
    if (!token) return navigate("/login");

    if (!shareEmail.trim()) {
      setError("Email cannot be empty!");
      return;
    }

    try {
      const response = await fetch(
        `${process.env.REACT_APP_BACKEND_URL}/api/canvas/shareWith/${canvasId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ email: shareEmail }),
        }
      );

      const data = await response.json();

      if (!response.ok) throw new Error(data.error || "Failed to share canvas");

      setCanvases((prevCanvases) =>
        prevCanvases.map((canvas) =>
          canvas._id === canvasId
            ? { ...canvas, sharedWith: data.sharedWith }
            : canvas
        )
      );
      setShareEmail("");

      // setSharingCanvasId(null);
      setShareEmail("");
    } catch (err) {
      setError(err.message);
    }
  };

  const handleUnshareCanvas = async (canvasId, email) => {
    const token = getAuthToken();
    if (!token) return navigate("/login");

    try {
      const response = await fetch(
        `${process.env.REACT_APP_BACKEND_URL}/api/canvas/UnshareWith/${canvasId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ email }),
        }
      );

      const data = await response.json();

      if (!response.ok) throw new Error(data.error || "Failed to unshare user");

      setCanvases((prevCanvases) =>
        prevCanvases.map((canvas) =>
          canvas._id === canvasId ? { ...canvas, sharedWith: data } : canvas
        )
      );

      setConfirmUnshare(null);
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-6">
      <h2 className="text-4xl font-bold text-gray-700 mb-6">Your Canvases</h2>

      {error && <p className="text-red-500 mb-4">{error}</p>}

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

      {canvases.length === 0 ? (
        <p className="text-gray-500">No canvases available.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 w-full max-w-6xl">
          {canvases.map((canvas) => (
            <div
              key={canvas._id}
              className="bg-white p-6 rounded-lg shadow-lg flex flex-col justify-between min-h-[250px]"
            >
              <div>
                {editingCanvasId === canvas._id ? (
                  <input
                    type="text"
                    value={editingCanvasName}
                    onChange={(e) => setEditingCanvasName(e.target.value)}
                    onKeyDown={(e) => handleUpdateCanvas(e, canvas._id)}
                    onBlur={() => {
                      setEditingCanvasId(null);
                      setEditingCanvasName("");
                    }}
                    autoFocus
                    className="text-2xl font-semibold text-gray-800 border-b-2 border-gray-300 focus:outline-none focus:border-blue-500"
                  />
                ) : (
                  <div className="flex items-center justify-between">
                    <h3 className="text-2xl font-semibold text-gray-800">
                      {canvas.name}
                    </h3>
                    <button
                      onClick={() => handleEditCanvas(canvas._id, canvas.name)}
                      className="ml-2 text-blue-500 hover:text-blue-700"
                    >
                      <FiEdit3 size={20} />
                    </button>
                  </div>
                )}

                <p className="text-gray-500 text-sm mt-2">
                  Created At: {new Date(canvas.createdAt).toLocaleString()}
                </p>

                {canvas.owner && canvas.owner.name && (
                  <p className="text-gray-700 font-medium mt-1">
                    Owner: {canvas.owner.name}
                  </p>
                )}

                {canvas.sharedWith && canvas.sharedWith.length > 0 && (
                  <div className="mt-2">
                    <p className="text-sm text-gray-600 font-medium mb-1">
                      Shared With:
                    </p>
                    <ul className="space-y-1">
                      {canvas.sharedWith.map((email, idx) => (
                        <li
                          key={idx}
                          className="flex items-center justify-between bg-gray-100 rounded px-2 py-1"
                        >
                          <span className="text-sm text-gray-700">{email}</span>
                          <button
                            className="text-red-500 hover:text-red-700"
                            onClick={() =>
                              setConfirmUnshare({ canvasId: canvas._id, email })
                            }
                          >
                            <IoMdClose size={16} />
                          </button>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              {sharingCanvasId === canvas._id && (
                <div className="mt-4">
                  <input
                    type="email"
                    placeholder="Enter user email"
                    className="w-full p-2 border border-gray-300 rounded mb-2 focus:ring-2 focus:ring-blue-300"
                    value={shareEmail}
                    onChange={(e) => setShareEmail(e.target.value)}
                  />
                  <button
                    className="w-full bg-purple-500 text-white py-2 rounded hover:bg-purple-600 transition"
                    onClick={() => handleShareCanvas(canvas._id)}
                  >
                    Share
                  </button>
                </div>
              )}

              <div className="flex justify-end mt-4 space-x-2">
                <button
                  className="px-3 py-1 bg-blue-500 text-white text-sm font-medium rounded hover:bg-blue-600 transition"
                  onClick={() => navigate(`/canvas/${canvas._id}`)}
                >
                  Open
                </button>

                <button
                  className="px-3 py-1 bg-yellow-500 text-white text-sm font-medium rounded hover:bg-yellow-600 transition flex items-center"
                  onClick={() =>
                    setSharingCanvasId(
                      sharingCanvasId === canvas._id ? null : canvas._id
                    )
                  }
                >
                  <IoShareSocialOutline size={16} className="mr-1" />
                  Share With
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

      {confirmUnshare && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 max-w-sm w-full text-center">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              Confirm Unshare
            </h3>
            <p className="text-gray-600 mb-6">
              Are you sure you want to unshare with{" "}
              <span className="font-medium">{confirmUnshare.email}</span>?
            </p>
            <div className="flex justify-center space-x-4">
              <button
                className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition"
                onClick={() =>
                  handleUnshareCanvas(
                    confirmUnshare.canvasId,
                    confirmUnshare.email
                  )
                }
              >
                Yes, Unshare
              </button>
              <button
                className="px-4 py-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400 transition"
                onClick={() => setConfirmUnshare(null)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

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
