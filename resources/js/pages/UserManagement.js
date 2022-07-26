import React, { useState } from "react";
import { Space, Table, Tag, Button } from "antd";
const { Column } = Table;

const UserManagement = ({
  title = "Empty Page",
  subtitle = "This is empty page",
}) => {
  const object = [
    {
      id: 1,
      fullname: "Quang",
      email: "User1@gmail.com",
      password: "User@123",
      address: "oke oke",
      phone: "0333568287",
    }
  ];
  return (
    <div className="grid">
      <div className="col-12">
        <div className="card">
          <h5>{title}</h5>
          <Table dataSource={object}>
            <Column title="STT" dataIndex="id" />
            <Column title="Full Name" dataIndex="fullname" />
            <Column title="Email" dataIndex="email" />
            <Column title="Password" dataIndex="password" />
            <Column title="Address" dataIndex="address" />
            <Column title="Phone" dataIndex="phone" />
            <Column
              title="Action"
              key="action"
              render={(_, record) => (
                <Space size="large">
                  <Button
                    type="primary"
                    style={{ background: "orange", borderColor: "orange" }}
                  >
                    Edit
                  </Button>
                  <Button type="primary" danger>
                    Delete
                  </Button>
                </Space>
              )}
            />
          </Table>
        </div>
      </div>
    </div>
  );
};

export default UserManagement;
