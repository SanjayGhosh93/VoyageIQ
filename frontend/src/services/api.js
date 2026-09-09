// frontend/src/services/api.js
import axios from 'axios';

const CLOUD_API_URL = 'https://voyageiq-00yv.onrender.com/api';

export const getApiBaseUrl = () => {
  if (typeof window !== 'undefined') {
    const host = window.location.hostname;
    if (host === 'localhost' || host === '127.0.0.1') {
      return 'http://localhost:5000/api';
    }
    return CLOUD_API_URL;
  }
  return import.meta.env.VITE_API_URL || CLOUD_API_URL;
};

const API_BASE_URL = getApiBaseUrl();

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  },
  timeout: 15000
});

// Attach JWT token automatically
api.interceptors.request.use(
  (config) => {
    try {
      const token = typeof window !== 'undefined' ? localStorage.getItem('oceancharter_token') : null;
      if (token) {
        config.headers = config.headers || {};
        config.headers.Authorization = `Bearer ${token}`;
      }
    } catch (e) {
      console.warn('Error accessing localStorage for auth token', e);
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor for consistent error messaging
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const customError = {
      message: error.response?.data?.message || error.message || 'Network or server error occurred',
      status: error.response?.status,
      data: error.response?.data,
      isAxiosError: true,
      originalError: error
    };
    return Promise.reject(customError);
  }
);

export const authService = {
  login: async (credentials) => {
    const res = await api.post('/auth/login', credentials);
    return res.data;
  },
  register: async (userData) => {
    const res = await api.post('/auth/register', userData);
    return res.data;
  },
  getMe: async () => {
    const res = await api.get('/auth/me');
    return res.data;
  },
  getLogs: async (params) => {
    const res = await api.get('/auth/logs', { params });
    return res.data;
  },
  getUsers: async () => {
    const res = await api.get('/auth/users');
    return res.data;
  },
  getStatus: async () => {
    const res = await api.get('/auth/status');
    return res.data;
  }
};

export const forecastService = {
  getForecast: async (params) => {
    const res = await api.post('/forecast', params);
    return res.data;
  }
};

export const feasibilityService = {
  checkFeasibility: async (params) => {
    const res = await api.post('/feasibility/check', params);
    return res.data;
  }
};

export const calculatorService = {
  calculateCost: async (params) => {
    const res = await api.post('/calculator', params);
    return res.data;
  }
};

export const riskService = {
  calculateRisk: async (params) => {
    const res = await api.post('/risk/calculate', params);
    return res.data;
  }
};

export const routeService = {
  optimizeRoute: async (params) => {
    const res = await api.post('/routes/optimize', params);
    return res.data;
  }
};

export const scenarioService = {
  getScenarios: async () => {
    const res = await api.get('/scenarios');
    return res.data;
  },
  createScenario: async (scenario) => {
    const res = await api.post('/scenarios', scenario);
    return res.data;
  },
  deleteScenario: async (id) => {
    const res = await api.delete(`/scenarios/${id}`);
    return res.data;
  }
};

export const alertService = {
  getAlerts: async (params) => {
    const res = await api.get('/alerts', { params });
    return res.data;
  },
  acknowledgeAlert: async (id) => {
    const res = await api.put(`/alerts/${id}/ack`);
    return res.data;
  }
};

// --- FIXED MARKET SERVICE ---
export const marketService = {
  getOverview: async () => {
    const res = await api.get('/market/overview');
    return res.data;
  },
  getHistory: async (params) => {
    const res = await api.get('/market/history', { params });
    return res.data;
  },
  getCargoHistory: async () => {
    const res = await api.get('/market/cargo');
    return res.data;
  }
};

export const portService = {
  getPorts: async (params) => {
    const res = await api.get('/ports', { params });
    return res.data;
  },
  getPort: async (id) => {
    const res = await api.get(`/ports/${id}`);
    return res.data;
  }
};

export const vesselService = {
  getVessels: async (params) => {
    const res = await api.get('/vessels', { params });
    return res.data;
  }
};

export const reportService = {
  generateReport: async (params) => {
    const res = await api.post('/reports', params);
    return res.data;
  }
};

export const realtimeService = {
  getMarketFeed: async () => {
    const res = await api.get('/realtime/market-feed');
    return res.data;
  },
  getPortWeather: async () => {
    const res = await api.get('/realtime/port-weather');
    return res.data;
  },
  getLiveVessels: async () => {
    const res = await api.get('/realtime/vessels');
    return res.data;
  }
};
// frontend/src/services/api.js (Update to add risk fetching)
export const riskCenterPage = {
  calculateRisk: async (params) => {
    const res = await api.post('/risk/calculate', params);
    return res.data;
  },
  getRiskScore: async (params) => {
    const res = await api.get('/risk/score', { params });
    return res.data;
  }
};



export default api;