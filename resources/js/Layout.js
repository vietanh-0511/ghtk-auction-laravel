import React, {useState, useEffect, useRef} from 'react';
import classNames from 'classnames';
import {Route, Routes, useLocation} from 'react-router-dom';
import {CSSTransition} from 'react-transition-group';

import {AppTopbar} from './AppTopbar';
import {AppFooter} from './AppFooter';
import {AppMenu} from './AppMenu';

import EmptyPage from './pages/EmptyPage';

import PrimeReact from 'primereact/api';

import "primereact/resources/themes/tailwind-light/theme.css";
import 'primereact/resources/primereact.css';
import 'primeicons/primeicons.css';
import 'primeflex/primeflex.css';
import './assets/layout/layout.scss';

const Layout = () => {
  const [staticMenuInactive, setStaticMenuInactive] = useState(false);
  const [overlayMenuActive, setOverlayMenuActive] = useState(false);
  const [mobileMenuActive, setMobileMenuActive] = useState(false);
  const [mobileTopbarMenuActive, setMobileTopbarMenuActive] = useState(false);

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
        {label: 'Dashboard', icon: 'pi pi-fw pi-desktop', to: '/admin'},
        {label: 'Quản lý người dùng', icon: 'pi pi-fw pi-user', to: '/admin/users'},
        {label: 'Cài đặt hệ thống', icon: 'pi pi-fw pi-cog', to: '/admin/settings'},
      ]
    },
    {
      label: 'Auctions', icon: 'pi pi-fw pi-sitemap',
      items: [
        {label: 'Quản lý Sản phẩm', icon: 'pi pi-fw pi-box', to: '/admin/products'},
        {label: 'Quản lý Auctions', icon: 'pi pi-fw pi-shopping-cart', to: '/admin/auctions'},
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

  return (
    <div className={wrapperClass} onClick={onWrapperClick}>
      <AppTopbar onToggleMenuClick={onToggleMenuClick}
                 layoutColorMode={layoutColorMode}
                 mobileTopbarMenuActive={mobileTopbarMenuActive}
                 onMobileTopbarMenuClick={onMobileTopbarMenuClick}
                 onMobileSubTopbarMenuClick={onMobileSubTopbarMenuClick}/>

      <div className="layout-sidebar" onClick={onSidebarClick}>
        <AppMenu model={menu} onMenuItemClick={onMenuItemClick} layoutColorMode={layoutColorMode}/>
      </div>

      <div className="layout-main-container">
        <div className="layout-main">
          <Routes>
            <Route path="/admin" element={<EmptyPage/>}></Route>
            <Route path="/admin/users" element={<EmptyPage/>}></Route>
            <Route path="/admin/settings" element={<EmptyPage/>}></Route>
            <Route path="/admin/products" element={<EmptyPage/>}></Route>
            <Route path="/admin/auctions" element={<EmptyPage/>}></Route>
            <Route path="/admin/settings" element={<EmptyPage/>}></Route>
          </Routes>
        </div>

        <AppFooter layoutColorMode={layoutColorMode}/>
      </div>

      <CSSTransition classNames="layout-mask" timeout={{enter: 200, exit: 200}} in={mobileMenuActive} unmountOnExit>
        <div className="layout-mask p-component-overlay"></div>
      </CSSTransition>
    </div>
  );

}

export default Layout;
