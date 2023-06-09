import axios from "axios";
import React, { PropsWithChildren, useEffect } from "react";

import { useState } from "react";
import User from "../api/User";

interface IIdentityContext {
    currentUser: User | undefined,
    logout: () => void,
    login: (token: string) => void
}

export const IdentityContext = React.createContext<IIdentityContext>({
    currentUser: undefined,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    logout: () => { return; },
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    login: (_) => { return; },
})

type IdentityContextProviderProps = PropsWithChildren<unknown>;

export const IdentityContextProvider = (props: IdentityContextProviderProps) => {
    const logout = () => {
        return;
    }

    const login = (token: string) => {
        return;
    }

    const initState: IIdentityContext = {
        currentUser: undefined,
        logout: logout,
        login: login
    }

    const [state, setState] = useState<IIdentityContext>(initState);
    const [loading, setLoading] = useState(true);

    useEffect(() => {

        const token = localStorage.getItem("authorization");

        if (token == undefined) {
            setLoading(false)
        }
    }, []);

    if (loading) return (<></>)

    return (
        <IdentityContext.Provider value={state}>
            {props.children}
        </IdentityContext.Provider>
    )
}