'use client';

import React, { Fragment, FormEvent, useEffect, useRef} from 'react'
import { Dialog, Transition } from '@headlessui/react'
import {useModalStore} from "@/store/ModalStore";
import {useBoardStore} from "@/store/BoardStore";
import AddTaskRadioGroup from "@/components/UpdateTaskRadioGroup";
import {PhotoIcon} from "@heroicons/react/20/solid";
import {TrashIcon,ArrowDownTrayIcon} from "@heroicons/react/24/outline";
import Image from "next/image";
import {uploadImageInDB, deleteImageInDB, fetchImage} from "@/lib/api/resourcesApi";
import {lookaheadType} from "sucrase/dist/types/parser/tokenizer";
import {
    saveByteArray, convertImageDataToFile,
    base64ToArrayBuffer,
    createAndDownloadBlobFile,
    byteArrayToBase64,
} from "@/lib/utils/downloadImage";

function UpdateTaskModal() {

    const imagePickerRef = useRef<HTMLInputElement>(null);
    const [isUploading, setIsUploading] = React.useState(false);

    const [thumbnail, setThumbnail, updateTask, taskInput, taskType, taskDescription,
        setTaskInput, setTaskType, setTaskDescription] = useBoardStore((state)=> [
        state.thumbnail,
        state.setThumbnail,
        state.updateTask,
        state.taskInput,
        state.taskType,
        state.taskDescription,
        state.setTaskInput,
        state.setTaskType,
        state.setTaskDescription
    ]);

    // Get the task and closeModal from the store
    const { isUpdateTaskModalOpen, task, status, closeUpdateTaskModal, imageFile, setImageFile } = useModalStore();


    useEffect(() => {
        if (task == null) {
            console.log("task is null")
            return;
        }else{
            console.log("task is not null" + task.title)
            // `identifier` is a Task
            setTaskInput(task.title);
            setTaskType(task.status);
            setTaskDescription(task.description);
            if(task.thumbnail){
                setThumbnail(task.thumbnail)
            }
        }
    }, [task,isUpdateTaskModalOpen]);

    const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if ( status == null ) return;
        updateTask(taskInput, taskType, taskDescription, thumbnail);
        closeUpdateTaskModal();
    }

    const handleImageUpload= async (image: File) => {
        try{
            setIsUploading(true);
            const response = await uploadImageInDB(image);
            const thumbnail: Thumbnail = {
                id: response.id,
                data: response.data,
            }
            setThumbnail(thumbnail);
            setIsUploading(false);
        } catch (error) {
            console.error(error);
            setIsUploading(false);
        }
    };

    const handleImageDownload= async () => {
        try{
            if (thumbnail == null) return;
            if ("id" in thumbnail) {
                const response = await fetchImage(thumbnail.id);
                console.log(response)
                console.log(response.headers['content-disposition'])
                const filename = response.headers['content-disposition'].split('filename=\"')[1].slice(0, -1);
                console.log(filename)
                const sampleArray = base64ToArrayBuffer(response.data);
                saveByteArray(filename, sampleArray);
            }
        } catch (error) {
            console.error(error);
        } finally
        {
            setIsUploading(false);
        }
    };

    const handleClose =  async () =>{
        closeUpdateTaskModal();
        // if(thumbnail){
        //     await deleteImageInDB(thumbnail)
        // }
    }

    return (
        // Use the `Transition` component at the root level
        <Transition appear show={isUpdateTaskModalOpen} as={Fragment}>
            <Dialog
                as="form"
                className="relative z-10"
                onClose={handleClose}
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
                            <Dialog.Panel className="w-full max-w-lg transform overflow-hidden rounded-2xl
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
                                        rows={7}
                                    />
                                </div>
                                <AddTaskRadioGroup/>

                                <div>
                                    {!thumbnail && !isUploading && (
                                        <button
                                            type="button"
                                            onClick={() => {
                                                imagePickerRef.current?.click();
                                            }}
                                            disabled={isUploading}
                                            className="w-full border border-gray-300 rounded-md outline-none p-5 focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                                        >
                                            <PhotoIcon className="h-6 w-6 mr-2 inline-block" />
                                            Upload image
                                        </button>
                                    )}

                                    {imageFile && isUploading && (

                                        <div className="relative items-center block h-200 w-200">
                                            {/*<div className="absolute inset-0 w-full h-full bg-indigo-300 bg-opacity-75"></div>*/}
                                            <Image
                                                alt="uploaded image"
                                                width={200}
                                                height={200}
                                                className="w-full h-44 object-cover mt-2 filter transition-all opacity-25"
                                                src={URL.createObjectURL(imageFile)}
                                            />
                                            <div role="status" className="absolute -translate-x-1/2 -translate-y-1/2 top-2/4 left-1/2">
                                                <div className='flex space-x-2 justify-center items-center'>
                                                    <div className="h-3 w-3 rounded-full bg-gray-600  animate-pulse [animation-delay:-0.4s]"></div>
                                                    <div className="h-3 w-3 rounded-full bg-gray-600 animate-pulse [animation-delay:-0.4s]"></div>
                                                    <div className="h-3 w-3 rounded-full bg-gray-600  animate-pulse [animation-delay:-0.2]"></div>
                                                    <div className="h-3 w-3 rounded-full bg-gray-600  animate-pulse "></div>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                    {thumbnail && !isUploading && (
                                        <Image
                                            alt="uploaded image"
                                            width={200}
                                            height={200}
                                            className="w-full h-44 object-cover mt-2 "
                                            // src={URL.createObjectURL(image)}
                                            src={`data:image/jpeg;base64,${thumbnail.data}`}
                                            // onClick={() => {
                                            //     if (thumbnail) {
                                            //         deleteImageInDB(thumbnail)
                                            //     }
                                            //     setThumbnail(null);
                                            // }}
                                        />
                                    )}
                                    <input
                                        type="file"
                                        ref={imagePickerRef}
                                        hidden
                                        onChange={async (e) => {
                                            if (!e.target.files![0].type.startsWith("image/")) return;
                                            setImageFile(e.target.files![0]); // TODO 1
                                            await handleImageUpload(e.target.files![0])
                                        }}
                                    />

                                    <div className="text-center p-2">
                                        <button
                                            type="button"
                                            className="bg-blue-100 text-blue-900 p-2 mr-5 rounded-md focus-visible:ring-2
                                            focus-visible:ring-blue-900 focus:outline-none focus-visible:ring-offset-2
                                            disabled:text-gray-300 disabled:bg-gray-100 "
                                            disabled={isUploading}
                                            onClick={handleImageDownload}
                                        >

                                            <ArrowDownTrayIcon className="h-4 w-4 mr-2 inline-block" />
                                            Download Image
                                        </button>
                                        <button
                                            type="button"
                                            className="bg-red-100 text-blue-900 p-2 rounded-md focus-visible:ring-2
                                            focus-visible:ring-blue-900 focus:outline-none focus-visible:ring-offset-2
                                            disabled:text-gray-300 disabled:bg-gray-100 "
                                            disabled={isUploading}
                                            onClick={() => {
                                                if (thumbnail) {
                                                    deleteImageInDB(thumbnail)
                                                }
                                                setThumbnail(null);
                                            }}
                                        >
                                            <TrashIcon className="h-4 w-4 mr-2 inline-block" />
                                            Delete Image
                                        </button>
                                    </div>
                                    {/*<div className="text-center p-2">*/}
                                    {/*    <button*/}
                                    {/*        type="submit"*/}
                                    {/*        className="bg-blue-100 text-blue-900 p-2 mr-2 rounded-md focus-visible:ring-2*/}
                                    {/*        focus-visible:ring-blue-900 focus:outline-none focus-visible:ring-offset-2*/}
                                    {/*        disabled:text-gray-300 disabled:bg-gray-100 "*/}
                                    {/*        disabled={isUploading}>*/}
                                    {/*        <ArrowDownTrayIcon className="h-4 w-4 mr-2 inline-block" />*/}
                                    {/*        Submit*/}
                                    {/*    </button>*/}
                                    {/*</div>*/}
                                </div>
                            </Dialog.Panel>
                        </Transition.Child>
                    </div>
                </div>
            </Dialog>
        </Transition>
    )
}
export default UpdateTaskModal
