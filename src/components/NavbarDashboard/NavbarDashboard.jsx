import { Link } from "react-router-dom"

const DataBNB = [
   {
      id: 1,
      title: 'Home',
      link: '/',
      icon: 'house',
   },
   {
      id: 2,
      title: 'Activities',
      link: '/chat',
      icon: 'heart-pulse',
   },
   {
      id: 3,   
      title: 'Memmories',
      link: '/memmories',
      icon: 'bi bi-calendar2',
   },
   {
      id: 4,
      title: 'Add',
      link: '/Add',
      icon: 'plus',
   },
   {
      id: 5,
      title: 'Stats',
      link: '/stats',
      icon: 'people',
   },
]


function NavbarDashboard() {
   return (
      <div className="max-w-4xl z-50 mx-auto flex justify-evenly gap-3  bg-white border-t border-neutral-300 fixed bottom-0 left-0 right-0">
         {  
            DataBNB.map((item, idx) => (
               <Link to={item.link} key={idx} className="size-15 px-1 flex flex-col items-center justify-center text-neutral-600 hover:text-neutral-800 my-1.5 ">
                  <i className={`bi bi-${item.icon} text-2xl`}></i>
                  <span className="xs:hidden md:block">{item.title}</span>
               </Link>
            ))
         }      
      </div>
   )
}

export default NavbarDashboard
