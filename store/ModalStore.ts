import {create} from "zustand";

interface ModalState {
    isOpen: boolean;
    identifier: Task | TypedColumn | null; // Add the task property
    taskIndex :number | null;
    openModal: (identifier?: Task | TypedColumn, index? :number) => void; // Update the parameter to be required
    closeModal: () => void;
}

export const useModalStore = create<ModalState>((set) => ({
    isOpen: false,
    identifier: null, // Initialize the task as null
    taskIndex: null,
    openModal: (identifier?: Task | TypedColumn,  taskIndex? :number) =>
        set({ isOpen: true, identifier: identifier || null, taskIndex: taskIndex  }),
    closeModal: () => set({ isOpen: false, identifier: null, taskIndex: null }), // Clear the task
}));
