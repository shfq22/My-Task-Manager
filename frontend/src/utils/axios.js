import axios from "axios";

const instance = axios.create({
  baseURL: "https://taskmanagerbackend-nebt.onrender.com/api/v1",
  withCredentials: true,
});

export default instance;
