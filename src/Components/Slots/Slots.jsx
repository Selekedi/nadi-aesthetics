import React, { useEffect, useRef, useState } from "react";
import "./Slot.css"

export default function Slots({bookings, onSlotSelect}){
    const [timeSlot,setTimeslot] = useState(null)
    useEffect(() => {
    	onSlotSelect(timeSlot)
    },[timeSlot,onSlotSelect])

    const slots = ["08:00", "10:00", "12:00", "14:00", "16:00", "18:00", "20:00"]

    const handleSelectSlot = (e,idx) => {
        e.preventDefault()
        const target = e.target
        if(target.classList.contains("unavailable")) return
        setTimeslot(slots[idx])
    }
    
    return (
        <div className="slots-container">
            {slots.map((slot,idx) => (
                <span className={ bookings.some(booking => booking.slot === slot) ? "unavailable" : slot === timeSlot ? "available selected":  "available"}
                    onClick={(e) => handleSelectSlot(e,idx)}
                >
                    {slot}
                </span>
            ))}
        </div>
    )
}
