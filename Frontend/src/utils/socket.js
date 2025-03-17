import { io } from "socket.io-client";

const { getAuthToken } = require("./auth");

const token = getAuthToken();
const socket = io("http://localhost:5000", {
  auth: {
    token,
  },
});

export default socket;
