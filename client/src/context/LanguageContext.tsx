import axios from "axios";
import React, { PropsWithChildren, useEffect } from "react";

import { useState } from "react";

export enum Language {
    English,
    Spanish
}

interface ILanguageContext {
    lang: Language,
    setLang: (lang: Language) => void,
    getString: (key: string) => string,
}

export const LanguageContext = React.createContext<ILanguageContext>({
    lang: Language.English,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    setLang: (_: Language) => { return; },
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    getString: (_: string) => { return ""; },
})

type LanguageContextProviderProps = PropsWithChildren<unknown>;

let languageSheet: any = {}

export const LanguageContextProvider = (props: LanguageContextProviderProps) => {
    const setLang = (lang: Language) => {
        axios.get(`lang/${Language[lang].toLowerCase()}.json`).then((r) => {
            setState({...state, lang: lang })
            languageSheet = r.data;
        });
    }

    const getString = (key: string) => {
        if (languageSheet == null) return "<!MISSING!>";
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        try {
            let obj: any = languageSheet;
            const keys = key.split(".");
    
            for(const k of keys) {
                obj = obj[k];
            }
    
            return obj;

        } catch {
            return "<!MISSING!>"
        }
    }

    const initState: ILanguageContext = {
        lang: Language.Spanish,
        setLang: setLang,
        getString: getString,
    }

    const [state, setState] = useState<ILanguageContext>(initState);

    useEffect(() => {
        const savedLang = localStorage.getItem("LANGUAGE");
        
        if (savedLang == null) {
            console.log("Setting language to english, default")
            setLang(Language.English);
            localStorage.setItem("LANGUAGE", Language[Language.English])
        } else {
            const l: Language = Language[localStorage.getItem("LANGUAGE") as keyof typeof Language];
            console.log(`Loaded language ${Language[l]}!`)
            setLang(l)

        }
    }, []);

    return (
        <LanguageContext.Provider value={state}>
            {props.children}
        </LanguageContext.Provider>
    )
}