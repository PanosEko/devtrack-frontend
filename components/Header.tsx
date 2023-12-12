import React from "react";
import Image from "next/image";
import { MagnifyingGlassIcon } from "@heroicons/react/24/solid";
import { useBoardStore } from "@/store/BoardStore";
import { useRouter } from "next/navigation";
import { logOutUser } from "@/lib/api/authApi";
import {toast} from "react-hot-toast";

function Header() {
  const router = useRouter();
  const [searchString, setSearchString] = useBoardStore((state) => [
    state.searchString,
    state.setSearchString,
  ]);

  const handleLogout = async () => {
    try {
      await logOutUser();
      router.push("/login");
    } catch (error: any) {
      toast.error("Connection lost. You are still logged in.");
    }
  };

  return (
    <header>
      <div className="flex flex-col md:flex-row items-center p-5 bg-gray-500/10 rounded-b-2xl">
        <div
          className="absolute top-0 left-0 w-full h-[45rem] bg-gradient-to-br from-[#0E21A0] to-[#EC53B0]
          {/*to-[#0055D1]*/} rounded-md filter blur-3xl opacity-60 -z-40"
        />

        {/* <!--Logo--> */}
        <div className=" mx-auto flex items-center justify-center">
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

        <div className="flex items-center space-x-5 flex-1 justify-end w-full">
          {/* Search Box */}
          <form
            className={
              "flex items-center space-x-5 bg-white rounded-md p-2 shadow-md flex-1 md:flex-initial"
            }
          >
            <MagnifyingGlassIcon className="h-6 w-6 text-gray-400" />
            <input
              type="text"
              placeholder="Search"
              value={searchString}
              onChange={(e) => setSearchString(e.target.value)}
              className="flex-1"
            />
            <button type={"submit"} hidden>
              Search
            </button>
          </form>
          <button
            onClick={handleLogout}
            className="bg-red-500 hover:bg-red-400 text-white font-bold py-2 px-4 border-b-4 border-red-700 hover:border-red-500 rounded"
          >
            Logout
          </button>
        </div>
      </div>
    </header>
  );
}

export default Header