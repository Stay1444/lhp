import React, { useContext, useState } from "react"
import style from "./UserManager.module.sass"
import { IdentityContext } from "../context/IdentityContext";
import Button from "./Button";
import { FiUser } from "react-icons/fi";

const UserManager = () => {
    const identity = useContext(IdentityContext);
    const [open, setOpen] = useState(false);

    return (
        <>  <div className={style.parent} onClick={() => {
                setOpen(x => !x)
            }}>
                <label className={`${style.selected} ${style.name}`}><FiUser/>{identity.currentUser?.name}</label>
            </div>

            {open &&
                <div className={style.modalParent} onClick={() => setOpen(false)}>
                    <div className={`${style.modal}`}>
                        <Button theme="danger" label="Log Out" onClick={() => {
                            identity.logout();
                        }}/>
                    </div>
                </div>
            }
        </>
    )
}

export default UserManager;