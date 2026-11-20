import React, { useEffect, useReducer, useState } from 'react';
import {useParams, useNavigate} from 'react-router-dom'
import { getBookingsClientId} from "../../Server/Server"
import "./MyBookings.css"

export default function MyBookings(){
	const {userId} = useParams()
	const [bookings,setBookings] = useState(null)
	const navigate = useNavigate()
	useEffect(() => {
    	getBookingsClientId(userId).then(dbBookings => setBookings(dbBookings))
    },[userId])
	return (
		<section className="bookings-section">
		  <div className="bookings-header">
			<h1>My Bookings</h1>
			<p>Select an appointment below to view details.</p>
		  </div>

		  {bookings && bookings.length > 0 ? (
			<div className="bookings-grid">
			  {bookings.map((booking) => (
				<div
				  key={booking.id}
				  className="booking-card"
				  onClick={() => navigate("/booking/" + booking.id)}
				>
				  <div className="card-top">
				    <h2 className="style-name">{booking.styleName}</h2>
				    <span className="arrow-icon">→</span>
				  </div>

				  <div className="booking-info">
				    <div className="info-row">
				      <span className="info-label">Date</span>
				      <span className="info-value">{booking.date}</span>
				    </div>
				    <div className="info-row">
				      <span className="info-label">Time</span>
				      <span className="info-value">{booking.slot}</span>
				    </div>
				  </div>

				  <div className="card-footer">
				    <span className="info-label">Total Price</span>
				    <span className="price-value">R{booking.fullPrice}</span>
				  </div>
				</div>
			  ))}
			</div>
		  ) : (
			<div className="empty-state">
			  <p>You don't have any bookings yet.</p>
			</div>
		  )}
		</section>

	)
}
