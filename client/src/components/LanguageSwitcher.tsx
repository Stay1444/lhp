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
            <label>{LanguageLogos[lang]}</label>{langCtx.getString(`languages.${Language[lang]}`)}
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
                <label className={`${style.selected} ${style.name}`}><label>{LanguageLogos[langCtx.lang]}</label>{langCtx.getString(`languages.${Language[langCtx.lang]}`)}</label>
            </div>

            {open &&
                <div className={style.modalParent} onClick={() => setOpen(false)}>
                    <div className={`${style.modal}`}>
                        {
                            Object.keys(Language).filter((key) => !isNaN(Number(Language[key as keyof typeof Language]))).map((v, i) => {
                                if (Language[v as keyof typeof Language] === langCtx.lang) return null;
                                return <LanguageButton lang={Language[v as keyof typeof Language]} key={i}/>
                            })
                        }
                    </div>
                </div>
            }
        </>
    )
}

export default LanguageSwitcher;