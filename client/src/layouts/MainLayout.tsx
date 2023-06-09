import style from "./MainLayout.module.sass"

import { Outlet } from "react-router";
import Sidebar from "../components/Sidebar";
import LanguageSwitcher from "../components/LanguageSwitcher";

const MainLayout = () =>  {
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