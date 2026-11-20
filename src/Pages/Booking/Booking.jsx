import React, { useEffect, useReducer, useState } from 'react';
import {useParams,useNavigate} from 'react-router-dom'
import './Booking.css'
import { FormatDateToString } from "../../utils/FormatDateToString";
import DatePicker from "../../Components/DatePicker/DatePicker";
import Slots from "../../Components/Slots/Slots";

import { createBooking, getConfirmedBookingsByDate} from "../../Server/Server"



export default function Booking(){
	const {userId} = useParams()
    const [date, setDate] = useState(null)
    //TODO format date to YYYYMMDD
    const [style,setStyle] = useState(null)
    const [slot,setSlot] = useState(null)
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [isConfrimModalOpen, setIsConfirmModalOpen] = useState(false)
    const [bookings,setBookings] = useState([])
    const formattedDate = date?  FormatDateToString(date) : ""
    const navigate = useNavigate()
    const booking = {
    	"clientId":userId,
    	"style":(style || ""),
    	"slot": (slot || ""),
    	"date":(formattedDate)
    }

    const handleChangeDate = (date) => {
        setDate(date)
    }

    const styles = [
        {
            name:"volume set",
            price:250
        },
        {
            name:"roll set",
            price:25
        },
        {
            name:"mosss pit",
            price:360
        },
    ]
    
    useEffect(() => {
    	if(!date) return
    	getConfirmedBookingsByDate(formattedDate).then(dbBookings => setBookings(dbBookings))
    },[date])
    
    console.log(bookings)

    /*const bookings = [
        {
            date:"2026-02-12",
            time:"10:00"
        },
        {
            date:"2026-02-12",
            time:"12:00"
        },
        {
            date:"2026-02-13",
            time:"08:00"
        },
        {
            date:"2026-02-13",
            time:"14:00"
        },
        {
            date:"2026-02-13",
            time:"16:00"
        },
        {
            date:"2026-02-14",
            time:"10:00"
        },
        {
            date:"2026-02-14",
            time:"08:00"
        },
        {
            date:"2026-02-14",
            time:"18:00"
        },

    ]*/

    const filterBookings = bookings.filter(booking => booking.date === formattedDate)
    
    const removeStyle = () => {
    	setStyle(null)
    }

    const openModal = () => {
        setIsModalOpen(true)
    }

    const closeModal = () => {
        setIsModalOpen(false)
    }
    
    const openConfirmModal = () => {
        setIsConfirmModalOpen(true)
    }

    const closeConfirmModal = () => {
        setIsConfirmModalOpen(false)
    }

    const handleStyleSelection = (idx) => {
        setStyle(styles[idx])
        closeModal()
    }
    
    const handleProceed = () => {
    	if(!booking.style || !booking.slot || !booking.date){
    		alert("either no style selected or no slot selected")
    		return
    	}
    	console.log(booking)
    	openConfirmModal()
    }
    
    const handleConfirm = async() => {
    	try{
    		const bookingId = await createBooking(booking)
    		closeConfirmModal()
    		navigate("/booking/" + bookingId)
    	}
    	catch (e) {
    		console.error(e)
    	}
    }

    return (
        <div className="booking-container">
            <div className="style-choosing-container">
                {!style ? 
                
                <button id="addBtn" className="add-btn" onClick={openModal}>
                        <span className="plus">+</span>
                        <span>Add Style</span>
                </button> 
                    : 
                <div id="selectedCard" className="chosen-style-container">
                    <div className="style">
                        <span className="name">{style?.name}</span>
                        <span className="price">R{style?.price}.00</span>
                    </div>

                    <span id="closeBtn" className="close" onClick={removeStyle}>×</span>
                </div>
                }

                {isModalOpen && 
                    <div id="modal" className="modal" onClick={closeModal}>
                        <div className="modal-backdrop"></div>

                        <div className="modal-content">
                            <div className="modal-header">
                                <h2>Select a Style</h2>
                                <button id="closeModalBtn" className="close-btn" onClick={closeModal}>×</button>
                            </div>

                            <div className="style-grid">
                                {styles.map((styl,idx) => (
                                    <div key={idx} className="style-card" onClick={() => handleStyleSelection(idx)} >
                                        <div className="style-image">Image</div>
                                        <div className="style-info">
                                            <span className="style-name">{styl.name}</span>
                                            <span className="style-price">R{styl.price}.00</span>
                                        </div>
                                    </div>
                                ))}
                            </div>

                        </div>
                    </div>
                }
                
                {isConfrimModalOpen && 
                    <div id="modal" className="modal">
                        <div className="modal-backdrop"></div>

                        <div className="modal-content">
                            <div className="modal-header">
                                <h2>Confirm booking</h2>
                                <button id="closeModalBtn" className="close-btn" onClick={closeConfirmModal}>×</button>
                            </div>

                            <div className="details">
                                <span>Date and Time: {booking?.date} at {booking?.slot}</span>
                                <span>Location : Polokwane</span>
                                <span>Style: {booking?.style?.name}</span>
                                <span>Price: {booking?.style?.price}</span>
                            </div>
                            <div className='warning'>
                                <p className='warning-paragraph'>
                                    Always make sure you check the location because it changes sometimes
                                </p>
                            </div>
                            <div className='controls'>
                                <button onClick={closeConfirmModal}>
                                    Edit
                                </button>
                                <button onClick={handleConfirm}>
                                    Confirm
                                </button>
                            </div>
                        </div>
                    </div>
                }
            </div>
            <div className = "date-picker">
                <DatePicker onDateChange={handleChangeDate}/>
            </div>
            <Slots bookings={filterBookings} onSlotSelect={setSlot}/>
            <button className="proceed" onClick={() => handleProceed()}>Proceed</button>
        </div>
    )
}
