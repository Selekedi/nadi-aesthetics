
import {HashRouter as Router, Link, NavLink, Route, Routes, useLocation, useNavigate} from 'react-router-dom'
import logo from "./assets/vite.svg"
import { useEffect, useState, useRef } from 'react'
import { auth } from './services/firebase/firebaseConfig'
import { onAuthStateChanged } from 'firebase/auth'
import SplashScreen from './Components/Loaders/SplashScreen'
import LogIn from './Pages/Login/Login'
import Booking from "./Pages/Booking/Booking"
import Home from "./Pages/Home/Home"
import MyBookings from "./Pages/MyBookings/MyBookings"
import ManageBooking from "./Pages/ManageBooking/ManageBooking"
import SignUp from "./Pages/SignUp/SignUp"
import ForgotPassword from "./Pages/ForgotPassword/ForgotPassword"
import ProtectedRoute from './utils/ProtectedRoute'
import Header from "./Components/Header/Header"
import { debounce } from "./utils/debouce"


function App() {
  const [user,setUser] = useState(undefined)
  const headerRef = useRef(null);
  const [headerHeight, setHeaderHeight] = useState(0);

  

  useEffect(() => {
    const updateHeight = () => {
      if (headerRef.current) {
        setHeaderHeight(headerRef.current.offsetHeight);
      }
    };
    
    const debouncedUpdate = debounce(updateHeight, 100);
    
    window.addEventListener("resize", debouncedUpdate);
  
    const unSubscirbe = onAuthStateChanged(auth,(firebaseUser) => {
      setUser(firebaseUser)
      setTimeout(updateHeight,100)
    })

    return () => {
      unSubscirbe()
    }
  },[])
  if(user === undefined) return <SplashScreen/>
  return (
    <Router>
      <Header id = {user?.uid} ref={headerRef}/>
      <main style={{padding:"24px",paddingTop:`${headerHeight + 10}px`}}>
          <Routes>
            <Route path='/login' element={<LogIn/>}/>
            <Route path='/sign-up' element={<SignUp/>}/>
            <Route path="/" element={<Home/>}/>
            <Route element={<ProtectedRoute user={user}/>}>
              <Route path='/book/:userId' element={<Booking/>}/>
              <Route path='/my-bookings/:userId' element={<MyBookings/>}/>
              <Route path='/booking/:bookingId' element={<ManageBooking/>}/>
            </Route>
          </Routes>
      </main>
    </Router>
  )
}

export default App
