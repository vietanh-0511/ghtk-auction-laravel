import React, { useState, useEffect, useRef } from 'react';
import classNames from 'classnames';
import { Navigate, useOutlet } from 'react-router-dom';
import { CSSTransition } from 'react-transition-group';

import { AppTopbar } from './AppTopbar';
import { AppFooter } from './AppFooter';

import PrimeReact from 'primereact/api';

import '../assets/layout/layout.scss';
import { useAuth } from "../hooks/useAuth";

const Layout = () => {
  const [overlayMenuActive, setOverlayMenuActive] = useState(false);
  const [mobileMenuActive, setMobileMenuActive] = useState(false);
  const [mobileTopbarMenuActive, setMobileTopbarMenuActive] = useState(false);
  const outlet = useOutlet();
  const { user } = useAuth();

  const appMenu = [
    {
      label: "Người dùng",
      iconClass: "pi pi-cog",
      routePath: "#"
    }
  ];

  if (!user) {
    return <Navigate to="/login" />;
  } else {
    if (user.role === 'admin') {
      return <Navigate to="/login" />;
    }
  }

  const items = [
    {
      label: 'Info',
      icon: 'pi pi-info-circle',
      command: () => {
        window.location.hash = "#"
      }
    },
    {
      label: 'Log out',
      icon: 'pi pi-sign-out',
      command: () => {

      }
    }
  ];

  PrimeReact.ripple = true;

  let menuClick = false;
  let mobileTopbarMenuClick = false;
  const layoutMode = 'static';
  const layoutColorMode = 'light';

  useEffect(() => {
    if (mobileMenuActive) {
      addClass(document.body, "body-overflow-hidden");
    } else {
      removeClass(document.body, "body-overflow-hidden");
    }
  }, [mobileMenuActive]);

  const onWrapperClick = (event) => {
    if (!menuClick) {
      setOverlayMenuActive(false);
      setMobileMenuActive(false);
    }

    if (!mobileTopbarMenuClick) {
      setMobileTopbarMenuActive(false);
    }

    mobileTopbarMenuClick = false;
    menuClick = false;
  }

  const onToggleMenuClick = (event) => {
    menuClick = true;

    if (isDesktop()) {
      if (layoutMode === 'overlay') {
        if (mobileMenuActive === true) {
          setOverlayMenuActive(true);
        }

        setOverlayMenuActive((prevState) => !prevState);
        setMobileMenuActive(false);
      } else if (layoutMode === 'static') {
        setStaticMenuInactive((prevState) => !prevState);
      }
    } else {
      setMobileMenuActive((prevState) => !prevState);
    }

    event.preventDefault();
  }

  const onMobileTopbarMenuClick = (event) => {
    mobileTopbarMenuClick = true;

    setMobileTopbarMenuActive((prevState) => !prevState);
    event.preventDefault();
  }

  const isDesktop = () => {
    return window.innerWidth >= 992;
  }

  const addClass = (element, className) => {
    if (element.classList)
      element.classList.add(className);
    else
      element.className += ' ' + className;
  }

  const removeClass = (element, className) => {
    if (element.classList)
      element.classList.remove(className);
    else
      element.className = element.className.replace(new RegExp('(^|\\b)' + className.split(' ').join('|') + '(\\b|$)', 'gi'), ' ');
  }

  return (
    <div className="layout-wrapper layout-static layout-static-sidebar-inactive layout-theme-light"
      onClick={onWrapperClick}>

      <AppTopbar onToggleMenuClick={onToggleMenuClick}
        layoutColorMode={layoutColorMode}
        mobileTopbarMenuActive={mobileTopbarMenuActive}
        onMobileTopbarMenuClick={onMobileTopbarMenuClick}
        appMenu={appMenu}
        items={items}
      />

      <div className="layout-main-container">
        <div className="layout-main">
          {outlet}
        </div>
        <AppFooter layoutColorMode={layoutColorMode} />
      </div>

      <CSSTransition classNames="layout-mask" timeout={{ enter: 200, exit: 200 }} in={mobileMenuActive} unmountOnExit>
        <div className="layout-mask p-component-overlay"></div>
      </CSSTransition>
    </div>
  );

}

export default Layout;
