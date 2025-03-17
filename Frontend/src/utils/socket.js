import { io } from "socket.io-client";

const { getAuthToken } = require("./auth");
const token = getAuthToken();
const socket = io(process.env.REACT_APP_BACKEND_URL, {
  auth: {
    token,
  },
});

export default socket;
