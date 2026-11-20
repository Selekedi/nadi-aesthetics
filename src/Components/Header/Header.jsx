import React, { useState, forwardRef, useRef, useEffect } from "react";
import { useLocation, useNavigate } from 'react-router-dom';
import "./Header.css";
import NavItem from "../Navbar/NavItem";
import { Link } from "react-router-dom";


const Header = forwardRef(({id}, ref) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const closeMenu = () => setMenuOpen(false);
  const navRef = useRef(null);
  const location = useLocation();
  const navigate = useNavigate();
  const showBackButton = location.pathname !== "/";
  const [showInstallButton,setShowInstallButton] = useState(false)
  let deferredPrompt = useRef(null);


  const navItems = [
  	{
  		label:"book",
  		to:"/book/" + id,
  	},
  	{
  		label:"my bookings",
  		to:"/my-bookings/" + id,
  	},
  	
  ];
  
  useEffect(() => {
    function handleClickOutside(e) {
      if (menuOpen && navRef.current && !navRef.current.contains(e.target)) {
        setMenuOpen(false);
      }
    }
    function handleBeforeInstall(e){
    	e.preventDefault()
		deferredPrompt.current = e
    }
    
    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("touchstart", handleClickOutside);
	window.addEventListener("beforeinstallprompt", handleBeforeInstall)

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("touchstart", handleClickOutside);
	  window.removeEventListener("beforeinstallprompt",handleBeforeInstall)
    };
  }, [menuOpen]);
  
  async function handleInstallApp(){
	if(deferredPrompt.current){
		setShowInstallButton(false)
		deferredPrompt.prompt()
		const { outcome } = await deferredPrompt.userChoice;
		console.log(outcome)
		deferredPrompt.current = null
	}
  }

  return (
    <header ref={ref} className="header">
      <div className="container">
		  <div className="left-side">
			{showBackButton && (
			  <button className="back-button" onClick={() => navigate(-1)}>
				← Back
			  </button>
			)}
			<Link className="logo-link" to={"/"}>Gae Books App</Link>
		  </div>

		  <nav ref={navRef} className={`nav ${menuOpen ? "open" : ""}`}>
			{navItems.map(item => (
			  <NavItem key={item.label} label={item.label} to={item.to} onClick={closeMenu} />
			))}
		  </nav>

		  <button className="menu-toggle" onClick={(e) => {
			e.stopPropagation()
        	setMenuOpen(!menuOpen)
			console.log("changes")
         }}
         onMouseDown={(e) => e.stopPropagation()}
  		  onTouchStart={(e) => e.stopPropagation()}
		  
		  >
			  <div className="bar"></div>
		      <div className="bar"></div>
		      <div className="bar"></div>
		  </button>
		</div>
		<button id="installApp" className={`${showInstallButton ? "show":""}`} onClick={handleInstallApp}>install app</button>
    </header>
  );
});

export default Header;

