"use client";

import React, { FormEvent, Fragment, useEffect, useRef } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { useModalStore } from "@/store/ModalStore";
import { useBoardStore } from "@/store/BoardStore";
import AddTaskRadioGroup from "@/components/UpdateTaskRadioGroup";
import { PhotoIcon } from "@heroicons/react/20/solid";
import { ArrowDownTrayIcon, TrashIcon, CheckIcon } from "@heroicons/react/24/outline";
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
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  // used to delete the original image in the database if the user uploads a new one and saves the changes
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
    console.log("task", task)
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
  }, [task,isUpdateTaskModalOpen]);


  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true)
    if (task===null || taskIndex===null) {
      return;
    }
    try {
      // if the original image has been deleted in app, delete it from the database
      if (originalImageIdRef.current !== null) {
        console.log("deleting original image", originalImageIdRef.current)
        await deleteImageInDB(originalImageIdRef.current);
        originalImageIdRef.current = null;

      }
      await updateTask(taskInput, taskType, taskDescription, task, taskIndex, thumbnail);
      closeUpdateTaskModal();
    } catch (error) {
      toast.error("Oops something went wrong. Your task was not saved.");
    } finally {
      setIsSubmitting(false)
    }
  };

  const handleImageUpload = async (image: File) => {
    if (!image.type.startsWith("image/")) {
      toast.error("File was not recognized as valid image type");
      return;
    }
    if(image.size/1024 > 10000) {
      setImageFile(null);
      toast.error("Image size must be less than 10MB");
      return;
    }
    setImageFile(image);
    try {
      setIsUploading(true);
      const response = await uploadImageInDB(image);
      const thumbnail: Thumbnail = {
        id: response.id,
        data: response.data,
      };
      setThumbnail(thumbnail);
    } catch (error) {
      console.error(error);
      toast("Oops something went wrong. Your image was not saved.")
    } finally {
        setIsUploading(false);
    }
  };

  const handleImageDelete = async () => {
    if (thumbnail === null || task === null) return;
    // if the original image is deleted in app, store its id
    if (originalImageIdRef.current === null) {
      originalImageIdRef.current = thumbnail.id;
    }
    // if the current thumbnail is not the original image, delete it from the database
    if (thumbnail.id !== originalImageIdRef.current) {
      try {
        deleteImageInDB(thumbnail.id);
        task.thumbnail = null;
      } catch (error) {
        toast("Oops something went wrong. Your image was not deleted.")
      }

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
        toast("Oops something went wrong. Your image could not be downloaded.")
      }
  };

  const handleClose = async () => {
    // if the original image has been deleted in app, delete it from the database
    if (thumbnail && originalImageIdRef.current !== null) {
      deleteImageInDB(thumbnail.id);
      originalImageIdRef.current = null;
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
                      await handleImageUpload(e.target.files![0]);
                    }}
                  />

                  <div className="text-center p-2">
                    <button
                      type="button"
                      className="bg-pink-100 text-blue-900 p-2 mr-5 rounded-md hover:bg-pink-200
                                            disabled:text-gray-300 disabled:bg-gray-100 "
                      disabled={isUploading || !thumbnail || isSubmitting}
                      onClick={handleImageDownload}
                    >
                      <ArrowDownTrayIcon className="h-4 w-4 mr-2 inline-block" />
                      Download Image
                    </button>
                    <button
                      type="button"
                      className="bg-red-100 text-blue-900 p-2 rounded-md hover:bg-red-200
                                            disabled:text-gray-300 disabled:bg-gray-100 "
                      disabled={isUploading || !thumbnail || isSubmitting}
                      onClick={handleImageDelete}
                    >
                      <TrashIcon className="h-4 w-4 mr-2 inline-block" />
                      Delete Image
                    </button>
                  </div>
                  <div className="text-center justify-center items-center p-2">
                    {isSubmitting && (
                        <div className="flex text-center justify-center items-center ">
                        <button className="flex justify-center items-center bg-blue-300 p-2 mr-5 rounded-md min-w-[135px] min-h-[40px]">
                          <svg className="w-5 h-5 text-white animate-spin" fill="none"
                               viewBox="0 0 24 24"
                               xmlns="http://www.w3.org/2000/svg">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75"
                                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                  fill="currentColor"></path>
                          </svg>
                        </button>
                        </div>
                    )}
                    {!isSubmitting && (
                        <button type="submit" className="min-w-[135px] min-h-[40px] bg-blue-200 text-blue-900 p-2 mr-5 rounded-md hover:bg-blue-300
                      disabled:text-gray-300 disabled:bg-gray-100" disabled={!taskInput || isUploading || isSubmitting}>
                          <CheckIcon className="h-4 w-4 mr-2 inline-block" />
                          Save changes
                        </button>
                    )}
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
