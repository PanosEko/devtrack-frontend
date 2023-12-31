import {create} from "zustand";

interface ModalState {
    isAddTaskModalOpen: boolean;
    isUpdateTaskModalOpen: boolean;
    task: Task | null; // Add the task property
    status: TypedColumn| null;
    taskIndex : number | null;
    imageFile: File | null;
    setImageFile: (imageFile: File | null) => void;
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
    isUpdateTaskModalOpen: false,
    task: null,
    taskIndex: null,
    imageFile: null,
    openAddTaskModal: (status: TypedColumn) =>
        set({ isAddTaskModalOpen: true, status: status}),
    closeAddTaskModal: () => set({ isAddTaskModalOpen: false, status: null}), // Clear the task

    openUpdateTaskModal: (task: Task, taskIndex: number) =>{
        set({ isUpdateTaskModalOpen: true, task: task!, taskIndex: taskIndex!})},
    closeUpdateTaskModal: () => set({ isUpdateTaskModalOpen: false, taskIndex: null, imageFile: null}), // Clear the task

    setImageFile: (imageFile: File | null) => set({ imageFile }),

}));
