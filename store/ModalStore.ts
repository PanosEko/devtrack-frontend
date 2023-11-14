import {create} from "zustand";

interface ModalState {
    isAddTaskModalOpen: boolean;
    isUpdateTaskModalOpen:boolean;
    task: Task | null; // Add the task property
    status: TypedColumn| null;
    taskIndex :number | null;
    // openModal: (identifier?: Task | TypedColumn, index? :number) => void;
    openAddTaskModal: (status: TypedColumn) => void;
    openUpdateTaskModal: (task: Task, taskIndex: number) => void;

    // closeModal: () => void;
    closeAddTaskModal: () => void;
    closeUpdateTaskModal: () => void;

}

export const useModalStore = create<ModalState>((set) => ({
    status: null,
    isAddTaskModalOpen: false,
    isUpdateTaskModalOpen:false,
    task: null,
    taskIndex: null,
    openAddTaskModal: (status: TypedColumn) =>
        set({ isAddTaskModalOpen: true, status: status}),
    closeAddTaskModal: () => set({ isAddTaskModalOpen: false, status: null}), // Clear the task
    openUpdateTaskModal: (task: Task, taskIndex: number) =>
        set({ isUpdateTaskModalOpen: true, task: task, taskIndex: taskIndex}),
    closeUpdateTaskModal: () => set({ isUpdateTaskModalOpen: false, taskIndex: null}), // Clear the task
    // openModal: (identifier?: Task | TypedColumn,  taskIndex? :number) =>
    //     set({ isOpen: true, identifier: identifier || null, taskIndex: taskIndex  }),
    // closeModal: () => set({ isOpen: false, identifier: null, taskIndex: null }), // Clear the task
}));
