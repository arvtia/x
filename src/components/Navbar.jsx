
const Navbar = () => {
   return (
      <>
         <div className="max-w-4xl mx-auto sticky top-0 z-50 bg-white">
            <div className="flex justify-between items-center py-4 px-6 border-b border-neutral-200"> 
               {/* logo + name of app*/}
               <div className="flex gap-2 items-center">
                  <div className="size-10 backdrop-blur-md bg-indigo-200 rounded-md p-2 cursor-pointer hover:bg-indigo-300 transition-z z-20 hover:z-40  hover:ring-2  delay-75 shadow-lg shadow-indigo-200/50">
                  </div>

                  <div className="flex flex-col space-y-px">
                     <div className="text-lg text-shadow-md font-semibold text-shadow-initial">Couple's Journey</div>
                     <div className=" flex gap-1 items-center p-1 px-2  bg-green-100 rounded-full w-fit">
                        <div className="w-fit relative">
                           <div className="size-4 rounded-full bg-green-300 opacity-20 animate-pulse"></div>
                           <div className="size-2 bg-green-500 absolute inset-y-1 rounded-full inset-x-1 z-30"></div>
                        </div>
                        <div className="text-[10px] font-stretch-75% font-semibold">Connected</div>
                     </div>
                  </div>
               </div>
               <div className="flex relative w-fit ">
                  <div className="size-10 bg-neutral-200 rounded-full p-2 cursor-pointer hover:bg-neutral-300 transition-z z-20 hover:z-40 ring-1 ring-neutral-300 hover:ring-2 hover:ring-white delay-75">
                     {/* Placeholder for future icons or navigation items */}
                     <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6"></svg>
                  </div>
                  <div className="size-10 bg-neutral-200 rounded-full p-2 cursor-pointer hover:bg-neutral-300 transition absolute right-6 z-30 hover:z-40 ring-1 ring-neutral-300 hover:ring-2 hover:ring-white delay-75">
                     {/* Placeholder for future icons or navigation items */}
                     <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6"></svg>
                  </div>
               </div>
            </div>
         </div>
      </>
   )
}


export default Navbar;