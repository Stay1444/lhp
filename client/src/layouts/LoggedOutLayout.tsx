import { useContext, useEffect } from "react";
import { Outlet, useNavigate } from "react-router"
import { IdentityContext } from "../context/IdentityContext";

import style from "./LoggedOutLayout.module.sass"

const LoggedOutLayout = () =>  {
    const identity = useContext(IdentityContext)
    const navigate = useNavigate();

    useEffect(() => {
        if (identity.currentUser != undefined) {
            navigate("/")
        }
    }, [identity.currentUser, navigate])

    if (identity.currentUser != undefined) return (<></>)
    
    return (
        <div className={style.parent}>
            <div className={style.container}>
                <Outlet/>
            </div>
        </div>
    )
}

export default LoggedOutLayout;