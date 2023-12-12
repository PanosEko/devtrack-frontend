import React, { useEffect } from "react";
import { DragDropContext, Droppable, DropResult } from "react-beautiful-dnd";
import { useBoardStore } from "@/store/BoardStore";
import Column from "@/components/Column";
import { updateTaskStatusInDB} from "@/lib/api/resourcesApi";
import { toast, Toaster } from "react-hot-toast";

function Board() {
  const [board, getBoard, setBoardState] = useBoardStore((state) => [
    state.board,
    state.getBoard,
    state.setBoardState,
  ]);

  useEffect(() => {
    getBoard();
  }, [getBoard]);

  const handleOnDragEnd = async (result: DropResult) => {
    const { destination, source, type } = result;
    // Check if user dragged card outside of board
    if (!destination) return;

    //Handle column drag
    if (type === "column") {
      const entries = Array.from(board.columns.entries());
      const [removed] = entries.splice(source.index, 1);
      entries.splice(destination.index, 0, removed);
      const rearrangedColumns = new Map(entries);
      setBoardState({
        ...board,
        columns: rearrangedColumns,
      });
      return;
    }

    // This step is needed as the indexes are stored as numbers instead of id's with DND library
    const columns = Array.from(board.columns);
    const startColIndex = columns[Number(source.droppableId)];
    const finishColIndex = columns[Number(destination.droppableId)];
    const startCol: Column = {
      id: startColIndex[0],
      tasks: startColIndex[1].tasks,
    };

    const finishCol: Column = {
      id: finishColIndex[0],
      tasks: finishColIndex[1].tasks,
    };

    if (!startCol || !finishCol) return;

    if (source.index === destination.index && startCol === finishCol) return;

    const newTasks = startCol.tasks;
    const [taskMoved] = newTasks.splice(source.index, 1);

    if (startCol.id === finishCol.id) {
      // Same column task drag
      newTasks.splice(destination.index, 0, taskMoved);
      const newCol = {
        id: startCol.id,
        tasks: newTasks,
      };
      const newColumns = new Map(board.columns);
      newColumns.set(startCol.id, newCol);

      setBoardState({
        ...board,
        columns: newColumns,
      });
    } else {
      // dragging to another column
      try{
        const finishTasks = Array.from(finishCol.tasks);
        finishTasks.splice(destination.index, 0, taskMoved);

        const newColumns = new Map(board.columns);
        const newCol = {
          id: startCol.id,
          tasks: newTasks,
        };

        newColumns.set(startCol.id, newCol);
        newColumns.set(finishCol.id, {
          id: finishCol.id,
          tasks: finishTasks,
        });
        taskMoved.status = finishCol.id;
        setBoardState({ ...board, columns: newColumns });
        await updateTaskStatusInDB(taskMoved.id, finishCol.id)
      } catch (error: any) {
        // Revert changes
        newTasks.splice(destination.index, 0, taskMoved);
        const newCol = {
          id: startCol.id,
          tasks: newTasks,
        };
        const newColumns = new Map(board.columns);
        newColumns.set(startCol.id, newCol);

        setBoardState({
          ...board,
          columns: newColumns,
        });

        toast.error("Connection lost. Task status not updated.");
        console.log(error);
      }

    }
  };

  return (
    <DragDropContext onDragEnd={handleOnDragEnd}>
      <div>
        <Toaster />
      </div>
      <Droppable droppableId="board" direction="horizontal" type="column">
        {(provided) => (
          <div
            className={
              "grid grid-cols-1 md:grid-cols-4 gap-5 max-w-screen-2xl mx-auto mt-6"
            }
            {...provided.droppableProps}
            ref={provided.innerRef}
          >
            {Array.from(board.columns.entries()).map(([id, column], index) => (
              <Column key={id} id={id} tasks={column.tasks} index={index} />
            ))}
          </div>
        )}
      </Droppable>
    </DragDropContext>
  );
}

export default Board;
// updateTaskStatusInDB(taskMoved.id, finishCol.id)
//   .then(() => {
//     const finishTasks = Array.from(finishCol.tasks);
//     finishTasks.splice(destination.index, 0, taskMoved);
//
//     const newColumns = new Map(board.columns);
//     const newCol = {
//       id: startCol.id,
//       tasks: newTasks,
//     };
//
//
//     newColumns.set(startCol.id, newCol);
//     newColumns.set(finishCol.id, {
//       id: finishCol.id,
//       tasks: finishTasks,
//     });
//     taskMoved.status = finishCol.id;
//     setBoardState({ ...board, columns: newColumns });
//   })
//   .catch((error: any) => {
//     // Revert changes
//     newTasks.splice(destination.index, 0, taskMoved);
//     const newCol = {
//       id: startCol.id,
//       tasks: newTasks,
//     };
//     const newColumns = new Map(board.columns);
//     newColumns.set(startCol.id, newCol);
//
//     setBoardState({
//       ...board,
//       columns: newColumns,
//     });
//
//     toast.error("Connection lost. Task status not updated.");
//     console.log(error);
//   });