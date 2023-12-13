"use client";

import React, { FormEvent, Fragment, useEffect, useRef } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { useModalStore } from "@/store/ModalStore";
import { useBoardStore } from "@/store/BoardStore";
import AddTaskRadioGroup from "@/components/UpdateTaskRadioGroup";
import { PhotoIcon } from "@heroicons/react/20/solid";
import { ArrowDownTrayIcon, TrashIcon } from "@heroicons/react/24/outline";
import Image from "next/image";
import {
  deleteImageInDB,
  fetchImage,
  uploadImageInDB,
} from "@/lib/api/resourcesApi";
import { base64ToArrayBuffer, saveByteArray } from "@/lib/utils/downloadImage";
import { toast } from "react-hot-toast";

function UpdateTaskModal() {
  const imagePickerRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = React.useState(false);
  // used to delete the original image in the database if the user uploads a new one and saves the changes
  // let originalImageId: string | null = null;
  const originalImageIdRef = useRef<string | null>(null);


  const [
    thumbnail,
    setThumbnail,
    updateTask,
    taskInput,
    taskType,
    taskDescription,
    setTaskInput,
    setTaskType,
    setTaskDescription,
  ] = useBoardStore((state) => [
    state.thumbnail,
    state.setThumbnail,
    state.updateTask,
    state.taskInput,
    state.taskType,
    state.taskDescription,
    state.setTaskInput,
    state.setTaskType,
    state.setTaskDescription,
  ]);

  // Get the task and closeModal from the store
  const [
    isUpdateTaskModalOpen,
    task,
    closeUpdateTaskModal,
    imageFile,
    setImageFile,
    taskIndex,
  ] = useModalStore((state) => [
    state.isUpdateTaskModalOpen,
    state.task,
    state.closeUpdateTaskModal,
    state.imageFile,
    state.setImageFile,
    state.taskIndex,
  ]);
  useEffect(() => {
    if (task) {
      setTaskInput(task.title);
      setTaskType(task.status);
      setTaskDescription(task.description);
      if (task.thumbnail) {
        setThumbnail(task.thumbnail);
      } else {
        setThumbnail(null);
      }
    }
  }, [task, isUpdateTaskModalOpen]);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (task===null || taskIndex===null) {
      console.log("Task or taskIndex is null")
      return;
    }
    try {
      // if the original image has been deleted in app, delete it from the database
      if (originalImageIdRef.current !== null) {
        console.log("deleting original image", originalImageIdRef.current)
      }
      updateTask(taskInput, taskType, taskDescription, task, taskIndex, thumbnail);
      closeUpdateTaskModal();
    } catch (error) {
      toast.error("Connection lost. Task not updated.");
    }
  };

  const handleImageUpload = async (image: File) => {
    try {
      setIsUploading(true);
      const response = await uploadImageInDB(image);
      const thumbnail: Thumbnail = {
        id: response.id,
        data: response.data,
      };
      setThumbnail(thumbnail);
      setIsUploading(false);
    } catch (error) {
      console.error(error);
      setIsUploading(false);
    }
  };

  const handleImageDelete = async () => {
    if (thumbnail === null || task === null) return;
    // if the original image has been deleted in app, store its id
    if (originalImageIdRef.current === null) {
      console.log("storing original image id", thumbnail.id)
      originalImageIdRef.current = thumbnail.id;
      console.log("original image id stored", originalImageIdRef.current)
    }
    // if the current thumbnail is not the original image, delete it from the database
    if (thumbnail.id !== originalImageIdRef.current) {
      deleteImageInDB(thumbnail.id);
      task.thumbnail = null;
    }
    setThumbnail(null);
    setImageFile(null);
  };

  const handleImageDownload = async () => {
    try {
      if (thumbnail && "id" in thumbnail) {
        const response = await fetchImage(thumbnail.id);
        const filename = response.headers["content-disposition"].split('filename="')[1].slice(0, -1);
        const filetype = response.headers["content-type"];
        const sampleArray = base64ToArrayBuffer(response.data);
        saveByteArray(filename, filetype, sampleArray);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsUploading(false);
    }
  };

  const handleClose = async () => {
    // if the original image has been deleted in app, delete it from the database
    if (thumbnail && originalImageIdRef.current !== null) {
      deleteImageInDB(thumbnail.id);
    }
    closeUpdateTaskModal();
  };

  return (
    // Use the `Transition` component at the root level
    <Transition appear show={isUpdateTaskModalOpen} as={Fragment}>
      <Dialog
        as="form"
        className="relative z-10"
        onClose={handleClose}
        onSubmit={handleSubmit}
      >
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
              <Dialog.Panel
                className="w-full max-w-lg transform overflow-hidden rounded-2xl
                            bg-white p-6 text-left align-middle shadow-xl transition-all"
              >

                <div className="mt-2">
                  <input
                    type="text"
                    value={taskInput}
                    onChange={(e) => setTaskInput(e.target.value)}
                    placeholder="Enter the task's title here..."
                    className="w-full border border-gray-300 rounded-md outline-none p-5"
                    style={{ fontSize: "18px", fontWeight: "500" }}
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
                <AddTaskRadioGroup />

                <div>
                  {/* image not selected*/}
                  {!thumbnail && !isUploading && (
                    <button
                      type="button"
                      onClick={() => {
                        imagePickerRef.current?.click();
                      }}
                      // disabled={isUploading}
                      className="w-full border border-gray-300 rounded-md outline-none p-5 focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                    >
                      <PhotoIcon className="h-6 w-6 mr-2 inline-block" />
                      Upload image
                    </button>
                  )}
                  {/*image is uploading*/}
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
                      <div
                        role="status"
                        className="absolute -translate-x-1/2 -translate-y-1/2 top-2/4 left-1/2"
                      >
                        <div className="flex space-x-2 justify-center items-center">
                          <div className="h-3 w-3 rounded-full bg-gray-600  animate-pulse [animation-delay:-0.4s]"></div>
                          <div className="h-3 w-3 rounded-full bg-gray-600 animate-pulse [animation-delay:-0.4s]"></div>
                          <div className="h-3 w-3 rounded-full bg-gray-600  animate-pulse [animation-delay:-0.2]"></div>
                          <div className="h-3 w-3 rounded-full bg-gray-600  animate-pulse "></div>
                        </div>
                      </div>
                    </div>
                  )}
                  {/*image uploaded and thumbnail is set*/}
                  {thumbnail && !isUploading && (
                    <Image
                      alt="uploaded image"
                      width={200}
                      height={200}
                      className="w-full h-full object-cover mt-2 "
                      src={`data:image/jpeg;base64,${thumbnail.data}`}
                    />
                  )}
                  <input
                    type="file"
                    ref={imagePickerRef}
                    hidden
                    onChange={async (e) => {
                      if (!e.target.files![0].type.startsWith("image/")) return;
                      setImageFile(e.target.files![0]);
                      await handleImageUpload(e.target.files![0]);
                    }}
                  />

                  <div className="text-center p-2">
                    <button
                      type="button"
                      className="bg-blue-100 text-blue-900 p-2 mr-5 rounded-md focus-visible:ring-2
                                            focus-visible:ring-blue-900 focus:outline-none focus-visible:ring-offset-2
                                            disabled:text-gray-300 disabled:bg-gray-100 "
                      disabled={isUploading || !thumbnail}
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
                      disabled={isUploading || !thumbnail}
                      onClick={handleImageDelete}
                    >
                      <TrashIcon className="h-4 w-4 mr-2 inline-block" />
                      Delete Image
                    </button>
                  </div>
                  <div className="text-center p-2">
                    <button
                      type="submit"
                      className="bg-blue-100 text-blue-900 p-2 rounded-md focus-visible:ring-2
                                            focus-visible:ring-blue-900 focus:outline-none focus-visible:ring-offset-2
                                            disabled:text-gray-300 disabled:bg-gray-100 "
                      disabled={!taskInput || isUploading}
                    >
                      Save Changes
                    </button>
                  </div>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}

export default UpdateTaskModal;
