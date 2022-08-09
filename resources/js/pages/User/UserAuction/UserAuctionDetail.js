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
import "../../../../css/DataTableComponent.css";
import { getUserAuction, getUserAuctionById } from "../../../apiClient";

function sqlToJsDate(sqlDate) {
    return new Date(Date.parse(sqlDate.replace(/-/g, "/")));
}

function secondsToTime(secs) {
    let hours = Math.floor(secs / (60 * 60));

    let divisor_for_minutes = secs % (60 * 60);
    let minutes = Math.floor(divisor_for_minutes / 60);

    let divisor_for_seconds = divisor_for_minutes % 60;
    let seconds = Math.ceil(divisor_for_seconds);

    return {
        "h": hours,
        "m": minutes,
        "s": seconds
    };
}

const UserAuctionDetail = ({ title = "Empty Page" }) => {
    const [data, setData] = useState([]);
    const [value1, setValue1] = useState(0);
    const interval = useRef(null);
    const navigate = useNavigate();

    useEffect(() => {
        getUserAuctionById(parseInt(window.location.pathname.split('/')[4])).then((res) => {
            const resData = res.data.data;
            setData(resData);
            setValue1(sqlToJsDate(resData.end_time).getTime() - new Date().getTime()) // fix me
            console.log(resData)
        });
    }, []);

    useEffect(() => {
        let val = parseInt(value1);
        interval.current = setInterval(() => {
            val = val - 1;

            // if (val <= 0) {
            //     val = 0;
            //     clearInterval(interval.current);
            // }

            setValue1(val);
        }, 1000);

        return () => {
            if (interval.current) {
                clearInterval(interval.current);
                interval.current = null;
            }
        }
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
                                <p>Time left: {value1}</p>
                            </div>
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default UserAuctionDetail;
