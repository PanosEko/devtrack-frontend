import {Draggable, Droppable} from "react-beautiful-dnd";
import {PlusCircleIcon} from "@heroicons/react/20/solid";
import TaskCard from "@/components/TaskCard";
import {useBoardStore} from "@/store/BoardStore";
import {useModalStore} from "@/store/ModalStore";

type Props = {
    id: TypedColumn;
    tasks: Task[];
    index: number;
};

const idToColumnText: {
    [key in TypedColumn]: string;
} = {
    "TODO" : "To Do",
    "IN_PROGRESS" : "In Progress",
    "IN_REVIEW" : "In Review",
    "DONE" : "Done",
}

function Column({id, tasks, index} :Props) {
    const [searchString] = useBoardStore((state) => [state.searchString]);
    const openUpdateTaskModal = useModalStore((state) => state.openUpdateTaskModal);
    const openAddTaskModal = useModalStore((state) => state.openAddTaskModal);


    return  (
     <Draggable draggableId={id} index={index}>
         {(provided) => (
             <div
                 {...provided.draggableProps}
                 {...provided.dragHandleProps}
                 ref={provided.innerRef}
                 >
                 {/* render droppable tasks in the column */}
                 <Droppable droppableId={index.toString()} type="card">
                     {(provided, snapshot) =>(
                         <div
                             {...provided.droppableProps}
                             ref={provided.innerRef}
                             className={`p-2 rounded-2xl shadow-sm ${
                                 snapshot.isDraggingOver ? "bg-green-200" : "bg-white/50"
                             }`}
                             >
                             <h2 className="flex justify-between font-bold text-xl p-2 py-1">
                                 {idToColumnText[id]}
                             <span className={"text-gray-500 bg-gray-200 rounded-full " +
                                 "px-2 py-2 text-sm font-normal"}>
                                 {tasks.length}
                             </span>
                             </h2>
                             <div className="space-y-2">
                             {tasks.map((task, index) =>{
                                 if(
                                     searchString &&
                                     !task.title
                                         .toLowerCase()
                                         .includes(searchString.toLowerCase())
                                 )
                                     return null;

                                 return(
                                     <Draggable
                                     key={task.id}
                                     draggableId={task.id}
                                     index={index}
                                 >
                                     {(provided) =>(
                                         <TaskCard
                                             task={task}
                                             index={index}
                                             id={id}
                                             innerRef={provided.innerRef}
                                             draggableProps={provided.draggableProps}
                                             dragHandleProps={provided.dragHandleProps}
                                             // onDoubleClick={openModal}
                                             onDoubleClick={() => openUpdateTaskModal(task, index)} // Pass the task to the openModal function
                                         />
                                     )}
                                 </Draggable>
                             )})}

                             {provided.placeholder}
                                 <div className="flex items-end justify-end p-2">
                                     <button onClick={() => openAddTaskModal(id)} className="text-green-500 hover:text-green-600">
                                        <PlusCircleIcon className="h-10 w-10"/>
                                    </button>
                                 </div>
                             </div>
                         </div>
                     )}
                 </Droppable>
             </div>
         )}
     </Draggable>
    );
}

export default Column