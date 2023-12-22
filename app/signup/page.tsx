"use client";
import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast, Toaster } from "react-hot-toast";
import Image from "next/image";
import { refreshToken, registerUser } from "@/lib/api/authApi";
import { PlusCircleIcon } from "@heroicons/react/20/solid";
import { LoadingScreen } from "@/components/LoadingScreen";

export default function SignupPage() {
  const router = useRouter();
  const [user, setUser] = React.useState({
    fullName: "",
    email: "",
    username: "",
    password: "",
    dob: "",
  });
  const [loading, setLoading] = React.useState(false);
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  useEffect(() => {
    // Refresh access token if refresh token is valid and redirect to home if successful
    refreshToken()
      .then(() => {
        router.push("/home");
        setTimeout(() => {
          toast.success("You are already logged in !");
        }, 1000);
      })
      .catch(() => {
        setLoading(false);
      });
  }, []);

  const onSignup = async () => {
    if (!areAllFieldsFilled()) {
      toast.error("Please fill in all fields");
      return;
    }
    try {
      setIsSubmitting(true);
      const response = await registerUser(user);
      if (response.status === 200) {
        router.push("/home");
        toast.dismiss();
        setTimeout(() => {
          toast("Edit a task by double clicking on the task.");
          toast(() => (
            <span className="flex items-center">
              <span>
                Add a Task by clicking the green button:
              </span>
              <div className="text-green-500 ml-2">
                <PlusCircleIcon className="h-10 w-10" />
              </div>
            </span>
          ));
        }, 1000);
      }
    } catch (error: any) {
      if ("response" in error) {
        if(error.response.data.errorDetails){
          for(const key in error.response.data.errorDetails){
            toast.error(error.response.data.errorDetails[key]);
          }
        } else{
          toast.error(error.response.data.errorMessage);
        }
      }else{
        toast.error("Something went wrong. Please try again later");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const areAllFieldsFilled = () => {
    const { email, password, username, fullName, dob } = user;
    return (
      email.length > 0 &&
      password.length > 0 &&
      username.length > 0 &&
      fullName.length > 0 &&
      dob.length > 0
    );
  };

  if (loading) {
    return <LoadingScreen />;
  }

  return (
    <section className="min-h-screen bg-neutral-200 flex justify-center items-center p-8">
      <div>
        <Toaster />
      </div>
      <div className="g-6 flex h-full flex-wrap items-center justify-center text-neutral-800 ">
        <div className="w-full">
          <div className="block rounded-lg bg-white shadow-lg ">
            <div className="g-0 lg:flex lg:flex-wrap">
              {/* <!-- Left column container--> */}
              <div className="px-4 md:px-0 lg:w-6/12">
                <div className="md:mx-8 md:p-12">
                  {/* <!--Logo--> */}
                  <div className="max-w-md w-full mx-auto flex items-center justify-center">
                    <Image
                      src="/icons8-module-96.png"
                      alt="DevTrack Logo"
                      width={70}
                      height={70}
                    />
                    <h1 className="bg-gradient-to-r from-blue-800 via-purple-800 to-pink-500 bg-clip-text text-transparent text-5xl font-semibold text-center">
                      DevTrack
                    </h1>
                  </div>
                  <h4 className=" mt-1 pb-1 text-xl bg-gradient-to-r from-blue-700 via-purple-800 to-pink-500 bg-clip-text text-transparent font-semibold text-center">
                    Made for developers by developers
                  </h4>

                  <div className="bg-white rounded-lg overflow-hidden shadow-2xl">
                    <div className="pr-8 pl-8 pt-8 pb-2">
                      <div className="mb-4">
                        <label
                          htmlFor="fullname"
                          className="block mb-2 text-sm font-medium text-gray-600"
                        >
                          Full Name
                        </label>

                        <input
                          type="text"
                          id="fullname"
                          value={user.fullName}
                          onChange={(e) =>
                            setUser({ ...user, fullName: e.target.value })
                          }
                          className="block w-full p-3 rounded bg-gray-200 border border-transparent focus:outline-none"
                        />
                      </div>

                      <div className="mb-4">
                        <label
                          htmlFor="dob"
                          className="block mb-2 text-sm font-medium text-gray-600"
                        >
                          Date of Birth
                        </label>

                        <input
                          id="dob"
                          type="date"
                          value={user.dob}
                          onChange={(e) =>
                            setUser({ ...user, dob: e.target.value })
                          }
                          className="block w-full p-3 rounded bg-gray-200 border border-transparent focus:outline-none"
                        />
                      </div>

                      <div className="mb-4">
                        <label
                          htmlFor="email"
                          className="block mb-2 text-sm font-medium text-gray-600"
                        >
                          Email
                        </label>

                        <input
                          type="text"
                          id="email"
                          value={user.email}
                          onChange={(e) =>
                            setUser({ ...user, email: e.target.value })
                          }
                          className="block w-full p-3 rounded bg-gray-200 border border-transparent focus:outline-none"
                        />
                      </div>

                      <div className="mb-4">
                        <label
                          htmlFor="username"
                          className="block mb-2 text-sm font-medium text-gray-600"
                        >
                          Username
                        </label>

                        <input
                          type="text"
                          id="username"
                          value={user.username}
                          onChange={(e) =>
                            setUser({ ...user, username: e.target.value })
                          }
                          className="block w-full p-3 rounded bg-gray-200 border border-transparent focus:outline-none"
                        />
                      </div>
                      <div className="mb-6">
                        <label
                          htmlFor="password"
                          className="block mb-2 text-sm font-medium text-gray-600"
                        >
                          Password
                        </label>

                        <input
                          id="password"
                          type="password"
                          value={user.password}
                          onChange={(e) =>
                            setUser({ ...user, password: e.target.value })
                          }
                          className="block w-full p-3 rounded bg-gray-200 border border-transparent focus:outline-none"
                        />
                      </div>

                      <button
                        className="mb-2 mt-2 inline-block w-full rounded px-6 pb-2 pt-2.5 font-medium h-12
                                                uppercase leading-normal text-white shadow-[0_4px_9px_-4px_rgba(0,0,0,0.2)] transition
                                                duration-150 ease-in-out hover:shadow-[0_8px_9px_-4px_rgba(0,0,0,0.1),0_4px_18px_0_rgba(0,0,0,0.2)]
                                                focus:shadow-[0_8px_9px_-4px_rgba(0,0,0,0.1),0_4px_18px_0_rgba(0,0,0,0.2)]
                                                focus:outline-none focus:ring-0 active:shadow-[0_8px_9px_-4px_rgba(0,0,0,0.1),0_4px_18px_0_rgba(0,0,0,0.2)]"
                        type="button"
                        style={{
                          background:
                            "linear-gradient(to right, #0E21A0, #EC53B0 )",
                        }}
                        onClick={onSignup}
                        disabled={isSubmitting}
                      >
                        {isSubmitting ? "Signing up..." : "Sign up"}
                      </button>
                      <div className="flex items-center justify-center">
                        <div className=" w-7 h-7 rounded-full">
                          {isSubmitting && (
                            <div className="p-1 bg-gradient-to-tr animate-spin from-pink-400 to-blue-500 via-purple-500 rounded-full ">
                              <div className="bg-white rounded-full">
                                <div className="w-5 h-5 rounded-full"></div>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-col items-center justify-center p-2 text-sm border-t border-gray-300 bg-gray-100 h-full">
                      <a className="text-gray-600">Already have an account?</a>
                      <a
                        href="/login"
                        className="font-semibold text-indigo-500 text-lg"
                      >
                        Log In
                      </a>
                    </div>
                  </div>
                </div>
              </div>
              {/* <!-- Right column container--> */}
              <div
                className="flex items-center rounded-b-lg lg:w-6/12 lg:rounded-r-lg lg:rounded-bl-none"
                style={{
                  background: "linear-gradient(to right,#0E21A0, #EC53B0 )",
                }}
              >
                <div className="px-4 py-6 text-white md:mx-6 md:p-12">
                  <h4 className="mb-6 text-xl font-semibold">
                    We are more than just a company
                  </h4>
                  <p className="text-sm">
                    DevTrack is a powerful kanban board tool that helps software
                    developers manage their projects more efficiently. With
                    DevTrack, you can easily create and manage tasks, track
                    progress, and collaborate with your team. DevTrack is
                    perfect for software developers of all levels, from
                    beginners to experienced professionals. It is easy to use
                    and customize, and it offers a variety of features that can
                    help you streamline your workflow and boost your
                    productivity. Sign up for a free trial of DevTrack today and
                    see how it can help you take your software development
                    projects to the next level!
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
