import React from 'react';
import style from './Sidebar.module.sass'

import { PropsWithChildren } from 'react'
import { useLocation, useNavigate } from 'react-router';

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
    path: string;
}>;
  
const Category: React.FC<CategoryProps> = ({ name, path, children }) => {
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
    return (
        <div className={style.root}>
            <Category name='Panel' path='/'>
                <Route name="Inicio" path="/"/>
                <Route name="Maquinas" path="/machines"/>
                <Route name="Dominios" path="/domains"/>
            </Category>
            <Category name='Admin' path='/admin'>
                <Route name="Usuarios" path="/admin/users"/>
                <Route name="Maquinas" path="/admin/machines"/>
                <Route name="Dominios" path="/admin/domains"/>
            </Category>
        </div>
    )
}

export default Sidebar;