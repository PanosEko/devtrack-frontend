
interface Board{
    columns: Map<TypedColumn, Column>
}

type TypedColumn =  "TODO" | "IN_PROGRESS" | "IN_REVIEW" | "DONE"

interface Column {
    id: TypedColumn;
    tasks: Task[];
}

interface Task {
    id: string;
    createdAt: string;
    title: string;
    description: string;
    status: TypedColumn;
    thumbnail: Thumbnail | null;
}

interface Thumbnail {
    id: string;
    data: Uint8Array ;
}


