import axios from 'axios';

const API_BASE_URL = 'http://localhost:8001/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const elderApi = {
  getAll: () => api.get('/elders'),
  getById: (id) => api.get(`/elders/${id}`),
  getActive: () => api.get('/elders/active'),
  create: (data) => api.post('/elders', data),
  update: (id, data) => api.put(`/elders/${id}`, data),
  delete: (id) => api.delete(`/elders/${id}`),
  updateCareLevel: (id, careLevel) => api.put(`/elders/${id}/care-level?careLevel=${careLevel}`),
  updateHealthStatus: (id, healthStatus) => api.put(`/elders/${id}/health-status?healthStatus=${healthStatus}`),
  setTemporaryLeave: (id, isTemporaryLeave) => api.put(`/elders/${id}/temporary-leave?isTemporaryLeave=${isTemporaryLeave}`),
};

export const roomApi = {
  getAll: () => api.get('/rooms'),
  getById: (id) => api.get(`/rooms/${id}`),
  getByCareArea: (careArea) => api.get(`/rooms/care-area/${careArea}`),
  create: (data) => api.post('/rooms', data),
  getAllBeds: () => api.get('/rooms/beds'),
  getBedById: (id) => api.get(`/rooms/beds/${id}`),
  getAvailableBeds: () => api.get('/rooms/beds/available'),
  getBedsByRoom: (roomId) => api.get(`/rooms/${roomId}/beds`),
  createBed: (roomId, data) => api.post(`/rooms/${roomId}/beds`, data),
  assignBed: (bedId, elderId, elderName) => api.put(`/rooms/beds/${bedId}/assign?elderId=${elderId}&elderName=${encodeURIComponent(elderName)}`),
  releaseBed: (bedId) => api.put(`/rooms/beds/${bedId}/release`),
};

export const carePlanApi = {
  getAll: () => api.get('/care-plans'),
  getById: (id) => api.get(`/care-plans/${id}`),
  getByElderId: (elderId) => api.get(`/care-plans/elder/${elderId}`),
  getAllTasks: () => api.get('/care-plans/tasks'),
  getTaskById: (id) => api.get(`/care-plans/tasks/${id}`),
  getTasksByDate: (date) => api.get(`/care-plans/tasks/date/${date}`),
  getTasksByElderAndDate: (elderId, date) => api.get(`/care-plans/tasks/elder/${elderId}/date/${date}`),
  completeTask: (taskId, data) => api.put(`/care-plans/tasks/${taskId}/complete`, null, { params: data }),
  pauseTask: (taskId) => api.put(`/care-plans/tasks/${taskId}/pause`),
  resumeTask: (taskId) => api.put(`/care-plans/tasks/${taskId}/resume`),
};

export const medicationApi = {
  getAll: () => api.get('/medications'),
  getById: (id) => api.get(`/medications/${id}`),
  getByElder: (elderId) => api.get(`/medications/elder/${elderId}`),
  create: (data) => api.post('/medications', data),
  update: (id, data) => api.put(`/medications/${id}`, data),
  deactivate: (id) => api.put(`/medications/${id}/deactivate`),
  delete: (id) => api.delete(`/medications/${id}`),
};

export const visitApi = {
  getAll: () => api.get('/visits'),
  getById: (id) => api.get(`/visits/${id}`),
  getByElder: (elderId) => api.get(`/visits/elder/${elderId}`),
  getPending: () => api.get('/visits/pending'),
  create: (data) => api.post('/visits', data),
  checkIn: (id) => api.put(`/visits/${id}/check-in`),
  checkOut: (id, note) => api.put(`/visits/${id}/check-out?note=${encodeURIComponent(note || '')}`),
  cancel: (id) => api.put(`/visits/${id}/cancel`),
  delete: (id) => api.delete(`/visits/${id}`),
};

export const billApi = {
  getAll: () => api.get('/bills'),
  getById: (id) => api.get(`/bills/${id}`),
  getByElder: (elderId) => api.get(`/bills/elder/${elderId}`),
  getUnpaid: () => api.get('/bills/unpaid'),
  generate: (elderId, year, month) => api.post(`/bills/generate?elderId=${elderId}&year=${year}&month=${month}`),
  pay: (id, amount, paymentMethod) => api.post(`/bills/${id}/pay?amount=${amount}&paymentMethod=${encodeURIComponent(paymentMethod)}`),
};

export const alertApi = {
  getAll: () => api.get('/alerts'),
  getById: (id) => api.get(`/alerts/${id}`),
  getActive: () => api.get('/alerts/active'),
  getByElder: (elderId) => api.get(`/alerts/elder/${elderId}`),
  create: (data) => api.post('/alerts', null, { params: data }),
  handle: (id, handledBy, handleNote) => api.put(`/alerts/${id}/handle?handledBy=${encodeURIComponent(handledBy || '')}&handleNote=${encodeURIComponent(handleNote || '')}`),
};

export const checkInApi = {
  checkIn: (data) => api.post('/check-in', data),
};

export const checkOutApi = {
  checkOut: (elderId, reason) => api.post(`/check-out?elderId=${elderId}&reason=${encodeURIComponent(reason || '')}`),
};

export const commonApi = {
  getCareLevels: () => api.get('/common/care-levels'),
  getCareLevelById: (id) => api.get(`/common/care-levels/${id}`),
  getCareLevelByCode: (code) => api.get(`/common/care-levels/code/${code}`),
  getNurses: () => api.get('/common/nurses'),
  getNurseById: (id) => api.get(`/common/nurses/${id}`),
  getOnDutyNurses: () => api.get('/common/nurses/on-duty'),
  getCareAreas: () => api.get('/common/care-areas'),
  getRoomTypes: () => api.get('/common/room-types'),
  getHealthStatus: () => api.get('/common/health-status'),
};

export default api;
