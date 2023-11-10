import {create} from "zustand";

interface ModalState {
    isOpen: boolean;
    isAddTaskModalOpen: boolean;
    identifier: Task | TypedColumn | null; // Add the task property
    status: TypedColumn| null;
    taskIndex :number | null;
    openModal: (identifier?: Task | TypedColumn, index? :number) => void;
    openAddTaskModal: (status: TypedColumn) => void;
    closeModal: () => void;
    closeAddTaskModal: () => void;
}

export const useModalStore = create<ModalState>((set) => ({

    isOpen: false,
    status: null,
    isAddTaskModalOpen: false,
    identifier: null, // Initialize the task as null
    taskIndex: null,
    openAddTaskModal: (status: TypedColumn) =>
        set({ isAddTaskModalOpen: true, status: status}),
    closeAddTaskModal: () => set({ isAddTaskModalOpen: false, status: null}), // Clear the task
    openModal: (identifier?: Task | TypedColumn,  taskIndex? :number) =>
        set({ isOpen: true, identifier: identifier || null, taskIndex: taskIndex  }),
    closeModal: () => set({ isOpen: false, identifier: null, taskIndex: null }), // Clear the task
}));
