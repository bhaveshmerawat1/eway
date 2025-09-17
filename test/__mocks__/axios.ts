const actualAxios = jest.requireActual("axios"); // keep real axios

export const api = {
  get: jest.fn(),
  post: jest.fn(),
  put: jest.fn(),
  delete: jest.fn(),
};

// Default export mock (with .create)
export default {
  ...actualAxios,
  create: jest.fn(() => api), // 👈 so axios.create() returns your fake api
};
