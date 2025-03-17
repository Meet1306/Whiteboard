import { getAuthToken } from "./auth";

const API_BASE_URL = `${process.env.REACT_APP_BACKEND_URL}/api/canvas/update`;

export const updateCanvas = async (canvasId, elements) => {
  const token = getAuthToken();
  if (!token) {
    return Promise.reject(new Error("Not authenticated"));
  }

  try {
    const response = await fetch(`${API_BASE_URL}/${canvasId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ elements }),
    });

    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.error || "Failed to update canvas");
    }

    // return data;
  } catch (err) {
    return Promise.reject(err);
  }
};
