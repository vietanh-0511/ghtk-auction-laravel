import React, { useState, useEffect, useRef } from 'react';
import classNames from 'classnames';
import { useNavigate, useOutlet } from 'react-router-dom';
import { CSSTransition } from 'react-transition-group';

import { AppTopbar } from './AppTopbar';
import { AppFooter } from './AppFooter';
import { AppMenu } from './AppMenu';

import PrimeReact from 'primereact/api';

import '../assets/layout/layout.scss';
import { useAuth } from "../hooks/useAuth";

const AdminLayout = () => {
  const [staticMenuInactive, setStaticMenuInactive] = useState(false);
  const [overlayMenuActive, setOverlayMenuActive] = useState(false);
  const [mobileMenuActive, setMobileMenuActive] = useState(false);
  const [mobileTopbarMenuActive, setMobileTopbarMenuActive] = useState(false);
  const outlet = useOutlet();
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  useEffect(() => {
    if (!user || user.role === 'user') navigate('/login', { replace: true });
  }, [user])

  PrimeReact.ripple = true;

  let menuClick = false;
  let mobileTopbarMenuClick = false;
  const layoutMode = 'static';
  const layoutColorMode = 'light';
  const inputStyle = 'outlined';
  const ripple = true;

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

  const onSidebarClick = () => {
    menuClick = true;
  }

  const onMobileTopbarMenuClick = (event) => {
    mobileTopbarMenuClick = true;

    setMobileTopbarMenuActive((prevState) => !prevState);
    event.preventDefault();
  }

  const onMobileSubTopbarMenuClick = (event) => {
    mobileTopbarMenuClick = true;

    event.preventDefault();
  }

  const onMenuItemClick = (event) => {
    if (!event.item.items) {
      setOverlayMenuActive(false);
      setMobileMenuActive(false);
    }
  }
  const isDesktop = () => {
    return window.innerWidth >= 992;
  }

  const menu = [
    {
      label: 'Home',
      items: [
        { label: 'Dashboard', icon: 'pi pi-fw pi-desktop', to: '/admin/dashboard' },
        { label: 'Quản lý người dùng', icon: 'pi pi-fw pi-user', to: '/admin/users' },
        { label: 'Cài đặt hệ thống', icon: 'pi pi-fw pi-cog', to: '/admin/settings' },
      ]
    },
    {
      label: 'Auctions', icon: 'pi pi-fw pi-sitemap',
      items: [
        { label: 'Quản lý Sản phẩm', icon: 'pi pi-fw pi-box', to: '/admin/products' },
        { label: 'Quản lý Auctions', icon: 'pi pi-fw pi-shopping-cart', to: '/admin/auctions' },
      ]
    },
  ];

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

  const wrapperClass = classNames('layout-wrapper', {
    'layout-overlay': layoutMode === 'overlay',
    'layout-static': layoutMode === 'static',
    'layout-static-sidebar-inactive': staticMenuInactive && layoutMode === 'static',
    'layout-overlay-sidebar-active': overlayMenuActive && layoutMode === 'overlay',
    'layout-mobile-sidebar-active': mobileMenuActive,
    'p-input-filled': inputStyle === 'filled',
    'p-ripple-disabled': ripple === false,
    'layout-theme-light': layoutColorMode === 'light'
  });

  const appMenu = [
    {
      label: "Ngưởi dùng",
      iconClass: "pi pi-cog",
      routePath: "#"
    },
  ];

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
        logout();
      }
    }
  ];

  return (
    <div className={wrapperClass} onClick={onWrapperClick}>
      <AppTopbar onToggleMenuClick={onToggleMenuClick}
        layoutColorMode={layoutColorMode}
        mobileTopbarMenuActive={mobileTopbarMenuActive}
        onMobileTopbarMenuClick={onMobileTopbarMenuClick}
        appMenu={appMenu}
        items={items}
      />

      <div className="layout-sidebar" onClick={onSidebarClick}>
        <AppMenu model={menu} onMenuItemClick={onMenuItemClick} layoutColorMode={layoutColorMode} />
      </div>

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

export default AdminLayout;
