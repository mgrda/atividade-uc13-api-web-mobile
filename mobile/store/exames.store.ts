import { makeAutoObservable } from 'mobx';
import { Exame } from './types';

class ExamesStore {
  exames: Exame[] = [];

  constructor() {
    makeAutoObservable(this);
  }

  setExames(exames: Exame[]) {
    this.exames = exames;
  }

  addExame(exame: Exame) {
    this.exames.push(exame);
  }

  removeExame(id: string) {
    this.exames = this.exames.filter((exame) => exame.id !== id);
  }
}

const examesStore = new ExamesStore();
export default examesStore;