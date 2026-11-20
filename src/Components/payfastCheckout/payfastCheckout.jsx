import React, { useState, useEffect } from 'react';
import { httpsCallable } from 'firebase/functions';
import { functions } from "../../services/firebase/firebaseConfig";

export default function PayfastOnsiteCheckout({ amount, bookingId, className, title, subTitle, type }) {
  const [scriptLoaded, setScriptLoaded] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // 1. Dynamically load the Payfast Onsite Script
  useEffect(() => {
    const scriptId = 'payfast-onsite-script';
    const existingScript = document.getElementById(scriptId);

    if (existingScript) {
      setScriptLoaded(true);
      return;
    }

    const script = document.createElement('script');
    script.id = scriptId;
    script.src = 'https://sandbox.payfast.co.za/onsite/engine.js';
    script.async = true;

    script.onload = () => setScriptLoaded(true);
    script.onerror = () => setError('Failed to load Payfast payment engine.');

    document.body.appendChild(script);
  }, []);

  // 2. Call Firebase Function & Launch Modal
  const handlePayment = async () => {
    if (!scriptLoaded || !window.payfast_do_onsite_payment) {
      setError('Payment system is still loading. Please try again.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const getPaymentIdentifier = httpsCallable(functions, 'getPaymentIdentifier');

      const response = await getPaymentIdentifier({
        amount,
        bookingId,
        type,
      });

      const { identifier } = response.data;

      if (!identifier) {
        throw new Error('No payment identifier received.');
      }

      // Trigger the embedded Payfast modal
      window.payfast_do_onsite_payment({ "uuid":identifier }, (result) => {
        if (result === true) {
          console.log('Payment completed in modal!');
          // Redirect or show success state (rely on ITN webhook for database updates)
        } else {
          console.log('User closed the modal before completing payment.');
        }
      });
    } catch (err) {
      console.error('Checkout error:', err);
      setError(err.message || 'An error occurred while starting checkout.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <button onClick={handlePayment} disabled={loading || !scriptLoaded} className={className}>
        {loading
          ? 'Preparing Checkout...'
          : !scriptLoaded
          ? 'Loading Payment Gateway...'
          : (
          	<>
          	<span className="btn-title">{title}</span>
          	<span className="btn-subtitle">{subTitle}</span>
          	</>
          )
         }
      </button>
    </div>
  );
}


