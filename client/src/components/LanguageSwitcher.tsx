import React, { useContext, useState } from "react"
import { Language, LanguageContext } from "../context/LanguageContext"
import style from "./LanguageSwitcher.module.sass"

const LanguageLogos: any = {}
LanguageLogos[Language.English] = "🇬🇧"
LanguageLogos[Language.Spanish] = "🇪🇸"

type LanguageButtonProps = {
    lang: Language
}

const LanguageButton: React.FC<LanguageButtonProps> = ({lang}) => {
    const langCtx = useContext(LanguageContext)
    return (
        <label className={style.languageButton} onClick={() => {
            langCtx.setLang(lang)
        }}>
            <label>{LanguageLogos[lang]}</label>{Language[lang]}
        </label>
    )
}

const LanguageSwitcher = () => {
    const langCtx = useContext(LanguageContext);
    const [open, setOpen] = useState(false);

    return (
        <>  <div className={style.parent} onClick={() => {
                setOpen(x => !x)
            }}>
                <label className={`${style.selected} ${style.name}`}><label>{LanguageLogos[langCtx.lang]}</label>{Language[langCtx.lang]}</label>
            </div>

            {open &&
                <div className={style.modalParent} onClick={() => setOpen(false)}>
                    <div className={`${style.modal}`}>
                        {
                            Object.keys(Language).filter(key => !isNaN(Number(Language[key]))).map((v, i) => {
                                if (Language[v] == langCtx.lang) return null;
                                return <LanguageButton lang={Language[v]} key={i}/>
                            })
                        }
                    </div>
                </div>
            }
        </>
    )
}

export default LanguageSwitcher;