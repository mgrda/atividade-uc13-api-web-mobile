import { makeAutoObservable } from 'mobx';
import { Agendamento } from './types';

class AgendaStore {
  agendamentos: Agendamento[] = [];

  constructor() {
    makeAutoObservable(this);
  }

  setAgendamentos(agendamentos: Agendamento[]) {
    this.agendamentos = agendamentos;
  }

  addAgendamento(agendamento: Agendamento) {
    this.agendamentos.push(agendamento);
  }

  removeAgendamento(index: number) {
    this.agendamentos.splice(index, 1);
  }
}

const agendaStore = new AgendaStore();
export default agendaStore;