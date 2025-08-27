// API Configuration for different environments
const API_BASE_URL = process.env.NODE_ENV === 'production' 
  ? 'https://quiz-app-z8t8.onrender.com' // Your Render backend URL
  : 'http://localhost:5000'; // Local development

export default API_BASE_URL;
