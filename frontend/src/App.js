import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import PaymentPage from "./components/PaymentPage";
import Success from "./pages/Success";

const App = () => {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/payment" element={<PaymentPage />} />
                <Route path="/success" element={<Success />} />
            </Routes>
        </Router>
    );
};

export default App;

