import api from './api';

export const getConsultas = async () => {
  try {
    const response = await api.get('/consultas');
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const createConsulta = async (consultaData: any) => {
  try {
    const response = await api.post('/consultas', consultaData);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const updateConsulta = async (id: string, consultaData: any) => {
  try {
    const response = await api.put(`/consultas/${id}`, consultaData);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const deleteConsulta = async (id: string) => {
  try {
    await api.delete(`/consultas/${id}`);
  } catch (error) {
    throw error;
  }
};