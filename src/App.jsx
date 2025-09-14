import { BrowserRouter, Route, Routes } from 'react-router-dom'
import './App.css'
// import Home from './pages/Home'
import Navbar from './components/Navbar'
import LoginPage from './pages/LoginPage'
import SignUpPage from './pages/SignupPage'
import Dashboard from './pages/Dashboard'
import DashHome from './components/DashboardPages.jsx/DashHome'
import Stats from './components/HomePageComponent/Stats'
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
              <Route index element={<Stats />} />
              <Route path="chat" element={<div className="p-4">This is the Profile Page</div>} />
              <Route path="settings" element={<div className="p-4">This is the Settings Page</div>} />
              <Route path="memmories" element={<div className="p-4">This is the Settings Page</div>} />
              <Route path="Add" element={<div className="p-4">Page Not Found</div>} />
              <Route path="stats" element={<div className="p-4">This is the Settings Page</div>} />
          </Route>
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
