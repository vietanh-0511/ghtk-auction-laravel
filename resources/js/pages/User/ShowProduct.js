import React, { useState, useEffect, useRef } from "react";
import { Slider } from 'primereact/slider';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { createBidBySessionId, getUserSessionById } from "../../apiClient";
import { AuctionDetailContext } from "./ShowAuctionDetail";
import { Toast } from "primereact/toast";
import { Image } from 'primereact/image';
import { useNavigate } from 'react-router-dom';
import { Galleria } from 'primereact/galleria';

function formatNumToString(num) {
    return num.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1.')
};

const ShowProduct = ({ title = "Empty Page" }) => {
    const props = React.useContext(AuctionDetailContext);
    const toast = useRef(null);

    const [data, setData] = useState(null);
    const [renew, setRenew] = useState(false);
    const [value2, setValue2] = useState(50);
    const [range, setRange] = useState(null);

    useEffect(() => {
        setData(props.data.session.find(x => x.id === props.currentSession));
    }, [props.currentSession])

    useEffect(() => {
        if (!data || renew) {
            getUserSessionById(window.location.pathname.split('/')[6]).then(res => {
                const resData = res.data.data;
                setData(resData);
                setRenew(false);
            });
        }
    }, [renew])

    useEffect(() => {
        if (data)
            if (data.highest_bid) {
                setValue2(data.highest_bid + data.price_step);
                setRange([
                    data.highest_bid + data.price_step,
                    data.highest_bid + 5 * data.price_step,
                ]);
            } else {
                setValue2(data.start_price);
                setRange([
                    data.start_price + data.price_step,
                    data.start_price + 5 * data.price_step,
                ]);
            }
    }, [data]);

    const postBid = () => {
        createBidBySessionId({
            session_id: data.id,
            amount: value2,
        }).then(res => {
            const resData = res.data;
            if (resData.status) {
                toast.current.show({
                    severity: "success",
                    summary: "Success",
                    detail: resData.message,
                    life: 5000,
                });
                setRenew(true);
            } else {
                toast.current.show({
                    severity: "error",
                    summary: "Error",
                    detail: resData.message,
                    life: 5000,
                });
                setValue2(range[0])
            }
        })
    }

    return (
        <div>
            <Toast ref={toast} />
            {data &&
                <div>
                    <div className="space-between">
                        <span>
                            <div><span className="left-span"></span><span className="right-span" style={{ fontSize: '20px', fontWeight: '800', color: 'tomato' }}>{data.product.name}</span></div>
                            <div><span className="left-span"></span><span className="right-span">{data.product.description}</span></div>
                        </span>
                        <span>
                            <div><span className="left-span">Giá khởi điểm:</span><span className="right-span">{formatNumToString(data.start_price)}$</span></div>
                            <div><span className="left-span">Bước giá:</span><span className="right-span">{formatNumToString(data.price_step)}$</span></div>
                            <div><span className="left-span">Giá thầu cao nhất hiện tại:</span><span className="right-span">{data.highest_bid ? formatNumToString(data.highest_bid) + '$' : 'Chưa có dữ liệu'}</span></div>
                            <div><span className="left-span">Người chiến thắng hiện tại:</span><span className="right-span">{data.user ? data.user.full_name : 'Chưa có dữ liệu'}</span></div>
                        </span>
                    </div>
                    <div>
                        <div className="space-between">Ảnh:</div>
                        {
                            data.assets.length > 0 &&
                            <div className="assets-display">
                                {data.assets.map(item =>
                                    <Image src={item.file_name}
                                        key={item.id + '-asset'}
                                        alt={item.id + '-asset'}
                                        width="150" preview />
                                )}
                            </div>
                        }
                        {
                            data.assets.length <= 0 && <div>Không có ảnh sản phẩm</div>
                        }
                    </div>
                    <div>
                        <div className="space-center">
                            <h5>Trả giá: {formatNumToString(value2)}$</h5>
                        </div>
                        <div className="space-center">
                            <span>
                                <InputText value={value2} onChange={(e) => setValue2(e.target.value)} />
                            </span>
                            <span>
                                <Button label="Đấu giá" icon="pi pi-check" onClick={postBid} disabled={props.disabled} />
                            </span>
                        </div>
                    </div>
                </div>}
        </div>
    );
};

export default ShowProduct;
