import axios from 'axios';

const API_BASE = process.env.REACT_APP_API_URL || 'https://task-manager-app-env-v2.eba-6vmhprtw.us-east-1.elasticbeanstalk.com/api';

export const getTasks = () => axios.get(`${API_BASE}/tasks`);
export const createTask = (title) => axios.post(`${API_BASE}/tasks`, { title });
export const deleteTask = (id) => axios.delete(`${API_BASE}/tasks/${id}`);
export const updateTask = (id, body) => axios.put(`${API_BASE}/tasks/${id}`, body);
