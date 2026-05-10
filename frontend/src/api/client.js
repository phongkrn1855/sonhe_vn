import axios from 'axios';

const isProd = import.meta.env.PROD;
axios.defaults.baseURL = isProd ? '' : 'http://localhost:5001';
axios.defaults.withCredentials = true;



export default axios;
