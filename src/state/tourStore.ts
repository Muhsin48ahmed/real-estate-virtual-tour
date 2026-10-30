import { createStore } from 'zustand/vanilla'
import type { TourLocation } from './urlState'

export type TourMode = 'overview' | 'room'

export interface TourState {
  readonly propertyId: string
  readonly mode: TourMode
  readonly activeRoomId: string | null
  readonly visitedRoomIds: readonly string[]
  readonly isInquiryOpen: boolean
  selectProperty: (propertyId: string) => void
  enterRoom: (roomId: string) => void
  showOverview: () => void
  openInquiry: () => void
  closeInquiry: () => void
}

export const createTourStore = ({ propertyId, roomId }: TourLocation) =>
  createStore<TourState>()((set) => ({
    propertyId,
    mode: roomId ? 'room' : 'overview',
    activeRoomId: roomId,
    visitedRoomIds: roomId ? [roomId] : [],
    isInquiryOpen: false,

    selectProperty: (id) =>
      set({ propertyId: id, mode: 'overview', activeRoomId: null, visitedRoomIds: [], isInquiryOpen: false }),

    enterRoom: (id) =>
      set((state) => ({
        mode: 'room',
        activeRoomId: id,
        visitedRoomIds: state.visitedRoomIds.includes(id) ? state.visitedRoomIds : [...state.visitedRoomIds, id],
      })),

    showOverview: () => set({ mode: 'overview', activeRoomId: null }),
    openInquiry: () => set({ isInquiryOpen: true }),
    closeInquiry: () => set({ isInquiryOpen: false }),
  }))

export type TourStore = ReturnType<typeof createTourStore>
