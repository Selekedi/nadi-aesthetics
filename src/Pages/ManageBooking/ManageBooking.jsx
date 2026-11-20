import React, { useEffect, useReducer, useState } from 'react';
import {useParams, useNavigate} from 'react-router-dom'
import { doc, onSnapshot } from "firebase/firestore";
import { db } from "../../services/firebase/firebaseConfig";
import { getBookingById, confirmBooking, payFull, payRemaining} from "../../Server/Server"
import FullScreenLoader from "../../Components/Loaders/FullScreenLoader";
import PayfastOnsiteCheckout from "../../Components/payfastCheckout/payfastCheckout";
import "./ManageBooking.css"

export default function ManageBooking(){
	const { bookingId } = useParams()
	const [booking,setBooking] = useState(null)
	const [isLoading,setIsLoading] = useState(false)
	console.log(booking)
	
	useEffect(() => {
    	const docRef = doc(db,"bookings",bookingId)
    	const unsubscribe = onSnapshot(docRef, (docSnapshot) => {
    		if (docSnapshot.exists()) {
			// This blocks runs on the initial load AND whenever the document changes
			const updatedData = {
				id:docSnapshot.id,
				...docSnapshot.data()
			};
			console.log("Current document data: ", updatedData);
			
			// Trigger your application logic / state updates here
			setBooking(updatedData);
		  } else {
			// This runs if the document is deleted while you are listening
			console.log("The document has been deleted!");
		  }
    	})
    	
    	return () => unsubscribe()
    },[bookingId])
    
    const handlePayDeposit = async () => {
    	try{
    		setIsLoading(true)
    		await confirmBooking(bookingId,booking?.date,booking?.slot)
    	}	
    	catch (e){
    		console.error(e)
    	}finally {
    		setIsLoading(false)
    	}
    }
    
    const handleConfirmAndPay = async () => {
    	try{
    		setIsLoading(true)
    		await payFull(bookingId,booking?.date,booking?.slot,booking.fullPrice)
    	}	
    	catch (e){
    		console.error(e)
    	}finally {
    		setIsLoading(false)
    	}
    }
    
    const handlePayRemainingBalance = async () => {
    	const remaining = booking.fullyPrice - 50
    	try{
    		setIsLoading(true)
    		await payRemaining(bookingId,remaining)
    	}	
    	catch (e){
    		console.error(e)
    	}finally {
    		setIsLoading(false)
    	}
    }
    
    
	
	return (
		<section className="booking-container">
		  <header className="booking-header">
		    <h1>Your Booking Details</h1>
		    <p className="booking-subtitle">Review and confirm your scheduled session</p>
		  </header>

		  <div className="booking-content">
		    {booking && (
		      <div className="booking-card">
		        {/* Status Badge */}
		        <div className={`status-badge ${booking.confirmed ? 'confirmed' : 'pending'}`}>
		          {booking.confirmed ? '● Confirmed' : '● Pending Confirmation'}
		        </div>

		        {/* Style Name */}
		        <div className="booking-row style-name-row">
		          <span className="label">Style Name</span>
		          <span className="value style-title">{booking.styleName}</span>
		        </div>

		        {/* Date & Time Grid */}
		        <div className="booking-grid">
		          <div className="grid-item">
		            <div className="icon-wrapper">
		              <svg xmlns="http://w3.org" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="icon">
		                <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5" />
		              </svg>
		            </div>
		            <div>
		              <span className="block-label">Date</span>
		              <span className="block-value">{booking.date}</span>
		            </div>
		          </div>

		          <div className="grid-item">
		            <div className="icon-wrapper">
		              <svg xmlns="http://w3.org" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="icon">
		                <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
		              </svg>
		            </div>
		            <div>
		              <span className="block-label">Time Slot</span>
		              <span className="block-value">{booking.slot}</span>
		            </div>
		          </div>
		        </div>

		        {/* Total Price Section */}
		        <div className="booking-row total-price-row">
		          <span className="label">Total Price</span>
		          <span className="value price-tag">{booking.fullPrice}</span>
		        </div>

		        {/* Actions Footer */}
		        <div className="actions-panel">
		          {booking && !booking.confirmed && (
					<div className="booking-card-actions">
					  {/* Policy Notice (Tells the full story upfront) */}
					  <p className="policy-notice">
						ℹ️ The $50 reservation fee is non-refundable for both options.
					  </p>

					  {/* Button Wrapper */}
					  <div className="button-group">
						{/* Secondary Option: Pay Deposit */}
						<PayfastOnsiteCheckout
							amount={"50"}
							bookingId={bookingId}
							className={"btn btn-secondary btn-pay-deposit"}
							title={"Pay Deposit Only"}
							subTitle={"R50 due now • Non-refundable"}
							type={"confirm"}
						/>

						{/* Primary Option: Pay Full Amount */}
						<PayfastOnsiteCheckout
							amount={String(booking.fullPrice)}
							bookingId={bookingId}
							className={"btn btn-primary btn-pay-full"}
							title={"Pay Full Amount"}
							subTitle={`R${booking.fullPrice} due now • R${booking.fullPrice - 50} refundable`}
							type={"payFull"}
						/>
					  </div>
					</div>

				  )}
				  {booking && booking.confirmed && !booking.fullyPaid && (
					<div className="balance-due-panel">
					  <div className="status-message">
						Your appointment is secured! Remaining balance is due at arrival or online.
					  </div>
						<PayfastOnsiteCheckout
							amount={String(booking.fullPrice - 50)}
							bookingId={bookingId}
							className={"btn btn-primary btn-pay-full"}
							title={"Pay Remaining Amount"}
							subTitle={`R${booking.fullPrice - 50} due now`}
							type={"payRemaining"}
						/>
					</div>
				  )}
				  {booking && booking.confirmed && booking.fullyPaid && (
					<div className="success-message">
					  Thank you! Your appointment is fully paid and locked in.
					</div>
				  )}
		        </div>
		      </div>
		    )}
		  </div>

		  {isLoading && <FullScreenLoader />}
		</section>
	)
}
