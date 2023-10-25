import {fetchTasks} from "@/lib/api/taskApi";

// export const fetchBoardData = async () => {
//     const tasks = await getTasks();
//     const columns = tasks.reduce((acc: any, task: any) => {
//         if (!acc.get(task.status)) {
//             acc.set(task.status, {
//                 id: task.status,
//                 tasks: [],
//             });
//         }
//         acc.get(task.status)!.tasks.push({
//             id: task.id.toString(),
//             createdAt: task.createdAt,
//             title: task.title,
//             status: task.status,
//             createdById: task.createdById,
//             description: task.description,
//             ...(task.image && { image: convertImageDataToBlobFile(task.image) }),
//         });
//         return acc;
//     }, new Map<TypedColumn, Column>());
//
//     const columnTypes: TypedColumn[] = ["TODO", "IN_PROGRESS", "IN_REVIEW", "DONE"];
//     // Add empty column when column has not tasks
//     for (const columnType of columnTypes) {
//         if (!columns.get(columnType)) {
//             columns.set(columnType, {
//                 id: columnType,
//                 tasks: [],
//             });
//         }
//     }
//     // Sort the column in the specific order defined by the columnTypes array
//     const sortedColumns: Map<TypedColumn, Column> = new Map(
//         [...columns.entries()].sort((a, b) => columnTypes.indexOf(a[0]) - columnTypes.indexOf(b[0]))
//     );
//     const board: Board = {
//         columns: sortedColumns,
//     };
//     return board;
// };

export const fetchBoardData = async () => {
    const tasks = await fetchTasks();
    const columns = groupTasksByColumn(tasks);

    const columnTypes = ["TODO", "IN_PROGRESS", "IN_REVIEW", "DONE"];
    addEmptyColumns(columns, columnTypes);

    const sortedColumns:  Map<TypedColumn, Column> = sortColumns(columns, columnTypes);

    const board: Board = {
        columns: sortedColumns,
    };

    return board;
};

// Helper function to group tasks by column status
const groupTasksByColumn = (tasks :any) => {
    return tasks.reduce((acc: any, task: any) => {
        if (!acc.get(task.status)) {
            acc.set(task.status, {
                id: task.status,
                tasks: [],
            });
        }
        acc.get(task.status)!.tasks.push({
            id: task.id.toString(),
            createdAt: task.createdAt,
            title: task.title,
            status: task.status,
            createdById: task.createdById,
            description: task.description,
            ...(task.image && { image: convertImageDataToBlobFile(task.image) }),
        });
        return acc;
    }, new Map());
};

// Helper function to add empty columns if a column has no tasks
const addEmptyColumns = (columns: any, columnTypes: any) => {
    for (const columnType of columnTypes) {
        if (!columns.get(columnType)) {
            columns.set(columnType, {
                id: columnType,
                tasks: [],
            });
        }
    }
};

// Helper function to sort columns based on columnTypes order
const sortColumns = (columns: any, columnTypes: any) => {
    const sortedColumns: Map<TypedColumn, Column> = new Map(
    [...columns.entries()].sort((a, b) => columnTypes.indexOf(a[0]) - columnTypes.indexOf(b[0]))
    );
    return sortedColumns;
};


const convertImageDataToBlobFile = (image: any) => {
    const imageData = atob(image.imageData);
    const byteString = new Uint8Array(imageData.length);
    for (let i = 0; i < imageData.length; i++) {
        byteString[i] = imageData.charCodeAt(i);
    }
    const blob = new Blob([byteString], { type: image.type });
    return new File([blob], image.name, { type: image.type });
};
