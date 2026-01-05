import { StateCreator } from 'zustand'

export interface Appointment {
    id: string
    date: string
    patientName: string
    description: string
}

export interface AgendaSlice {
    appointments: Appointment[]
    addAppointment: (appointment: Appointment) => void
    removeAppointment: (id: string) => void
    updateAppointment: (id: string, updatedAppointment: Partial<Appointment>) => void
}

export const createAgendaSlice: StateCreator<AgendaSlice> = (set) => ({
    appointments: [],
    addAppointment: (appointment) =>
        set((state) => ({ appointments: [...state.appointments, appointment] })),
    removeAppointment: (id) =>
        set((state) => ({
            appointments: state.appointments.filter((appt) => appt.id !== id),
        })),
    updateAppointment: (id, updatedAppointment) =>
        set((state) => ({
            appointments: state.appointments.map((appt) =>
                appt.id === id ? { ...appt, ...updatedAppointment } : appt
            ),
        })),
})
