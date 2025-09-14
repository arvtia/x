
const Stats = () => {
  return (
    <>
      <div className="max-w-4xl mx-auto bg-neutral-100 grid grid-cols-2">
         <div className="flex flex-col space-y-2 text-center p-4">
            <div className="text-3xl font-bold text-indigo-600">1,234</div>
            <div className="text-sm text-gray-600">Total Memories Shared</div>
         </div>
         <div className="flex flex-col space-y-2 text-center p-4 border-l border-neutral-300">
            <div className="text-3xl font-bold text-indigo-600">567</div>
            <div className="text-sm text-gray-600">Days Together</div>
         </div>
      </div>
    </>
  )
}

export default Stats