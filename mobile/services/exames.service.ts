import api from './api';

export const getExames = async () => {
  try {
    const response = await api.get('/exames');
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const createExame = async (exameData: any) => {
  try {
    const response = await api.post('/exames', exameData);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const updateExame = async (id: string, exameData: any) => {
  try {
    const response = await api.put(`/exames/${id}`, exameData);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const deleteExame = async (id: string) => {
  try {
    await api.delete(`/exames/${id}`);
  } catch (error) {
    throw error;
  }
};