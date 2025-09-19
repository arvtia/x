


const NoPagefound = () => {
   return (
      <>
         <div className="w-full h-screen fixed top-0 left-0 bg-black p-10">
            <div className="max-w-7xl mx-auto rounded-3xl">
               <video src="assests/videos/404.mp4"
               autoPlay
               loop
               className="w-full h-full object-contain justify-center"
               ></video>
            </div>
         </div>
      
      </>
   )
}

export default NoPagefound