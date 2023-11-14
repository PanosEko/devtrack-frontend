
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
    imagePreview?: ImagePreview ;
}

interface ImagePreview {
    id: string;
    data: Uint8Array ;
}


