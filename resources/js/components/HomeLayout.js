import React, { useState, useEffect, useRef } from 'react';
import { useOutlet, useNavigate } from 'react-router-dom';
import { CSSTransition } from 'react-transition-group';

import { AppTopbar } from './AppTopbar';
import { AppFooter } from './AppFooter';

import PrimeReact from 'primereact/api';

import '../assets/layout/layout.scss';
import { useAuth } from "../hooks/useAuth";

const HomeLayout = () => {
  const [overlayMenuActive, setOverlayMenuActive] = useState(false);
  const [mobileMenuActive, setMobileMenuActive] = useState(false);
  const [mobileTopbarMenuActive, setMobileTopbarMenuActive] = useState(false);
  const outlet = useOutlet();
  const navigate = useNavigate();

  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      user.role === 'admin' ?
        navigate('/admin/dashboard', { replace: true })
        : user.role === 'user' ?
          navigate('/user/auction', { replace: true })
          : null
    }
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
      label: "Home",
      items: [
        {
          label: "Trang chủ",
          icon: "pi pi-fw pi-desktop",
          to: "/admin/dashboard",
        },
        {
          label: "Quản lý người dùng",
          icon: "pi pi-fw pi-user",
          to: "/admin/users",
        },
        {
          label: "Cài đặt hệ thống",
          icon: "pi pi-fw pi-cog",
          to: "/admin/settings",
        },
      ],
    },
    {
      label: "Auctions",
      icon: "pi pi-fw pi-sitemap",
      items: [
        {
          label: "Quản lý Sản phẩm",
          icon: "pi pi-fw pi-box",
          to: "/admin/products",
        },
        {
          label: "Quản lý Đấu giá",
          icon: "pi pi-fw pi-shopping-cart",
          to: "/admin/auctions",
        },
        {
          label: "Quản lý Các phiên",
          icon: "pi pi-fw pi-star",
          to: "/admin/sessions",
        },
      ],
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

  const appMenu = [
    {
      label: "Đăng nhập",
      iconClass: "pi pi-user",
      routePath: "/login"
    },
    {
      label: "Đăng Ký",
      iconClass: "pi pi-pencil",
      routePath: "/register"
    }
  ];

  return (
    <div className="layout-wrapper layout-static layout-static-sidebar-inactive layout-theme-light" onClick={onWrapperClick}>
      <AppTopbar onToggleMenuClick={onToggleMenuClick}
        layoutColorMode={layoutColorMode}
        mobileTopbarMenuActive={mobileTopbarMenuActive}
        onMobileTopbarMenuClick={onMobileTopbarMenuClick}
        onMobileSubTopbarMenuClick={onMobileSubTopbarMenuClick}
        appMenu={appMenu}
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

export default HomeLayout;
