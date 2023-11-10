import {create} from 'zustand'
import {fetchBoardData} from "@/lib/utils/fetchBoardData";
import {addTaskInDB, deleteTaskInDB, updateTaskInDB} from "@/lib/api/resourcesApi";

interface BoardState{
    board: Board;
    getBoard:() => void;
    setBoardState: (board:Board) => void;
    taskInput: string;
    setTaskInput: (input: string) => void;
    taskType: TypedColumn;
    setTaskType: (columnId: TypedColumn) => void;
    taskDescription: string
    setTaskDescription: (input: string) => void;
    image: File | null;

    searchString: string;
    setSearchString: (searchString: string) => void;

    addTask: (title: string, columnId: TypedColumn,  taskDescription: string, image?: File | null) => void;
    deleteTask: (taskIndex: number, task: Task, id: TypedColumn) => void;
    updateTask: (title: string, columnId: TypedColumn, description: string, task: Task, taskIndex: number, image?: File | null) => void;
    setImage: (image:  File  | null) => void;
}

export const useBoardStore = create<BoardState>((set, get) => ({
    board: {
        columns: new Map<TypedColumn, Column>()
    },

    taskInput: "",
    taskDescription: "",
    taskType: "TODO",
    image: null,

    searchString: "",
    setSearchString: (searchString) => set({ searchString }),

    getBoard: async() => {
        const board = await fetchBoardData();
        set({board});

    },

    setBoardState: (board) => set({board}),
    setTaskInput: (input: string) => set({ taskInput: input}),
    setTaskDescription: (input: string) => set({ taskDescription: input}),
    setTaskType: (columnId: TypedColumn) => set({taskType: columnId}),
    setImage: (image: File | null) => set({ image }),

    deleteTask: async (taskIndex: number, task: Task, status: TypedColumn) =>{
        const newColumns = new Map(get().board.columns);

        // delete task from newColumns
        newColumns.get(status)?.tasks.splice(taskIndex, 1);

        set({board: {columns: newColumns}})

        await deleteTaskInDB(task.id);
    },

    //TODO description
    addTask: async (title: string, columnId: TypedColumn, taskDescription : string, image?: File  | null) =>{
        // let file: Image | undefined;

        const newTask: Task = {
            id: "",
            createdAt: new Date().toISOString(),
            title: title,
            description: taskDescription,
            status: columnId,
            image: image
        };

        newTask.id = await addTaskInDB(newTask);

        // set({taskInput: ""});
        set((state) => {
            const newColumns = new Map(state.board.columns);

            const column = newColumns.get(columnId)

            if(!column) {
                newColumns.set(columnId, {
                    id: columnId,
                    tasks: [newTask]
                });
            } else {
                newColumns.get(columnId)?.tasks.push(newTask);
            }

            return {
                board: {
                    columns: newColumns
                },
            };
        });
    },

    updateTask: async (title: string, columnId: TypedColumn, description: string, task: Task,
                       taskIndex: number, image?: File  | null) =>{
        const newColumns = new Map(get().board.columns);

        const updatedTask: Task = {
            id: task.id,
            createdAt: task.createdAt,
            title: title,
            description: description,
            status: columnId,
            image: image
        };

        await updateTaskInDB(updatedTask);
        // delete task from newColumns
        newColumns.get(task.status)?.tasks.splice(taskIndex, 1);

        set({board: {columns: newColumns}})

        set({taskInput: ""});
        set((state) => {
            const newColumns = new Map(state.board.columns);

            const column = newColumns.get(columnId)

            if(!column) {
                newColumns.set(columnId, {
                    id: columnId,
                    tasks: [updatedTask]
                });
            } else {
                newColumns.get(columnId)?.tasks.push(updatedTask);
            }

            return {
                board: {
                    columns: newColumns
                },
            };
        });
    },


}));