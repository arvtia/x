import { use } from "react";
import { useEffect, useState } from "react"

const BASE_URL = import.meta.env.VITE_BASE_URL;

const WelcomPage = () => {

   const [userinfo, setUser] = useState([]);;
   const [error, setError] = useState('')
  
   useEffect(()=>{
      const fetchUser = async ()=>{
         const token = localStorage.getItem('token');
         if(!token) {
            setError("No token Found ");
            return
         }

         try{
            const res = await fetch (`${BASE_URL}/api/auth/me`, {
               method:"GET",
               headers:{
                  Authorization: `Bearer ${token}`,
                  "Content-Type": "application/json",
               },
            });
            if (!res.ok) {
               throw new Error("Failed to fetch");
            }
            const data = await res.json();
            setUser(data.user);
            localStorage.setItem("user", JSON.stringify(data));
         } catch (err) {
            setError(err.message)
         }
      };
      fetchUser();
   }, []);

   return (
      <div className="w-full py-5 bg-pink-50 rounded-md">
         <div className=" w-fit mx-auto px-2 py-1 my-3 rounded-full outline-3 outline-offset-2 outline-pink-400 text-3xl text-pink-700 font-semibold">
            <i className="bi bi-heart"></i>
         </div>
         <p className="text-center text-xl font-mono">
            Welcome to Couple-Connect
         </p>
         <p className="text-sm text-neutral-500 w-[90%] text-center mx-auto ">The perfect app to stay connected with your special someone. Share moments, sync schedules, and strengthen your bond.</p>
         <div className="mt-8 w-full space-y-4 px-3">
            <div className="bg-neutral-200 p-3 rounded-md flex justify-between ">
               <p className="font-mono text-neutral-600">Name</p>
               <p className=" text-neutral-800 font-mono ring-1 ring-neutral-300 rounded-md px-2">
                  {userinfo.name}
               </p>
            </div>
            <div className="bg-neutral-200 p-3 rounded-md flex justify-between ">
               <p className="font-mono text-neutral-600">Email</p>
               <p className=" text-neutral-800 font-mono ring-1 ring-neutral-300 rounded-md px-2">
                  {userinfo.email}
               </p>
            </div>
            <div className="bg-neutral-200 p-3 rounded-md flex justify-between items-center">
               <p className="font-mono text-neutral-600">Partner Code</p>
               <div className="flex gap-3 py-1 ring-1 ring-offset-2 ring-neutral-300 rounded-md px-2 text-white bg-black">
                  <p className=" font-mono">
                     {userinfo.partnerCode}
                  </p>
                  <i className="bi bi-square "></i>
               </div>
            </div>
         </div>

      </div>
   )
}

export default WelcomPage