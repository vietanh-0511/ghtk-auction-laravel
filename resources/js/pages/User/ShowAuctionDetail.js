import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useOutlet } from "react-router-dom";
import { Card } from "primereact/card";
import { DataScroller } from "primereact/datascroller";
import { Image } from "primereact/image";
import { Button } from "primereact/button";
import { getUserAuctionById } from "../../apiClient";

export const AuctionDetailContext = React.createContext({});

function sqlToJsDate(sqlDate) {
  return new Date(Date.parse(sqlDate.replace(/-/g, "/")));
}

function convertMsToTime(ms) {
  var seconds = Math.floor((ms / 1000) % 60),
    minutes = Math.floor((ms / (1000 * 60)) % 60),
    hours = Math.floor(ms / (1000 * 60 * 60));

  hours = hours < 10 ? "0" + hours : hours;
  minutes = minutes < 10 ? "0" + minutes : minutes;
  seconds = seconds < 10 ? "0" + seconds : seconds;

  return hours + ":" + minutes + ":" + seconds;
}

const ShowAuctionDetail = ({ title = "Empty Page" }) => {
  const [data, setData] = useState(null);
  const [value2, setValue2] = useState(null);
  const [timeLeftBoolean, setTimeLeftBoolean] = useState(null);
  const interval = useRef(null);
  const navigate = useNavigate();
  const outlet = useOutlet();
  const [currentSession, setCurrentSession] = useState(null);

  const itemTemplate = (item) => {
    return (
      <div className="product-item">
        <Image
          src={
            item.assets && item.assets.length > 0
              ? item.assets[0].file_name
              : "https://cataas.com/cat"
          }
          alt={item.product.name + "-img"}
          imageStyle={{ objectFit: "cover" }}
        />
        <div className="product-detail">
          <div className="product-name" style={{ color: "tomato" }}>
            {item.product.name}
          </div>
          <div className="product-description">{item.product.description}</div>
        </div>
        <div className="product-action">
          <Button
            icon="pi pi-shopping-cart"
            label="Chi tiết"
            className="p-button-link"
            onClick={() => {
              setCurrentSession(item.id);
              navigate(`session/${item.id}`);
            }}
          />
        </div>
      </div>
    );
  };

  // countdown
  useEffect(() => {
    getUserAuctionById(parseInt(window.location.pathname.split("/")[4])).then(
      (res) => {
        const resData = res.data.data;
        setData(resData);

        var start = sqlToJsDate(resData.auction.start_time).getTime();
        var end = sqlToJsDate(resData.auction.end_time).getTime();
        var now = new Date().getTime();
        var val = 0;
        if (start < now) {
          val = end - now;
          setTimeLeftBoolean(true);
        } // start time passed
        else {
          val = start - now;
          setTimeLeftBoolean(false);
        } // start time hasnt passed
        interval.current = setInterval(() => {
          val = val - 1000;
          if (
            val <= 0 &&
            start <= new Date().getTime() &&
            new Date().getTime() < end
          ) {
            val = end - new Date().getTime();
            setTimeLeftBoolean(true);
          }
          if (val <= 0 && end <= new Date().getTime()) {
            val = 0;
            setTimeLeftBoolean(null);
            clearInterval(interval.current);
          }
          setValue2(convertMsToTime(val));
        }, 1000);
      }
    );
    return () => {
      if (interval.current) {
        clearInterval(interval.current);
        interval.current = null;
      }
    };
  }, []);

  return (
    <AuctionDetailContext.Provider
      value={{
        data: data,
        currentSession: currentSession,
        disabled: !timeLeftBoolean,
      }}
    >
      <div>
        <div className="datascroller-demo">
          {data && (
            <Card title={data.auction.title} className="card-cover">
              <div style={{ display: "flex", justifyContent: "space-evenly" }}>
                <p>Thời gian bắt đầu: {data.auction.start_time}</p>
                <p>Thời gian kết thúc: {data.auction.end_time}</p>
                {timeLeftBoolean === null ? (
                  <p>Phiên đấu giá đã kết thúc</p>
                ) : (
                  <p>
                    Thời gian {timeLeftBoolean ? "còn lại" : "mở đấu giá"}:{" "}
                    {value2}
                  </p>
                )}
                <p>
                  Trạng thái:{" "}
                  <span
                    className="status"
                    style={{
                      color:
                        data.auction.status === "Preview"
                          ? "gold"
                          : data.auction.status === "Publish"
                          ? "green"
                          : "red",
                      fontSize: "15px",
                      fontWeight: "600",
                    }}
                  >
                    {data.auction.status}
                  </span>
                </p>
              </div>
            </Card>
          )}
          <br />
          {data && (
            <div style={{ display: "flex" }}>
              <div className="card" id="custom-p-datascroller">
                <DataScroller
                  value={data.session}
                  itemTemplate={itemTemplate}
                  rows={data.session.length}
                  inline
                  scrollHeight="700px"
                />
              </div>
              <div className="card" style={{ flex: 1, marginLeft: "1rem" }}>
                {outlet}
              </div>
            </div>
          )}
        </div>
      </div>
    </AuctionDetailContext.Provider>
  );
};

export default ShowAuctionDetail;
