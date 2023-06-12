import React, { PropsWithChildren, useEffect } from "react";

import { useState } from "react";
import User from "../api/User";
import { ControllerOptions, IdentityController } from "../api/Controllers";

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
    const logoutHandler = () => {
        return;
    }

    const loginHandler = (token: string) => {
        console.log("Fetching user...")
        ControllerOptions.Authorization = token;
        IdentityController.Me().then((result) => {
            if (result != undefined) {
                setState((prevState) => ({ ...prevState, currentUser: result }));
                console.log("LOGGED IN")
                localStorage.setItem("authorization", token)
                if (loading) setLoading(false);
            }
        }).catch((e) => {
            ControllerOptions.Authorization = undefined;
            console.log("FAILED TO LOG IN", e)
        })
    }

    const initState: IIdentityContext = {
        currentUser: undefined,
        logout: logoutHandler,
        login: loginHandler
    }

    const [state, setState] = useState<IIdentityContext>(initState);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const token = localStorage.getItem("authorization");
    
        if (token == undefined) {
          setLoading(false);
        } else {
          loginHandler(token);
          setLoading(false);
        }
      }, []);

    if (loading) return (<></>)

    return (
        <IdentityContext.Provider value={state}>
            {props.children}
        </IdentityContext.Provider>
    )
}