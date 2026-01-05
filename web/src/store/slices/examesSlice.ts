import { StateCreator } from 'zustand'

export interface Exam {
    id: string
    name: string
    date: string
    result?: string
}

export interface ExamesSlice {
    exams: Exam[]
    addExam: (exam: Exam) => void
    removeExam: (id: string) => void
}

export const createExamesSlice: StateCreator<ExamesSlice> = (set) => ({
    exams: [],
    addExam: (exam) => set((state) => ({ exams: [...state.exams, exam] })),
    removeExam: (id) =>
        set((state) => ({ exams: state.exams.filter((exam) => exam.id !== id) })),
})
