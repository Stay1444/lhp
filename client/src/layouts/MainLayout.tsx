import style from "./MainLayout.module.sass"

import { Outlet, useNavigate } from "react-router";
import Sidebar from "../components/Sidebar";
import LanguageSwitcher from "../components/LanguageSwitcher";
import { useContext, useEffect } from "react";
import { IdentityContext } from "../context/IdentityContext";

const MainLayout = () =>  {
    const identity = useContext(IdentityContext)
    const navigate = useNavigate();

    useEffect(() => {
        if (identity.currentUser == undefined) {
            navigate("/login")
        }
    }, [identity.currentUser, navigate])
    console.log("render")

    return (
        <div className={style.parent}>
            <div className={style.sidebarContainer}>
                <div className={style.sidebar}>
                    <Sidebar/>
                </div>
                <div className={style.languageSwitcher}>
                    <LanguageSwitcher/>
                </div>
            </div>
            <div className={style.contentContainer}>
                <Outlet/>
            </div>
        </div>
    )
}

export default MainLayout;