import ActivityGraph from "../HomePageComponent/Activities";
import Stats from "../HomePageComponent/Stats";

const BASE_URL = import.meta.env.VITE_BASE_URL || 'http://localhost:5000';

function DashHome() {
   return (
      <div className="max-w-4xl mx-auto p-2.5 space-y-3">
         <Stats />
         <ActivityGraph />
      </div>  
   )
}

export default DashHome