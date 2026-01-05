import { makeAutoObservable } from 'mobx';
import { User } from './types';

class AuthStore {
  user: User | null = null;
  token = '';

  constructor() {
    makeAutoObservable(this);
  }

  setUser(user: User) {
    this.user = user;
  }

  setToken(token: string) {
    this.token = token;
  }

  logout() {
    this.user = null;
    this.token = '';
  }
}

const authStore = new AuthStore();
export default authStore;