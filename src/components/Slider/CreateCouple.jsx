import { Outlet } from "react-router-dom";


const CreateCouple =() =>{
   return(
      <>
         <div className="h-screen w-full bg-pink-200">
            <div className="bg-pink-200 w-full pt-10 px-3">
            <div className="max-w-md mx-auto z-50 h-full rounded-md bg-neutral-50 flex justify-center outline-offset-5 ">
               <div className="w-full shadow-lg p-4 rounded-lg ">
                  <Outlet />
               </div>
            </div>
         </div>
         </div>
      
      </>
   )
}

export default CreateCouple;
