import {fetchTasks} from "@/lib/api/resourcesApi";

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
            ...(task.imagePreview && { imagePreview: task.imagePreview}),

        });

        return acc;
    }, new Map());
};

// add empty columns if a column has no tasks
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

// sorts columns based on columnTypes order
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

const imageByteArrayToURL = (imagePreview: Uint8Array) => {
    console.log(imagePreview)
    var blob = new Blob([imagePreview], { type: "image/jpeg" });
    return URL.createObjectURL(blob);
};
