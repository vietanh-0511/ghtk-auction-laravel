import React, { useState, useEffect, useRef } from "react";
import { Card } from "primereact/card";
import { Button } from "primereact/button";
import { getUserAuction } from "../../apiClient";
import { DataScroller } from "primereact/datascroller";
import "primeicons/primeicons.css";
import "../../../css/DataScrollerDemo.css";
import "../../../css/DataTableComponent.css";
import { useNavigate } from "react-router-dom";

const ShowAuction = ({
  title = "Empty Page",
  subtitle = "This is empty page",
}) => {
  const [datas, setDatas] = useState([]);
  const ds = useRef(null);
  const navigate = useNavigate();
  useEffect(() => {
    getUserAuction().then((res) => {
      setDatas(res.data.data);
    });
  }, []);

  const footer = (id) =>
    <span>
      <Button
        label="Chi tiết"
        icon="pi pi-pencil"
        className="p-button-rounded p-button-secondary"
        onClick={() => {
          navigate(`${id}`);
        }}
      />
    </span>

  const itemTemplate = (datas) => {
    return (
      <div style={{ textAlign: "center", color: "#3B82F6" }}>
        <div className="grid" style={{ textAlign: "-webkit-center" }}>
          <div className="col-3" key={datas.id}>
            <Card style={{ width: "25em", display: "flex" }} footer={() => footer(datas.id)}>
              <h4 style={{ color: "#3B82F6", fontWeight:"700" }}>{datas.title}</h4>
              <p>
                Trạng thái:{" "}
                <span
                  className="status"
                  style={{
                    color:
                      datas.status === "Preview"
                        ? "chocolate"
                        : datas.status === "Publish"
                        ? "#3B82F6"
                        : "red",
                    fontSize: "15px",
                    fontWeight: "600",
                  }}
                >
                  {datas.status}
                </span>
              </p>
              <p>Thời gian bắt đầu : {datas.start_time}</p>
              <p>Thời gian kết thúc : {datas.end_time}</p>
            </Card>
          </div>
        </div>
      </div>
    );
  };

  const loader = (
    <Button
      type="text"
      icon="pi pi-plus"
      label="Tải thêm"
      onClick={() => ds.current.load()}
    />
  );

  return (
    <div className="datascroller-demo">
      <div className="card">
        <DataScroller
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
