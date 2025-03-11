import React from "react";
import StripePayment from "./StripePayment";
import PayPalPayment from "./PayPalPayment";

const PaymentPage = () => {
    return (
        <div className="container">
            <h2>Choose Payment Method</h2>
            <StripePayment amount="10" userId="123" />
            <PayPalPayment amount="10" userId="123" />
        </div>
    );
};

export default PaymentPage;

