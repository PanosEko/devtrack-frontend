import TypedArray = NodeJS.TypedArray;

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
    image?: File | null;
}

// interface Image{
//     imageData : Uint8Array
//     name: string
//     type: string
//     id: string;
// }

