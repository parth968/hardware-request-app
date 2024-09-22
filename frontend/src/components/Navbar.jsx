import React, { useState, useRef } from 'react';
import { Menubar } from 'primereact/menubar';
import { Avatar } from 'primereact/avatar';
import { Button } from 'primereact/button';
import { OverlayPanel } from 'primereact/overlaypanel';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../slice/authSlice';


function Navbar() {
    const overlayPanelRef = useRef(null);
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const user = useSelector((state) => state.auth.user);
    

    const baseItems = [
        {
            label: 'Dashboard',
            icon: 'pi pi-home',
            url: '/dashboard'
        },
        {
            label: 'My requests',
            icon: 'pi pi-calendar',
            url: '/my-requests'
        }
    ];

    const adminItems = [
        {
            label: 'Dashboard',
            icon: 'pi pi-list',
            url: '/adminDashboard',
        },
        {
            label: 'Manage requests',
            icon: 'pi pi-cog',
            url: '/manage-requests'
        }
    ];

    const items = user?.role === 'admin'
        ? adminItems
        : baseItems;

    const start = <img alt="logo" src="https://primefaces.org/cdn/primereact/images/logo.png" width="35" height="35" className="mr-2" />;

    const end = (
        <div className="flex align-items-center gap-2">
            <div className="flex flex-col items-start p-mr-3">
                {user ? (
                    <>
                        <span className="font-bold text-sm">{user.email}</span>
                        <span className="text-sm text-gray-600">{user.role}</span>
                    </>
                ) : (
                    <span className="text-gray-600">Loading...</span>
                )}
            </div>
            <Avatar
                image="https://primefaces.org/cdn/primereact/images/avatar/amyelsner.png"
                className='mt-2'
                shape="circle"
                onClick={(event) => overlayPanelRef.current.toggle(event)}
            />
        </div>
    );

    const handleLogout = () => {
        dispatch(logout());
        navigate('/');
    };

    return (
        <div className="card">
            <Menubar model={items} start={start} end={end} />
            <OverlayPanel ref={overlayPanelRef} className="p-overlaypanel">
                <div className="p-d-flex p-ai-center p-p-2">
                    <i className="pi pi-sign-out p-mr-2" />
                    <Button label="Logout" className="p-button-text" onClick={handleLogout} />
                </div>
            </OverlayPanel>
        </div>
    );
}

export default Navbar;
