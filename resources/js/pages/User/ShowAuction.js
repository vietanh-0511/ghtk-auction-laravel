import React, { useState, useEffect, useRef } from "react";
import { Card } from "primereact/card";
import { Button } from "primereact/button";
import { getAuction } from "../../apiClient";
import { DataScroller } from "primereact/datascroller";
import "primeicons/primeicons.css";
import "../../../css/DataScrollerDemo.css";
const footer = (
  <span>
    <Button
    style={{background:'#069255'}}
      label="Detail"
      icon="pi pi-pencil"
      className="p-button-rounded "
    />
  </span>
);

const ShowAuction = ({
  title = "Empty Page",
  subtitle = "This is empty page",
}) => {
  const [datas, setDatas] = useState([]);
  const ds = useRef(null);
  useEffect(() => {
    getAuction().then((res) => {
      setDatas(res.data.data);
    });
  }, []);
  console.log(datas);

  const itemTemplate = (datas) => {
    return (
      <div style={{ textAlign: "center", color: "#069255" }}>
        <div className="grid" style={{ textAlign: "-webkit-center" }}>
          <div className="col-3" key={datas.id}>
            <Card style={{ width: "25em", display: "flex" }} footer={footer}>
              <h4 style={{ color: "initial" }}>{datas.title}</h4>
              <p>Status : {datas.status}</p>
              <p>Start Time : {datas.start_time}</p>
              <p>End Time : {datas.end_time}</p>
            </Card>
          </div>
        </div>
      </div>
    );
  };

  const loader = (
    <Button
    style={{background:'#069255'}}
      type="text"
      icon="pi pi-plus"
      label="Load"
      onClick={() => ds.current.load()}
    />
  );

  return (
    <div className="datascroller-demo">
      <div className="card">
        <DataScroller
        style={{color:'#069255'}}
          ref={ds}
          value={datas}
          itemTemplate={itemTemplate}
          rows={4}
          loader
          footer={loader}
          header="Danh sách phiên đấu giá"
        />
      </div>
    </div>
  );
};

export default ShowAuction;
