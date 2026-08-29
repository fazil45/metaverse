import { create } from "zustand";

type ModalProps = {
    isOpen:boolean
    setIsOpen:() => void
}

export const useModal = create<ModalProps>((set) => ({
    isOpen:false,
    setIsOpen:() => set((state) => ({isOpen: !state.isOpen})   )
    
}))