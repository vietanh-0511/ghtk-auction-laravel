import React from 'react';
import {Link, Navigate} from 'react-router-dom';
import classNames from 'classnames';
import {useAuth} from "../hooks/useAuth";
import {Button} from "primereact/button";

export const AppTopbar = (props) => {

  const {user} = useAuth();

  const handleClick = (menuItem, event) => {
    event.preventDefault();
    return <Navigate to={menuItem.routePath}/>;
  }

  const renderLi = () => {
    return props.appMenu.map((ele, idx) => {
      return (
        <li key={idx}>
          <Link to={ele.routePath}>
            <Button className="p-button-link" icon={ele.iconClass} label={ele.label}/>
          </Link>
        </li>
      );
    })
  }

  const renderAppMenuToggleButton = () => {
    if (user && user.role === 'admin') {
      return (
        <button type="button" className="p-link  layout-menu-button layout-topbar-button"
                onClick={props.onToggleMenuClick}>
          <i className="pi pi-bars"/>
        </button>
      )
    }
  }

  return (
    <div className="layout-topbar">
      <Link to="/" className="layout-topbar-logo">
        <span>GHTK - Đấu giá</span>
      </Link>

      {renderAppMenuToggleButton()}

      <button type="button" className="p-link layout-topbar-menu-button layout-topbar-button"
              onClick={props.onMobileTopbarMenuClick}>
        <i className="pi pi-ellipsis-v"/>
      </button>

      <ul
        className={classNames("layout-topbar-menu lg:flex origin-top", {'layout-topbar-menu-mobile-active': props.mobileTopbarMenuActive})}>
        {renderLi()}
      </ul>
    </div>
  );
}
