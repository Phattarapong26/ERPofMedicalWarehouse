import { useEffect, useState } from "react";
import { Logo } from "../../../components/Logo";
import { MenuFoldOutlined, MenuUnfoldOutlined } from "@ant-design/icons";
import { Layout, Button, theme, Dropdown, Space } from "antd";
import { MenuList } from "../../../components/MenuList";
import { Outlet } from "react-router";
import { Notification } from "../../../components/Notification";
// import Cookies from 'js-cookie'
const { Header, Sider, Content } = Layout;

const items = [
  {
    label: (
      <div
        className="btn w-100 text-red fw-bold fs-5 p-0"
        onClick={() => {
          fetch("http://localhost:3000/logout", {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Accept: "application/json",
            },
            credentials: "include",
          }).then((window.location = "/"));
        }}
      >
        ยืนยันออกจากระบบ
      </div>
    ),
  },
];

export function UserLayout() {
  const [collapsed, setCollapsed] = useState(false);
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();
  const [userName, setUserName] = useState("");
  const [withdraw, setWithdraw] = useState(false);
  const [addNew, setAddNew] = useState(false);
  useEffect(() => {
    fetch("http://localhost:3000/authen", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      credentials: "include",
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.status == "error") {
          window.location = "/";
        } else {
          setUserName(() => data[0].name + " " + data[0].surname);
          setWithdraw(() => data[0].withdraw);
          setAddNew(() => data[0].add_new);
        }
      });
  }, []);

  return (
    <Layout style={{ height: "100dvh", position: "relative" }}>
      <Sider trigger={null} collapsible collapsed={collapsed}>
        <Logo />
        <MenuList />
        <div
          className="btn-group dropup col-12 m-0 p-0 "
          style={{ position: "absolute", bottom: "0px" }}
        >
          <Dropdown
            menu={{ items }}
            trigger={["click"]}
            className="btn btn-secondary rounded-0"
          >
            <a onClick={(e) => e.preventDefault()}>
              <Space className="text-black fw-bold">
                <i className="bi bi-box-arrow-left fs-4"></i>
                <span className={collapsed ? "d-none" : "d-block"}>
                  {userName}
                </span>
              </Space>
            </a>
          </Dropdown>
        </div>
      </Sider>
      <Layout>
        <Header
          className="d-flex flex-row justify-content-between align-items-center"
          style={{
            padding: 0,
            background: colorBgContainer,
          }}
        >
          <Button
            type="text"
            icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
            onClick={() => setCollapsed(!collapsed)}
            style={{
              fontSize: "16px",
              width: 64,
              height: 64,
            }}
          />
          <Notification />
        </Header>
        <Content
          style={{
            margin: "20px 15px",
            minHeight: 280,
            background: colorBgContainer,
            borderRadius: borderRadiusLG,
          }}
        >
          <Outlet
            context={{
              userName,
              setUserName,
              withdraw,
              setWithdraw,
              addNew,
              setAddNew,
            }}
          />
        </Content>
      </Layout>
    </Layout>
  );
}
