import React, { useState } from "react";
import { CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
import axios from "axios";

const StripePayment = ({ amount, userId }) => {
    const stripe = useStripe();
    const elements = useElements();
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");

    const handleSubmit = async (event) => {
        event.preventDefault();
        setLoading(true);

        const { error, paymentMethod } = await stripe.createPaymentMethod({
            type: "card",
            card: elements.getElement(CardElement),
        });

        if (error) {
            setMessage(error.message);
            setLoading(false);
        } else {
            try {
                const response = await axios.post("http://localhost:5001/api/payments/stripe", {
                    amount,
                    paymentMethod,
                    userId,
                });

                if (response.data.success) {
                    setMessage("Payment Successful!");
                } else {
                    setMessage("Payment Failed");
                }
            } catch (error) {
                setMessage("Payment Error");
            }
            setLoading(false);
        }
    };

    return (
        <div className="payment-box">
            <h3>Pay with Credit/Debit Card</h3>
            <form onSubmit={handleSubmit}>
                <CardElement />
                <button type="submit" disabled={!stripe || loading}>
                    {loading ? "Processing..." : "Pay with Card"}
                </button>
            </form>
            {message && <p>{message}</p>}
        </div>
    );
};

export default StripePayment;

