import api from './api';

export const getResultados = async () => {
  try {
    const response = await api.get('/resultados');
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const createResultado = async (resultadoData: any) => {
  try {
    const response = await api.post('/resultados', resultadoData);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const updateResultado = async (id: string, resultadoData: any) => {
  try {
    const response = await api.put(`/resultados/${id}`, resultadoData);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const deleteResultado = async (id: string) => {
  try {
    await api.delete(`/resultados/${id}`);
  } catch (error) {
    throw error;
  }
};