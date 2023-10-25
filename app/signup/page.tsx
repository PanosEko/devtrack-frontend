// 'use client';
// import React, { useState } from 'react';
// import {useRouter} from "next/router";
// import { toast } from "react-hot-toast";
//
// export default function SignupPage() {
//     const router = useRouter();
// const RegistrationForm = () => {
//     const router = useRouter();
//
//     const [formData, setFormData] = useState({
//         fullName: '',
//         email: '',
//         username: '',
//         password: '',
//         dob: '',
//     });
//
//     const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//         const { name, value } = e.target;
//         setFormData({
//             ...formData,
//             [name]: value,
//         });
//     };
//
//     const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
//         e.preventDefault();
//
//         // Send a POST request to Spring Boot API to register the user
//         try {
//             const response = await fetch('http://localhost:8080/api/v1/auth/register', {
//                 method: 'POST',
//                 headers: {
//                     'Content-Type': 'application/json',
//                 },
//                 body: JSON.stringify(formData),
//             });
//
//             if (response.ok) {
//
//                 // Registration successful, handle the response accordingly
//                 const data = await response.json();
//                 const authToken = data.token;
//                 console.log('Registration successful! ', authToken);
//                 // navigate to home page
//                 await router.push('/home')
//             } else {
//                 // Handle home failure
//                 toast.error('Registration failed');
//                 console.error('Registration failed');
//             }
//         } catch (error:any) {
//             console.error('Error registering user', error);
//             toast.error(error.message);
//
//         }
//     };
//
//     return (
//         <form onSubmit={handleSubmit}>
//             <input
//                 type="text"
//                 name="fullName"
//                 value={formData.fullName}
//                 onChange={handleChange}
//                 placeholder="Full Name"
//             />
//             <input
//                 type="email"
//                 name="email"
//                 value={formData.email}
//                 onChange={handleChange}
//                 placeholder="Email"
//             />
//             <input
//                 type="text"
//                 name="username"
//                 value={formData.username}
//                 onChange={handleChange}
//                 placeholder="Username"
//             />
//             <input
//                 type="password"
//                 name="password"
//                 value={formData.password}
//                 onChange={handleChange}
//                 placeholder="Password"
//             />
//             <input
//                 type="date"
//                 name="dob"
//                 value={formData.dob}
//                 onChange={handleChange}
//                 placeholder="Date of Birth"
//             />
//             <button type="submit">Register</button>
//         </form>
//     );
// };
//
// export default RegistrationForm;

"use client";
import React, { useEffect } from "react";
import {useRouter} from "next/navigation";
import {toast, Toaster} from "react-hot-toast";

import Image from 'next/image'
import {checkTokenValidity, refreshToken, registerUser} from "@/lib/api/authApi";
import {PlusCircleIcon, XCircleIcon} from "@heroicons/react/20/solid";
import {useModalStore} from "@/store/ModalStore";
import {LoadingScreen} from "@/components/LoadingScreen";



export default function SignupPage() {
    const router = useRouter();
    const [user, setUser] = React.useState({
        fullName: '',
        email: '',
        username: '',
        password: '',
        dob: '',
    })
    const [buttonDisabled, setButtonDisabled] = React.useState(false);
    const [loading, setLoading] = React.useState(false);
    const openModal = useModalStore((state) => state.openModal);

    useEffect(() => {
        refreshToken().then(() =>{
            router.push('/home');
            setTimeout(() => {
                toast.success("You are already logged in !");
            }, 1000);
        } )
            .catch((error:any) =>{
                setLoading(false);
            })
    }, [router]);

    const onSignup = async () => {
        if (!areAllFieldsFilled()) {
            toast.error("Please fill in all fields");
            return;
        }
        try {
            const response = await registerUser(user);
            if (response.status===200) {
                router.push('/home');
                toast((t) => (
                    <span>
                        Add your first Task! Click here:
                        <button  onClick={() => {
                            toast.dismiss(t.id);
                            openModal();
                        }} className="text-green-500 hover:text-green-600">
                            <PlusCircleIcon className="h-5 w-5"/>
                        </button>
                    </span>
                ));
            }
        } catch (error:any) {
            if (error.response.data) {
                toast.error(error.response.data)
            }
            console.log("Login failed", error.message);
        }
    }

    const areAllFieldsFilled = () => {
        const { email, password, username, fullName, dob } = user;
        return email.length > 0 && password.length > 0 && username.length > 0 && fullName.length > 0 && dob.length > 0;
    }
    // const onSignup = async () => {
    //     try {
    //         setLoading(true);
    //         if(user.email.length > 0 && user.password.length > 0 && user.username.length > 0 && user.fullName.length > 0 && user.dob.length > 0) {
    //             const response = await axios.post("http://localhost:8080/api/v1/auth/register", user);
    //             const responseError = response.data.error;
    //             if(responseError) {
    //                 toast.error(responseError);
    //                 console.log(responseError);
    //             }
    //             else {
    //                 const authToken = response.data.token;
    //                 router.push("/home");
    //             }
    //         } else {
    //             toast.error("Please fill in all fields");
    //             console.log("Please fill in all fields");
    //         }
    //     } catch (error:any) {
    //         console.log("Signup failed", error.message);
    //         toast.error(error.message);
    //     }finally {
    //         setLoading(false);
    //     }
    // }

    // useEffect(() => {
    //     if(user.email.length > 0 && user.password.length > 0 && user.username.length > 0 && user.fullName.length > 0 && user.dob.length > 0) {
    //         setButtonDisabled(false);
    //     } else {
    //         setButtonDisabled(true);
    //     }
    // }, [user]);

    if(loading){
        return (<LoadingScreen/>);
    }

    return (

        <section className="min-h-screen bg-neutral-200 flex justify-center items-center p-8">
            <div><Toaster/></div>
            <div className="g-6 flex h-full flex-wrap items-center justify-center text-neutral-800 ">
                <div className="w-full">
                    <div className="block rounded-lg bg-white shadow-lg ">
                        <div className="g-0 lg:flex lg:flex-wrap">
                            {/* <!-- Left column container--> */}
                            <div className="px-4 md:px-0 lg:w-6/12">
                                <div className="md:mx-6 md:p-12">
                                    {/* <!--Logo--> */}
                                    <div className="max-w-md w-full mx-auto flex items-center justify-center">
                                        <Image src="/icons8-module-96.png" alt="DevTrack Logo" width={70} height={70}/>
                                        <h1 className="bg-gradient-to-r from-blue-800 via-purple-800 to-pink-500 bg-clip-text text-transparent text-5xl font-semibold text-center">
                                            DevTrack
                                        </h1>
                                        {/*    <Image src="/Untitled.png" alt="DevTrack Logo" width={300} height={150}/>*/}
                                    </div>
                                    <h4 className=" mb-6 mt-1 pb-1 text-xl bg-gradient-to-r from-blue-700 via-purple-800 to-pink-500 bg-clip-text text-transparent font-semibold text-center">
                                        Made for developers by developers
                                    </h4>

                                    <div className="bg-white rounded-lg overflow-hidden shadow-2xl">
                                        <div className="p-8">

                                            <div className="mb-4">
                                                <label htmlFor="fullname" className="block mb-2 text-sm font-medium text-gray-600">Full Name</label>

                                                <input
                                                    type="text"
                                                    id="fullname"
                                                    value={user.fullName}
                                                    onChange={(e) => setUser({...user, fullName: e.target.value})}
                                                    className="block w-full p-3 rounded bg-gray-200 border border-transparent focus:outline-none" />
                                            </div>

                                            <div className="mb-4">
                                                <label htmlFor="dob" className="block mb-2 text-sm font-medium text-gray-600">Date of Birth</label>

                                                <input  id="dob"
                                                        type="date"
                                                        value={user.dob}
                                                        onChange={(e) => setUser({...user, dob: e.target.value})}
                                                        className="block w-full p-3 rounded bg-gray-200 border border-transparent focus:outline-none" />
                                            </div>

                                            <div className="mb-4">
                                                <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-600">Email</label>

                                                <input
                                                    type="text"
                                                    id="email"
                                                    value={user.email}
                                                    onChange={(e) => setUser({...user, email: e.target.value})}
                                                    className="block w-full p-3 rounded bg-gray-200 border border-transparent focus:outline-none" />
                                            </div>

                                            <div className="mb-4">
                                                <label htmlFor="username" className="block mb-2 text-sm font-medium text-gray-600">Username</label>

                                                <input type="text"
                                                       id="username"
                                                       value={user.username}
                                                       onChange={(e) => setUser({...user, username: e.target.value})}
                                                       className="block w-full p-3 rounded bg-gray-200 border border-transparent focus:outline-none" />
                                            </div>
                                            <div className="mb-4">
                                                <label htmlFor="password" className="block mb-2 text-sm font-medium text-gray-600">Password</label>

                                                <input  id="password"
                                                        type="password"
                                                        value={user.password}
                                                        onChange={(e) => setUser({...user, password: e.target.value})}
                                                        className="block w-full p-3 rounded bg-gray-200 border border-transparent focus:outline-none" />
                                            </div>

                                            <button className="mb-2 mt-2 inline-block w-full rounded px-6 pb-2 pt-2.5 font-medium
                                                uppercase leading-normal text-white shadow-[0_4px_9px_-4px_rgba(0,0,0,0.2)] transition
                                                duration-150 ease-in-out hover:shadow-[0_8px_9px_-4px_rgba(0,0,0,0.1),0_4px_18px_0_rgba(0,0,0,0.2)]
                                                focus:shadow-[0_8px_9px_-4px_rgba(0,0,0,0.1),0_4px_18px_0_rgba(0,0,0,0.2)]
                                                focus:outline-none focus:ring-0 active:shadow-[0_8px_9px_-4px_rgba(0,0,0,0.1),0_4px_18px_0_rgba(0,0,0,0.2)]"
                                                    type="button"
                                                    style={{
                                                        background:
                                                            "linear-gradient(to right, #0E21A0, #EC53B0 )",
                                                    }} onClick={onSignup}>Sign Up
                                            </button>


                                        </div>

                                        <div className="flex flex-col items-center justify-center p-3 text-sm border-t border-gray-300 bg-gray-100 h-full">
                                            <a className="text-gray-600">Already have an account?</a>
                                            <a href="/login" className="font-semibold text-indigo-500 text-lg">Log In</a>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            {/* <!-- Right column container with background and description--> */}
                            <div
                                className="flex items-center rounded-b-lg lg:w-6/12 lg:rounded-r-lg lg:rounded-bl-none"
                                style={{
                                    background:
                                        "linear-gradient(to right,#0E21A0, #EC53B0 )",
                                }}
                            >
                                <div className="px-4 py-6 text-white md:mx-6 md:p-12">
                                    <h4 className="mb-6 text-xl font-semibold">
                                        We are more than just a company
                                    </h4>
                                    <p className="text-sm">
                                        Lorem ipsum dolor sit amet, consectetur adipisicing elit,
                                        sed do eiusmod tempor incididunt ut labore et dolore magna
                                        aliqua. Ut enim ad minim veniam, quis nostrud exercitation
                                        ullamco laboris nisi ut aliquip ex ea commodo consequat.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}

// <div className="bg-gradient-to-b from-[#EC53B0]
//             to-[#0E21A0] bg-opacity-70 min-h-screen flex items-center justify-center">
// <div className="flex flex-col items-center justify-center min-h-screen py-2">
//     <Image src="/Untitled.png" alt="DevTrack Logo" width={600} height={200} className="w-44 md:w-56 pb-10 md:pb-0 object-contain"/>
//     <h1>{loading ? "Processing" : "Signup"}</h1>
//     <hr />
//     <label htmlFor="full name">Full Name</label>
//     <input
//         className="p-2 border border-gray-300 rounded-lg mb-4 focus:outline-none focus:border-gray-600 text-black"
//         id="fullname"
//         type="text"
//         value={user.fullName}
//         onChange={(e) => setUser({...user, fullName: e.target.value})}
//         placeholder="full name"
//     />
//     <label htmlFor="email">Email</label>
//     <input
//         className="p-2 border border-gray-300 rounded-lg mb-4 focus:outline-none focus:border-gray-600 text-black"
//         id="email"
//         type="text"
//         value={user.email}
//         onChange={(e) => setUser({...user, email: e.target.value})}
//         placeholder="email"
//     />
//     <label htmlFor="username">Username</label>
//     <input
//         className="p-2 border border-gray-300 rounded-lg mb-4 focus:outline-none focus:border-gray-600 text-black"
//         id="username"
//         type="text"
//         value={user.username}
//         onChange={(e) => setUser({...user, username: e.target.value})}
//         placeholder="username"
//     />
//     <label htmlFor="password">Password</label>
//     <input
//         className="p-2 border border-gray-300 rounded-lg mb-4 focus:outline-none focus:border-gray-600 text-black"
//         id="password"
//         type="password"
//         value={user.password}
//         onChange={(e) => setUser({...user, password: e.target.value})}
//         placeholder="password"
//     />
//     <label htmlFor="dob">Date of Birth</label>
//     <input
//         className="p-2 border border-gray-300 rounded-lg mb-4 focus:outline-none focus:border-gray-600 text-black"
//         id="dob"
//         type="date" // Use the date input type
//         value={user.dob}
//         onChange={(e) => setUser({ ...user, dob: e.target.value })}
//         placeholder="Date of Birth"
//     />
//     <button
//         disabled={buttonDisabled}
//         onClick={onSignup}
//         className="p-2 border border-gray-300 rounded-lg mb-4 focus:outline-none focus:border-gray-600">{"Signup"}</button>
//     <Link href="/login">Visit login page</Link>
// </div>

// </div>