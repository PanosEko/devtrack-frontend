'use client';

import {useState, Fragment, FormEvent, useEffect, useRef} from 'react'
import { Dialog, Transition } from '@headlessui/react'
import {useModalStore} from "@/store/ModalStore";
import {useBoardStore} from "@/store/BoardStore";
import TaskTypeRadioGroup from "@/components/TaskTypeRadioGroup";
import {PhotoIcon} from "@heroicons/react/20/solid";
import Image from "next/image";



function Modal() {

    const imagePickerRef = useRef<HTMLInputElement>(null);

    const [image, setImage, addTask, updateTask, taskInput, taskType, taskDescription,
        setTaskInput, setTaskType, setTaskDescription] = useBoardStore((state)=> [
        state.image,
        state.setImage,
        state.addTask,
        state.updateTask,
        state.taskInput,
        state.taskType,
        state.taskDescription,
        state.setTaskInput,
        state.setTaskType,
        state.setTaskDescription
    ]);

    // Get the task and closeModal from the store
    const { isOpen, identifier, taskIndex, closeModal } = useModalStore();

    useEffect(() => {
        if (identifier == null) {
            return;
        } else if (typeof identifier === "string" ) {
            // `identifier` is a TypedColumn value
            setTaskInput("");
            setTaskDescription("");
            setTaskType(identifier);
            setImage(null);
        } else if (taskIndex !== null) {
            // `identifier` is a Task
            setTaskInput(identifier.title);
            setTaskType(identifier.status);
            setTaskDescription(identifier.description);
            if(identifier.image){
                setImage(identifier.image)
            }
        }
    }, [identifier]);

    const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (taskInput == null || identifier == null ) return;
        if(typeof identifier === "string"){
            addTask(taskInput, taskType, taskDescription, image);
        }else if (taskIndex !== null) {
            updateTask(taskInput, taskType, taskDescription, identifier, taskIndex, image);
        }
        closeModal();
    }

    return (
        // Use the `Transition` component at the root level
        <Transition appear show={isOpen} as={Fragment}>
            <Dialog
                as="form"
                className="relative z-10"
                onClose={closeModal}
                onSubmit={handleSubmit}>
                <Transition.Child
                    as={Fragment}
                    enter="ease-out duration-300"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leave="ease-in duration-200"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                >
                    <div className="fixed inset-0 bg-black bg-opacity-25" />
                </Transition.Child>

                <div className="fixed inset-0 overflow-y-auto">
                    <div className="flex min-h-full items-center justify-center p-4 text-center">
                        <Transition.Child
                            as={Fragment}
                            enter="ease-out duration-300"
                            enterFrom="opacity-0 scale-95"
                            enterTo="opacity-100 scale-100"
                            leave="ease-in duration-200"
                            leaveFrom="opacity-100 scale-100"
                            leaveTo="opacity-0 scale-95"
                        >
                            <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl
                            bg-white p-6 text-left align-middle shadow-xl transition-all">
                                {/*<Dialog.Title as="h3"*/}
                                {/*className="text-lg font-medium leading-6 text-gray-900 pb-2">*/}
                                {/*Task Title:*/}
                                {/*</Dialog.Title>*/}

                                <div className="mt-2">
                                    <input type="text"
                                        value={taskInput}
                                        onChange={(e) => setTaskInput(e.target.value)}
                                        placeholder="Enter the task's title here..."
                                        className="w-full border border-gray-300 rounded-md outline-none p-5"
                                        style={{ fontSize: '18px', fontWeight: '500' }}
                                    />
                                </div>
                                <div className="mt-2">
                                    <textarea
                                        value={taskDescription}
                                        onChange={(e) => setTaskDescription(e.target.value)}
                                        placeholder="Enter the task's description here..."
                                        className="w-full border border-gray-300 rounded-md outline-none p-5"
                                        rows={4}
                                    />
                                </div>
                                <TaskTypeRadioGroup/>

                                <div>
                                    <button
                                        type="button"
                                        onClick={() => {
                                            imagePickerRef.current?.click();
                                        }}
                                        className="w-full border border-gray-300 rounded-md outline-none p-5 focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                                    >
                                        <PhotoIcon className="h-6 w-6 mr-2 inline-block" />
                                        Upload Image
                                    </button>
                                    {image && (
                                        <Image
                                            alt="uploaded image"
                                            width={200}
                                            height={200}
                                            className="w-full h-44 object-cover mt-2 filter hover:grayscale
                                            transition-all duration-150 cursor-not-allowed"
                                            src={URL.createObjectURL(image)}
                                            onClick={() => {
                                                setImage(null);
                                            }}
                                        />
                                    )}
                                    <input
                                        type="file"
                                        ref={imagePickerRef}
                                        hidden
                                        onChange={(e) => {
                                            if (!e.target.files![0].type.startsWith("image/")) return;
                                            setImage(e.target.files![0]);
                                        }}
                                    />
                                    <div className="text-center p-2">
                                        <button
                                            type="submit"
                                            className="bg-blue-100 text-blue-900 p-2 rounded-md focus-visible:ring-2
                                            focus-visible:ring-blue-900 focus:outline-none focus-visible:ring-offset-2
                                            disabled:text-gray-300 disabled:bg-gray-100 "
                                            disabled={!taskInput}>
                                            Save Task
                                        </button>
                                    </div>
                                </div>
                            </Dialog.Panel>
                        </Transition.Child>
                    </div>
                </div>
            </Dialog>
        </Transition>
    )
}
export default Modal
