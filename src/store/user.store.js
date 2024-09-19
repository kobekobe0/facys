import { create } from 'zustand';
import axios from 'axios';
import API_URL from '../constants/api';

const useUserStore = create((set) => ({
  user: null,                 
  loading: false,             
  error: null,               

  fetchUser: async () => {
    const authToken = localStorage.getItem('authToken');

    if (!authToken) {
      set({ error: 'No auth token found', user: null });
      return;
    }

    set({ loading: true, error: null });  

    try {
      const response = await axios.get(`${API_URL}student/self`, {
        headers: {
          Authorization: `${authToken}`,
        },
      });

      set({ user: response.data, loading: false });
    } catch (error) {
      set({ error: error.message || 'Failed to fetch user', loading: false });
    }
  },

  logout: () => {
    localStorage.removeItem('authToken'); 
    window.location.href = '/signin';
    set({ user: null, error: null });
  },
}));

export default useUserStore;
