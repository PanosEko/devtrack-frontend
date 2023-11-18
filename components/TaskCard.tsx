'use client'
import {DraggableProvidedDraggableProps, DraggableProvidedDragHandleProps} from "react-beautiful-dnd";
import {XCircleIcon} from "@heroicons/react/20/solid";
import {useBoardStore} from "@/store/BoardStore";
import Image from 'next/image';
import {useEffect} from "react";
import {useModalStore} from "@/store/ModalStore";

type Props = {
    task: Task;
    index: number;
    id: TypedColumn;
    innerRef: (element: HTMLElement | null) => void;
    draggableProps: DraggableProvidedDraggableProps;
    dragHandleProps: DraggableProvidedDragHandleProps | null | undefined;
    onDoubleClick: () => void; // Add onDoubleClick prop

};

function TaskCard({
    task,
    index,
    id,
    innerRef,
    draggableProps,
    dragHandleProps,
    onDoubleClick,
}: Props) {

    // let imageUrl: string = ""; // Declare imageUrl variable
    // if(task.image) {
    //     imageUrl = URL.createObjectURL(task.image)
    // }
    const deleteTask = useBoardStore((state) => state.deleteTask)



    return(
        <div
            className="bg-white rounded-md space-y-2 drop-shadow-md"
            {...draggableProps}
            {...dragHandleProps}
            ref={innerRef}
            onDoubleClick={onDoubleClick}

        >
            <div className="flex justify-between items-center p-5">
                <p style={{ fontWeight: 500 }}>{task.title}</p>
                <button onClick={()=> deleteTask(index, task , id)}
                    className="text-red-500 hover:text-red-600">
                    <XCircleIcon className=" h-6 w-6" />
                </button>
            </div>
            {task.thumbnail && (
                <div className="h-full w-full rounded-b-md">
                    <Image
                        src={`data:image/jpeg;base64,${task.thumbnail.data}`}
                        alt="Task image"
                        width={400}
                        height={400}
                        className="w-full object-contain rounded-b-md"
                    />
                </div>
            )}

        </div>
    )
}

export default TaskCard
