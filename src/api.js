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

// Set timeout to 0.5 sec
api.defaults.timeout = 500;

api.interceptors.request.use(config => {
  // Show loading overlay
  EventBus.$emit('overlay', true);

  return config
});

api.interceptors.response.use(res => {
  // Hidde loading overlay
  EventBus.$emit('overlay', false);
  return res
}, error => {
  let errorMsg;

  if (error && error.response && error.response.status >= 400) {
    if (error.response.data && error.response.data.hasOwnProperty('error')) {
      errorMsg = `1Server error:\n${error.response.data.error}`;
    } else if (error === 'Error: Network Error') {
      errorMsg = `${error.data}`;
    } else {
      errorMsg = `2Server error:\n${error.data}`;
    }
  }

  EventBus.$emit('http-error', errorMsg);

  // Hidde loading overlay
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
