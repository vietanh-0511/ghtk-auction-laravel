import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from 'react-router-dom';
import { getUserSessionById } from "../../apiClient";
import { AuctionDetailContext } from "./ShowAuctionDetail";

const ShowProduct = ({ title = "Empty Page" }) => {
    const props = React.useContext(AuctionDetailContext);

    const [data, setData] = useState(null);

    useEffect(() => {
        setData(props.data.session.find(x => x.id === props.currentSession));
    }, [props.currentSession])

    useEffect(() => {
        if (!data) {
            getUserSessionById(window.location.pathname.split('/')[6]).then(res => setData(res.data.data));
        }
    }, [])

    return (
        <div>
            {data && <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>
                    <div>Name: {data.product.name}</div>
                    <div>Description: {data.product.description}</div>
                </span>
                <span>
                    <div>Start price: {data.start_price}$</div>
                    <div>Price step: {data.price_step}$</div>
                    <div>Current highest Bid: {data.highest_bid?data.highest_bid:'Missing'}</div>
                </span>
            </div>}
        </div>
    );
};

export default ShowProduct;
