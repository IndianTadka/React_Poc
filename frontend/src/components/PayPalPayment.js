import React from "react";
import { PayPalButtons, PayPalScriptProvider } from "@paypal/react-paypal-js";
import axios from "axios";

const PayPalPayment = ({ amount, userId }) => {
    const handleApprove = (orderDetails) => {
        console.log("✅ Payment Captured:", orderDetails);

        // ✅ Send to backend after successful capture (no need to capture again)
        axios.post("http://localhost:5001/api/payments/paypal", {
            orderID: orderDetails.id,  // ✅ Pass captured order ID
            userId,
            amount: Number(amount),
            payerID: orderDetails.payer.payer_id, // ✅ Pass payer ID
        })
        .then((res) => {
            if (res.data.success) {
                alert("✅ Payment recorded successfully!");
            } else {
                alert("❌ Payment failed: " + res.data.error);
            }
        })
        .catch((err) => {
            console.error("❌ API Request Failed:", err);
            alert("An error occurred while processing the payment.");
        });
    };

    return (
        <div className="payment-box">
            <h3>Pay with PayPal</h3>
            <PayPalScriptProvider options={{ "client-id": process.env.REACT_APP_PAYPAL_CLIENT_ID }}>
                <PayPalButtons
                    style={{ layout: "vertical" }}

                    createOrder={(data, actions) => {
                        const formattedAmount = Number(amount).toFixed(2);
                        return actions.order.create({
                            intent: "CAPTURE",
                            purchase_units: [
                                {
                                    amount: {
                                        value: formattedAmount,
                                    },
                                },
                            ],
                        }).then((orderID) => {
                            console.log("✅ PayPal Order Created:", orderID);
                            return orderID; // ✅ Send the valid PayPal Order ID
                        });
                    }}

                    // ✅ Capture payment and send order details
                    onApprove={(data, actions) => {
                        return actions.order.capture().then((details) => {
                            handleApprove(details); // ✅ Send captured order details
                        });
                    }}

                    onError={(err) => {
                        console.error("❌ PayPal Payment Error:", err);
                        alert("PayPal payment failed.");
                    }}
                />
            </PayPalScriptProvider>
        </div>
    );
};

export default PayPalPayment;



