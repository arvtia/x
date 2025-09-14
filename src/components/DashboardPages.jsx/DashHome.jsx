const BASE_URL = import.meta.env.VITE_BASE_URL || 'http://localhost:5000';

function DashHome(children) {
   return (
      <div className="max-w-4xl mx-auto p-2.5">

      </div>  
   )
}

function Cards() {
   return (
      <>
         <div className="grid grid-cols-2 gap-2.5">
            <div className="bg-linear-to-l from-pink-300 border border-pink-400 rounded-lg shadow-md p-4 flex flex-col items-center">
               {}
            </div>
         </div>
               
      </>
   )
}
export default {DashHome , Cards}