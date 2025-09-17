import ActivityGraph from "../HomePageComponent/Activities";
import DhomeAll from "../HomePageComponent/DhomeAll";
import Stats from "../HomePageComponent/Stats";


function DashHome() {
   return (
      <div className="max-w-4xl mx-auto p-2.5 space-y-3">
         <DhomeAll />
      </div>  
   )
}

export default DashHome