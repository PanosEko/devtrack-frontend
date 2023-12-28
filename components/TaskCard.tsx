"use client";
import {
  DraggableProvidedDraggableProps,
  DraggableProvidedDragHandleProps,
} from "react-beautiful-dnd";
import { XCircleIcon } from "@heroicons/react/20/solid";
import { useBoardStore } from "@/store/BoardStore";
import Image from "next/image";
import {toast} from "react-hot-toast";

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

  const deleteTask = useBoardStore((state) => state.deleteTask);

  const handleDeleteTask = async (index: number, task: Task, id: TypedColumn) => {
    try {
      await deleteTask(index, task, id);
    } catch (error) {
      toast.error("Oops! Something went wrong. Task was not deleted.");
    }
  }
  return (
    <div
      className="bg-white rounded-md space-y-2 drop-shadow-md"
      {...draggableProps}
      {...dragHandleProps}
      ref={innerRef}
      onDoubleClick={onDoubleClick}
    >
      <div className="flex justify-between items-center p-5">
        <p style={{ fontWeight: 500 }}>{task.title}</p>
        <button
            onClick={() => handleDeleteTask(index, task, id)}
          className="text-red-500 hover:text-red-600"
        >
          <XCircleIcon className=" h-6 w-6" />
        </button>
      </div>
      {task.thumbnail && (
        <div className="h-full w-full rounded-b-md">
          <Image
            src={`data:image/jpeg;base64,${task.thumbnail.data}`}
            alt="Task image"
            width={200}
            height={200}
            className="w-full h-44 object-cover rounded-b-md"
          />
        </div>
      )}
    </div>
  );
}

export default TaskCard
