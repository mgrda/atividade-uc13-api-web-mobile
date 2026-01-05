import { create } from 'zustand'
import { AuthSlice, createAuthSlice } from './slices/authSlice'
import { AgendaSlice, createAgendaSlice } from './slices/agendaSlice'
import { ExamesSlice, createExamesSlice } from './slices/examesSlice'

type StoreState = AuthSlice & AgendaSlice & ExamesSlice

export const useStore = create<StoreState>()((...a) => ({
    ...createAuthSlice(...a),
    ...createAgendaSlice(...a),
    ...createExamesSlice(...a),
}))
