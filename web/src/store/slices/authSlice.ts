import { StateCreator } from 'zustand'

export interface AuthSlice {
    user: { id: string; name: string; email: string; role: string } | null
    token: string | null
    isAuthenticated: boolean
    login: (user: { id: string; name: string; email: string; role: string }, token: string) => void
    logout: () => void
}

export const createAuthSlice: StateCreator<AuthSlice> = (set) => ({
    user: null,
    token: null,
    isAuthenticated: false,
    login: (user, token) => set({ user, token, isAuthenticated: true }),
    logout: () => set({ user: null, token: null, isAuthenticated: false }),
})
