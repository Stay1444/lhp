import { useContext, useEffect } from "react";
import { Outlet, useNavigate } from "react-router"
import { IdentityContext } from "../context/IdentityContext";

const AdminLayout = () =>  {
    const identity = useContext(IdentityContext)
    const navigate = useNavigate();

    useEffect(() => {
        if (identity.currentUser == undefined) {
            navigate("/login")
            return;
        }

        if (identity.currentUser != undefined && !identity.currentUser.admin) {
            navigate("/")
        }
    }, [identity.currentUser, navigate])

    if (identity.currentUser != undefined && !identity.currentUser.admin) return (<></>)
    
    return (
        <Outlet/>
    )
}

export default AdminLayout;