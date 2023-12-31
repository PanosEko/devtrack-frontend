"use client";
import { useBoardStore } from "@/store/BoardStore";
import { RadioGroup } from "@headlessui/react";
import { CheckCircleIcon } from "@heroicons/react/20/solid";

const types = [
  {
    id: "TODO",
    name: "Todo",
    color: "bg-red-500",
  },
  {
    id: "IN_PROGRESS",
    name: "In Progress",
    color: "bg-yellow-500",
  },
  {
    id: "IN_REVIEW",
    name: "In Review",
    color: "bg-blue-500",
  },
  {
    id: "DONE",
    name: "Done",
    color: "bg-green-500",
  },
];

function AddTaskRadioGroup() {
  const [setNewTaskType, newTaskType] = useBoardStore((state) => [
    state.setTaskType,
    state.taskType,
  ]);

  return (
    <div className="w-full px-4 py-5">
      <div className="mx-auto w-full max-w-md">
        <RadioGroup value={newTaskType} onChange={(e) => setNewTaskType(e)}>
          <RadioGroup.Label className="sr-only">Server size</RadioGroup.Label>
          <div className="flex space-x-2">
            {types.map((type) => (
              <RadioGroup.Option
                key={type.id}
                value={type.id}
                className={({ active, checked }) =>
                  `${
                    active
                      ? "ring-2 ring-white ring-opacity-60 ring-offset-2 ring-offset-sky-500"
                      : ""
                  }
                  ${
                    checked
                      ? `${type.color} bg-opacity-75 text-white`
                      : "bg-white"
                  }
                      relative flex cursor-pointer rounded-lg px-5 py-4 shadow-md focus:outline-none `
                }
              >
                {({ checked }) => (
                  <>
                    <div className="flex w-full items-center justify-between">
                      <div className="flex items-center">
                        <div className="text-sm">
                          <RadioGroup.Label
                            as="p"
                            className={`font-medium  ${
                              checked ? "text-white" : "text-gray-900"
                            }`}
                          >
                            {type.name}
                          </RadioGroup.Label>
                        </div>
                      </div>
                      {checked && (
                        <div className="shrink-0 text-white">
                          <CheckCircleIcon className="h-6 w-6" />
                        </div>
                      )}
                    </div>
                  </>
                )}
              </RadioGroup.Option>
            ))}
          </div>
        </RadioGroup>
      </div>
    </div>
  );
}

export default AddTaskRadioGroup