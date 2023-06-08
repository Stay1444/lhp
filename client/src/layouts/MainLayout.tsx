import style from "./MainLayout.module.sass"

import { Outlet } from "react-router";
import Sidebar from "../components/Sidebar";

const MainLayout = () =>  {
    return (
        <div className={style.parent}>
            <div className={style.sidebarContainer}>
                <Sidebar/>
            </div>
            <div className={style.contentContainer}>
                <Outlet/>
            </div>
        </div>
    )
}

export default MainLayout;