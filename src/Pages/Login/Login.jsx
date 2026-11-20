import { signInWithEmailAndPassword } from "firebase/auth";
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import FloatingLabelInput from "../../Components/FloatingInputs/FloatingLabelInput";
import FloatingLabelPasswordInput from "../../Components/FloatingInputs/FloatingLabelPasswordInput";
import { auth } from "../../services/firebase/firebaseConfig";
import FullScreenLoader from "../../Components/Loaders/FullScreenLoader";
import "./Login.css"

export default function LogIn(){
    const [email,setEmail] = useState("")
    const [password,setPassword] = useState("")
    const [error, setError] = useState("")
    const [loading, setLoading] = useState(false)
    const navigate = useNavigate()

    
    const handleSubmit = async (e) => {
        e.preventDefault()
        setError("")

        try {
            setLoading(true)
            await signInWithEmailAndPassword(auth,email,password)
            navigate("/")
        } catch (error) {
            setError("You have entered the wrong credentials")
            console.error(error)
        }finally {
            setLoading(false)
        }
    }

    return (
        <div className="auth-viewport-wrapper">
		  {loading && <FullScreenLoader />}
		  
		  <div className="auth-card-frame">
		    <h1>Log In</h1>
		    
		    <form onSubmit={handleSubmit} className="auth-form-layout">
		      <FloatingLabelInput
		        id={"login-email"}
		        label={"Email"}
		        value={email}
		        onChange={(e) => { setEmail(e.target.value); }}
		      />
		      
		      <div className="password-input-group">
		        <FloatingLabelPasswordInput
		          value={password}
		          onChange={(e) => { setPassword(e.target.value); }}
		        />
		        {/* Added Forgot Password router Link directly under password field */}
		        <div className="forgot-password-link-wrapper">
		          <Link to="/forgot-password" className="forgot-password-link">
		            Forgot Password?
		          </Link>
		        </div>
		      </div>

		      <button type={"submit"} className="auth-submit-btn">Log In</button>
		      
		      {error && <div className="auth-error-banner">{error}</div>}
		      
		      <p className="auth-switch-view-text">
		        if you dont have an account, sign up <Link to={"/sign-up"}>Here</Link>
		      </p>
		    </form>
		  </div>
		</div>
    )
}
