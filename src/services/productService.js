
import httpAxios from './httpAxios';

export const productService = {
  getAll: async (token) => {
    return await httpAxios.get('/products', {
      headers: { Authorization: `Bearer ${token}` }
    });
  },
  getById: async (id, token) => {
    return await httpAxios.get(`/products/${id}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
  }
};
