export const getBoardSkeleton = async () => {
    const columnTypes = ["TODO", "IN_PROGRESS", "IN_REVIEW", "DONE"];

    const columns = createEmptyColumns(columnTypes);

    const board: Board = {
        columns: columns,
    };

    return board;
};

// Create empty columns
const createEmptyColumns = (columnTypes: any) => {
    const columns = new Map();
    for (const columnType of columnTypes) {
        columns.set(columnType, {
            id: columnType,
            tasks: [],
        });
    }
    return columns;
};