import { BrowserRouter, Route, Routes } from 'react-router-dom'
import './App.css'
// import Home from './pages/Home'
import Navbar from './components/Navbar'
import LoginPage from './pages/LoginPage'
import SignUpPage from './pages/SignupPage'
import Dashboard from './pages/Dashboard'
// import DashHome from './components/DashboardPages.jsx/DashHome'
// import Stats from './components/HomePageComponent/Stats'
import ProfileDash from './components/ProfileDashboardComponenets/ProfileDash'
// import ActivityGraph from './components/HomePageComponent/Activities'
import DhomeAll from './components/HomePageComponent/DhomeAll'
import MainCreatePost from './components/PostComponents/MainCreatePost'
// import XAllPosts from './components/PostComponents/handleAllPosts'
import { MainMemmories } from './components/memmoriesComponent/MainMemmories'
// import NavbarDashboard from './components/NavbarDashboard/NavbarDashboard'

function App() {
  

  return (
    <>
      <BrowserRouter>
        <Navbar />
        <Routes>
          {/* <Route path="/" element={<Home />} /> */}
          {/* <Route path="/about" element={<About />} /> */}
          <Route path='/login' element={<LoginPage />} />
          <Route path='/signup' element={<SignUpPage />} />
          <Route path='/' element={<Dashboard />}>
              {/* Nested routes can be added here */}
              <Route index element={<DhomeAll />} />
              <Route path="chat" element={<MainMemmories />} />
              <Route path="settings" element={<div>help help</div>} />
              <Route path="memmories" element={<div className="p-4">This is the Settings Page</div>} />
              <Route path="Add" element={<MainCreatePost />} />
              <Route path="stats" element={<ProfileDash/>} />
          </Route>
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
