"use client";

import React, { FormEvent, Fragment, useEffect, useRef } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { useModalStore } from "@/store/ModalStore";
import { useBoardStore } from "@/store/BoardStore";
import AddTaskRadioGroup from "@/components/AddTaskRadioGroup";
import { PhotoIcon } from "@heroicons/react/20/solid";
import Image from "next/image";
import { deleteImageInDB, uploadImageInDB } from "@/lib/api/resourcesApi";
import { toast } from "react-hot-toast";
import {CheckIcon} from "@heroicons/react/24/outline";

function AddTaskModal() {
  const imagePickerRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = React.useState(false);
  const [isSubmitting, setIsSubmitting] = React.useState(false);


  const [
    thumbnail,
    setThumbnail,
    addTask,
    taskInput,
    taskType,
    taskDescription,
    setTaskInput,
    setTaskType,
    setTaskDescription,
  ] = useBoardStore((state) => [
    state.thumbnail,
    state.setThumbnail,
    state.addTask,
    state.taskInput,
    state.taskType,
    state.taskDescription,
    state.setTaskInput,
    state.setTaskType,
    state.setTaskDescription,
  ]);

  // Get the task and closeModal from the store
  const [
    isAddTaskModalOpen,
    status,
    closeAddTaskModal,
    imageFile,
    setImageFile,
  ] = useModalStore((state) => [
    state.isAddTaskModalOpen,
    state.status,
    state.closeAddTaskModal,
    state.imageFile,
    state.setImageFile,
  ]);

  useEffect(() => {
    if (status === null) {
      return;
    } else {
      setTaskInput("");
      setTaskDescription("");
      setTaskType(status);
      setThumbnail(null);
    }
  }, [status]);

  function delay(ms: number) {
    return new Promise( resolve => setTimeout(resolve, ms) );
  }

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (status === null) return;
    setImageFile(null);
    setIsSubmitting(true)
    try{
      await addTask(taskInput, taskType, taskDescription, thumbnail);
      await delay(2000)
      closeAddTaskModal();
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
      toast.error("Image size must be less than 10MB");
      return;
    }
    setImageFile(image);
    try {
      setIsUploading(true);
      const response = await uploadImageInDB(image);
      const newThumbnail: Thumbnail = {
        id: response.id,
        data: response.data,
      };
      setThumbnail(newThumbnail);
    } catch (error) {
      toast.error("Oops something went wrong. Your image was not saved.");
      console.error(error);
    } finally {
      setIsUploading(false);
    }
  };

  const handleClose = () => {
    if (thumbnail) {
      try{
        deleteImageInDB(thumbnail.id);
      } catch (error) {
        console.error(error);
      }
    }
    closeAddTaskModal();
  };

  return (
    // Use the `Transition` component at the root level
    <Transition appear show={isAddTaskModalOpen} as={Fragment}>
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
                    rows={3}
                  />
                </div>
                <AddTaskRadioGroup />

                <div>
                  {/*image not selected*/}
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
                  {/*image selected and is uploading*/}
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
                  {/*image uploaded and image thumbnail set*/}
                  {thumbnail && !isUploading && (
                    <Image
                      alt="uploaded image"
                      width={200}
                      height={200}
                      className="w-full h-44 object-cover mt-2 filter hover:grayscale
                                            transition-all duration-150 cursor-not-allowed"
                      // src={URL.createObjectURL(image)}
                      src={`data:image/jpeg;base64,${thumbnail.data}`}
                      onClick={() => {
                        if (thumbnail && !isSubmitting) {
                          deleteImageInDB(thumbnail.id);
                        }
                        setThumbnail(null);
                      }}
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

                  <div className="text-center p-2 ">
                    {isSubmitting && (
                        <button className="bg-blue-200 p-2 mr-5 rounded-md">
                          <svg className="w-5 h-5 text-white animate-spin" fill="none"
                               viewBox="0 0 24 24"
                               xmlns="http://www.w3.org/2000/svg">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75"
                                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                  fill="currentColor"></path>
                          </svg>
                        </button>
                    )}
                    {!isSubmitting && (
                      <button type="submit" className="bg-blue-200 text-blue-900 p-2 mr-5 rounded-md hover:bg-blue-300
                      disabled:text-gray-300 disabled:bg-gray-100" disabled={!taskInput || isUploading || isSubmitting}>
                        <CheckIcon className="h-4 w-4 mr-2 inline-block" />
                        Save task
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

export default AddTaskModal;
