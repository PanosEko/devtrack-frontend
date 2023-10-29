"use client";
import React, {useEffect} from "react";
import {useRouter} from "next/navigation";
import {toast, Toaster} from "react-hot-toast";
import {authenticateUser, refreshToken} from "@/lib/api/authApi";
import Image from 'next/image'
import {LoadingScreen} from "@/components/LoadingScreen";


export default function LogInPage() {
    const router = useRouter();
    const [user, setUser] = React.useState({
        username: '',
        password: '',
    })
    // const [buttonDisabled, setButtonDisabled] = React.useState(false);
    const [loading, setLoading] = React.useState(true);
    const [isSubmitting, setIsSubmitting] = React.useState(false);


    useEffect(() => {
        refreshToken().then(() =>{
            router.push('/home');
            setTimeout(() => {
                toast.success("You are already logged in !");
            }, 1000);
        } )
            .catch((error:any) =>{
                console.log(error)
                setLoading(false);
            })
    }, [router]);

    const onLogIn = async () => {
        setIsSubmitting(true);
        try {
            if (!areAllFieldsFilled()) {
                toast.error("Please fill in all fields");
                return;
            }
            const response =  await authenticateUser(user);
            if (response.status===200) {
                router.push('/home');
            }
        } catch (error:any) {
            if (error.response.data) {
                toast.error(error.response.data)
            }
            console.log("Login failed", error.message);
        }
        finally {
            setIsSubmitting(false);
        }

        }

    const areAllFieldsFilled = () => {
        const { password, username} = user;
        return password.length > 0 && username.length > 0 ;
    }

    if(loading){
        return (<LoadingScreen/>);
    }

    return (
        <div className="bg-gradient-to-b from-[#EC53B0]
                    to-[#0E21A0] bg-opacity-70 min-h-screen flex items-center justify-center">
            <div><Toaster/></div>

            <div className="container mx-auto p-8 flex">
                <div className="max-w-md w-full mx-auto">


                    <div className="bg-white rounded-lg overflow-hidden shadow-2xl">
                        <div className="p-8">

                            {/* <!--Logo--> */}
                            <div className="max-w-md w-full mx-auto flex items-center justify-center">
                                <Image src="/icons8-module-96.png" alt="DevTrack Logo" width={70} height={70}/>
                                <h1 className="bg-gradient-to-r from-blue-800 via-purple-800 to-pink-500 bg-clip-text text-transparent text-5xl font-semibold text-center">
                                    DevTrack
                                </h1>
                            </div>
                            <h4 className=" mb-4 mt-1 pb-1 text-xl bg-gradient-to-r from-blue-700 via-purple-800 to-pink-500 bg-clip-text text-transparent font-semibold text-center">
                                Made for developers by developers
                            </h4>
                            <div className="mb-5">
                                <label htmlFor="username" className="block mb-2 text-sm font-medium text-gray-600">Username</label>

                                <input type="text"
                                       id="username"
                                       value={user.username}
                                       onChange={(e) => setUser({...user, username: e.target.value})}
                                       className="block w-full p-3 rounded bg-gray-200 border border-transparent focus:outline-none" />
                            </div>
                            <div className="mb-5">
                                <label htmlFor="password" className="block mb-2 text-sm font-medium text-gray-600">Password</label>

                                <input  id="password"
                                        type="password"
                                        value={user.password}
                                        onChange={(e) => setUser({...user, password: e.target.value})}
                                        className="block w-full p-3 rounded bg-gray-200 border border-transparent focus:outline-none" />
                            </div>

                            <button className="mb-3 mt-3 inline-block w-full rounded px-6 pb-2 pt-2.5 text-xs font-medium
                                                uppercase leading-normal text-white shadow-[0_4px_9px_-4px_rgba(0,0,0,0.2)] transition
                                                duration-150 ease-in-out hover:shadow-[0_8px_9px_-4px_rgba(0,0,0,0.1),0_4px_18px_0_rgba(0,0,0,0.2)]
                                                focus:shadow-[0_8px_9px_-4px_rgba(0,0,0,0.1),0_4px_18px_0_rgba(0,0,0,0.2)]
                                                focus:outline-none focus:ring-0 active:shadow-[0_8px_9px_-4px_rgba(0,0,0,0.1),0_4px_18px_0_rgba(0,0,0,0.2)]"
                                    type="button"
                                    style={{
                                        background:
                                            "linear-gradient(to right, #0E21A0, #EC53B0 )",
                                    }}
                                    onClick={onLogIn}
                                    disabled={isSubmitting}
                            >
                                {/*{isSubmitting ? "Logging in..." : "Log in"}*/}
                                {/*<div className="p-4 bg-gradient-to-tr animate-spin from-pink-400 to-blue-500 via-purple-500 rounded-full">*/}
                                {/*    <div className="bg-white rounded-full">*/}
                                {/*        <div className="w-24 h-24 rounded-full"></div>*/}
                                {/*    </div>*/}
                                {/*</div>*/}
                                {isSubmitting ? (
                                    <div className="p-4 bg-gradient-to-tr animate-spin from-pink-400 to-blue-500 via-purple-500 rounded-full">
                                        <div className="bg-white rounded-full">
                                            <div className="w-24 h-24 rounded-full"></div>
                                        </div>
                                    </div>
                                ) : (
                                    "Log in"
                                )}
                            </button>

                        </div>

                        <div className="flex flex-col items-center justify-center p-3 text-sm border-t border-gray-300 bg-gray-100 h-full">
                            <a className="text-gray-600">Dont have an account?</a>
                            <a href="/signup" className="font-semibold text-indigo-500 text-lg">Sign Up</a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}


