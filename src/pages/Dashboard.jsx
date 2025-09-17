import { Outlet } from "react-router-dom"
import NavbarDashboard from "../components/NavbarDashboard/NavbarDashboard"


const Dashboard = () => {
   return (
      <div className="h-screen max-w-4xl mx-auto ">
         <div className="py-1">
            {/* <p className="text-md font-semibol px-3 font-mono text-shadow-neutral-400 text-shadow-sm">welcome to Dashboard</p> */}
         </div>
         <Outlet />
         <NavbarDashboard />
      </div>
   )
}
export default Dashboard