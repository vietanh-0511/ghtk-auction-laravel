import React from 'react';
import { Link } from 'react-router-dom';
import classNames from 'classnames';
import { useAuth } from "../hooks/useAuth";
import { Button } from "primereact/button";
import { Menu } from 'primereact/menu';
import { Toast } from 'primereact/toast';

export const AppTopbar = (props) => {

  const { user } = useAuth();
  const menu = React.useRef(null);

  const renderLi = () => {
    return props.appMenu.map((ele, idx) => {
      return (
        props.items ?
          <li key={idx}>
            <Menu model={props.items} popup ref={menu} id="popup_menu" />
            <Button label={ele.label} icon={ele.iconClass}
              onClick={(event) => { return menu.current.toggle(event); }}
              aria-controls="popup_menu" aria-haspopup />
          </li>
          :
          <li key={idx}>
            <Link to={ele.routePath}>
              <Button className="p-button-link" icon={ele.iconClass} label={ele.label} />
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
          <i className="pi pi-bars" />
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
        <i className="pi pi-ellipsis-v" />
      </button>

      <ul
        className={classNames("layout-topbar-menu lg:flex origin-top", { 'layout-topbar-menu-mobile-active': props.mobileTopbarMenuActive })}>
        {renderLi()}
      </ul>
    </div>
  );
}
