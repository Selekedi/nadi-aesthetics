import { addDoc,collection, deleteDoc, doc, getDoc, getDocs, query, serverTimestamp, setDoc, where, updateDoc } from "firebase/firestore"
import { createUserWithEmailAndPassword, signOut } from "firebase/auth";
import { auth, db } from "../services/firebase/firebaseConfig"


export async function registerUserWithProfile(email, password, name) {
  try {
    // A. Create the authentication account
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    // B. Reference a document in the 'users' collection using the Auth UID
    const userDocRef = doc(db, "users", user.uid);

    // C. Write the custom profile data to Firestore
    await setDoc(userDocRef, {
      email: user.email,
      name
    });

    console.log("User authenticated and Firestore profile created successfully!");
    return user.uid;

  } catch (error) {
    console.error("Error during registration:", error.message);
    throw error;
  }
}

export async function createBooking(booking){
	const bookingRef = collection(db,"bookings")
	
	
	const bookingDocRef = await addDoc(bookingRef,{
		clientId:booking.clientId,
		fullPrice:booking.style.price,
		styleName:booking.style.name,
		date:booking.date,
		slot:booking.slot,
		confirmed:false,
		amountPaid: 0,
		fullyPaid:false,
		createdAt:serverTimestamp()
	})
	return bookingDocRef.id

}

export async function getConfirmedBookingsByDate(date){
	const bookingsRef = collection(db,"bookings")
	const q = query(bookingsRef,
		where("date","==",date),
		where("confirmed","==",true)
	)
	
	const bookingsSnapshot = await getDocs(q)
	if(!bookingsSnapshot.empty){
		return bookingsSnapshot.docs.map(doc => ({
			id:doc.id,
			...doc.data()
		}))
	}
	return []
}

export async function getBookingsClientId(clientId){
	const bookingsRef = collection(db,"bookings")
	const q = query(bookingsRef,
		where("clientId","==",clientId)
	)
	
	const bookingsSnapshot = await getDocs(q)
	if(!bookingsSnapshot.empty){
		return bookingsSnapshot.docs.map(doc => ({
			id:doc.id,
			...doc.data()
		}))
	}
	return []
}

export async function getBookingById(id){
	const bookingDocRef = doc(db,"bookings",id)
	const snapShot = await getDoc(bookingDocRef)
	if(!snapShot.exists){
	   return null
	}
	
	return ({
		id:snapShot.id,
		...snapShot.data()
	})
}

export async function confirmBooking(id, date, slot) {
  const bookingsRef = collection(db, "bookings");
  const q = query(bookingsRef,
    where("date", "==", date),
    where("slot", "==", slot),
    where("confirmed", "==", true)
  );
  
  try {
    const existingBookings = await getDocs(q);
    
    if (!existingBookings.empty) {
      return { success: false, error: "SLOT_TAKEN", message: "This slot has already been booked." };
    }
    
    const bookingRef = doc(db, "bookings", id);
    await updateDoc(bookingRef, { confirmed: true, amountPaid:50 });
    
    return { success: true, message: "Booking confirmed successfully!" };
    
  } catch (error) {
    return { success: false, error: "SERVER_ERROR", message: error.message };
  }
}

export async function payRemaining(id,amount) {
  const bookingRef = doc(db, "bookings",id);
  
  try {
    
    await updateDoc(bookingRef, { fullyPaid: true, amountPaid:amount });
    
    return { success: true, message: "Booking confirmed successfully!" };
    
  } catch (error) {
    return { success: false, error: "SERVER_ERROR", message: error.message };
  }
}

export async function payFull(id, date, slot,amount) {
  const bookingsRef = collection(db, "bookings");
  const q = query(bookingsRef,
    where("date", "==", date),
    where("slot", "==", slot),
    where("confirmed", "==", true)
  );
  
  try {
    const existingBookings = await getDocs(q);
    
    if (!existingBookings.empty) {
      return { success: false, error: "SLOT_TAKEN", message: "This slot has already been booked." };
    }
    
    const bookingRef = doc(db, "bookings", id);
    await updateDoc(bookingRef, { confirmed: true, fullyPaid:true, amountPaid:amount });
    
    return { success: true, message: "Booking confirmed successfully!" };
    
  } catch (error) {
    return { success: false, error: "SERVER_ERROR", message: error.message };
  }
}


export async function logOut(){
  try {
    await signOut(auth)
  } catch (error) {
    console.error(error)
  }
}
