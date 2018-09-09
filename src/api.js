import axios from 'axios'
import { EventBus } from './event'

const api = axios.create({
  baseURL: `https://www.dragonsofmugloar.com/api/v2`,
  withCredentials: false,
  headers: {
    'Accept': 'application/json',
    'Content-Type': 'application/json'
  }
});

// Set timeout to 5 sec
api.defaults.timeout = 5000;

api.interceptors.request.use(config => {
  // Show loading overlay
  EventBus.$emit('overlay', true);

  return config
});

api.interceptors.response.use(res => {
  // Hide loading overlay
  EventBus.$emit('overlay', false);
  return res
}, error => {
  let errorMsg;
  let errorStr = error.toString();

  if (error && error.response && error.response.status >= 400) {
    if (error.response.data && error.response.data.hasOwnProperty('error')) {
      errorMsg = `Server error:\n${error.response.data.error}`;
    } else {
      errorMsg = `Server error:\n${error.data}`;
    }
  } else {
    errorMsg = errorStr;
  }

  EventBus.$emit('http-error', errorMsg);

  // Hide loading overlay
  EventBus.$emit('overlay', false);

  return Promise.reject(error.response)
});

export default {
  getGame: () => api.post('/game/start'),
  getMessages: gameId => api.get(`/${gameId}/messages`),
  solveMessages: (gameId, adId) => api.post(`/${gameId}/solve/${adId}`),
  getShopItems: gameId => api.get(`/${gameId}/shop`),
  purchaseShopItems: (gameId, itemId) => api.post(`/${gameId}/shop/buy/${itemId}`),
}
