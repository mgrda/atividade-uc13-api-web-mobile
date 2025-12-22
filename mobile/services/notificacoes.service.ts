import api from './api';

export const getNotificacoes = async () => {
  try {
    const response = await api.get('/notificacoes');
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const createNotificacao = async (notificacaoData: any) => {
  try {
    const response = await api.post('/notificacoes', notificacaoData);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const deleteNotificacao = async (id: string) => {
  try {
    await api.delete(`/notificacoes/${id}`);
  } catch (error) {
    throw error;
  }
};