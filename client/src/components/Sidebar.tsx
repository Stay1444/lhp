import React, { useContext } from 'react';
import style from './Sidebar.module.sass'

import { PropsWithChildren } from 'react'
import { useLocation, useNavigate } from 'react-router';
import { LanguageContext } from '../context/LanguageContext';
import { IdentityContext } from '../context/IdentityContext';

type RouteProps = PropsWithChildren<{
    name: string;
    path: string;
}>;

const Route: React.FC<RouteProps> = ({ name, path }) =>  {
    const location = useLocation();
    const navigate = useNavigate();

    const active = location.pathname.toLowerCase() == path.toLowerCase();
    return (
        <div className={`${style.routeParent} ${active ? style.active : ''}`}
            onClick={() => {
                if (active) return;
                navigate(path)
            }}>
            <label>{name}</label>
        </div>
    )
}

type CategoryProps = PropsWithChildren<{
    name: string;
}>;
  
const Category: React.FC<CategoryProps> = ({ name, children }) => {
    return (
        <div className={style.categoryParent}>
            <label>{name}</label>
            <div>
                {children}    
            </div>        
        </div>
    )
}

const Sidebar = () => {
    const langCtx = useContext(LanguageContext);
    const identity = useContext(IdentityContext);

    return (
        <div className={style.root}>
            <Category name={langCtx.getString("sidebar.panel.title")}>
                <Route name={langCtx.getString("sidebar.panel.home")} path="/"/>
                <Route name={langCtx.getString("sidebar.panel.machines")} path="/machines"/>
                <Route name={langCtx.getString("sidebar.panel.domains")} path="/domains"/>
            </Category>
            { identity.currentUser?.admin && 
                <Category name={langCtx.getString("sidebar.admin.title")}>
                    <Route name={langCtx.getString("sidebar.admin.users")} path="/admin/users"/>
                    <Route name={langCtx.getString("sidebar.admin.machines")} path="/admin/machines"/>
                    <Route name={langCtx.getString("sidebar.admin.domains")} path="/admin/domains"/>
                    <Route name={langCtx.getString("sidebar.admin.limits")} path="/admin/limits"/>
                    <Route name={langCtx.getString("sidebar.admin.settings")} path="/admin/settings"/>
                </Category>
            }
            
        </div>
    )
}

export default Sidebar;