import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from 'react-router-dom';
import { Card } from 'primereact/card';
import { ProgressBar } from 'primereact/progressbar';

import { classNames } from "primereact/utils";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Toast } from "primereact/toast";
import { Button } from "primereact/button";
import { Toolbar } from "primereact/toolbar";
import { Dialog } from "primereact/dialog";
import { InputText } from "primereact/inputtext";
import "../../../css/DataScrollerDemo.css";
import "../../../css/DataTableComponent.css";
import { getUserAuction, getUserAuctionById } from "../../apiClient"

function sqlToJsDate(sqlDate) {
    return new Date(Date.parse(sqlDate.replace(/-/g, "/")));
}

function convertMsToTime(ms) {
    var seconds = Math.floor((ms / 1000) % 60),
        minutes = Math.floor((ms / (1000 * 60)) % 60),
        hours = Math.floor(ms / (1000 * 60 * 60));

    hours = (hours < 10) ? "0" + hours : hours;
    minutes = (minutes < 10) ? "0" + minutes : minutes;
    seconds = (seconds < 10) ? "0" + seconds : seconds;

    return hours + ":" + minutes + ":" + seconds;
}

const ShowAuctionDetail = ({ title = "Empty Page" }) => {
    const [data, setData] = useState([]);
    const [value2, setValue2] = useState(null);
    const interval = useRef(null);
    const navigate = useNavigate();

    useEffect(() => {
        getUserAuctionById(parseInt(window.location.pathname.split('/')[4])).then((res) => {
            const resData = res.data.data;
            setData(resData);

            let val = sqlToJsDate(resData.end_time).getTime() - new Date().getTime();
            interval.current = setInterval(() => {
                val = val - 1000;
                if (val <= 0) {
                    val = 0;
                    clearInterval(interval.current);
                }
                setValue2(convertMsToTime(val));
            }, 1000);

            return () => {
                if (interval.current) {
                    clearInterval(interval.current);
                    interval.current = null;
                }
            }
        });
    }, []);

    return (
        <div className="grid">
            <div className="col-12">
                <div className="datatable-crud-demo">
                    <div className="card">
                        <Card title={data.title}>
                            <div style={{ display: 'flex', justifyContent: 'space-evenly' }}>
                                <p>Start time: {data.start_time}</p>
                                <p>End time: {data.end_time}</p>
                                <p>Time left: {value2}</p>
                            </div>
                        </Card>
                        
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ShowAuctionDetail;
