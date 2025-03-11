import React from "react";
import { Link } from "react-router-dom";

const Home = () => {
    return (
        <div className="container">
            <h1>Welcome to Payment Page</h1>
            <Link to="/payment">
                <button>Go to Payment</button>
            </Link>
        </div>
    );
};

export default Home;
