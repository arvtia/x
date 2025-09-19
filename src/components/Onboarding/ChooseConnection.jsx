import { useNavigate } from "react-router-dom";

const ChooseConnection = () =>{
   const navigate = useNavigate()
   const create = () =>{
      navigate('/createConnection/create')
   }

   const wait = () =>{
      navigate('/createConnection/partner-code')
   }

   return(
      <>
         < p className="text-lg text-center text-neutral-700">How do you like to Connect</p>
         <p className="text-sm text-neutral-400 text-center">Choose how you want to establish the connection with your partner</p>

         <div className="mt-5 p-3">
            <div onClick={create} className="mb-5 px-4 py-3 rounded-lg shadow-sm hover:shadow-lg hover:bg-neutral-100 transition-shadow duration-200 ring-1 ring-neutral-200 hover:ring-neutral-400 ">
               <div className="flex gap-4 py-2 items-center">
                  <div className="px-2 py-1 bg-blue-100 rounded-lg">
                     <i className="bi bi-person-plus text-2xl "></i>
                  </div>
                  <div className="flex flex-col space-y-1">
                     <p className="text-md text-neutral-700 font-semibold">
                        I want to connect First
                     </p>
                     <p className="text-sm text-neutral-400">
                        I have my partner's code and want to initiate the connection
                     </p>
                  </div>
               </div>
            </div>

            <div onClick={wait} className=" px-4 py-3 rounded-lg shadow-sm hover:shadow-lg hover:bg-neutral-100 transition-shadow duration-200 ring-1 ring-neutral-200 hover:ring-neutral-400">
               <div className="flex gap-4 py-2 items-center">
                  <div className="px-2 py-1 bg-green-200 rounded-lg">
                     <i className="bi bi-qr-code-scan text-2xl "></i>
                  </div>
                  <div className="flex flex-col space-y-1">
                     <p className="text-md text-neutral-700 font-semibold">
                        Let my partner to connect to me
                     </p>
                     <p className="text-sm text-neutral-400">
                        I'll share my code and wait for my partner to connect
                     </p>
                  </div>
               </div>
               {/* another option */}
               
            </div>
            {/* antoher one */}
         </div>
      </>
   )
}

export default ChooseConnection;