import { useContext, useState } from "react";
import style from "./RegisterDomainPage.module.sass"
import { LanguageContext } from "../../context/LanguageContext";
import TextField from "../../components/TextField";
import Button from "../../components/Button";
import { Option, Select } from "../../components/Select";

const RegisterDomainPage = () => {
    const lang = useContext(LanguageContext);
    const [advancedTargetMode, setAdvancedTargetMode] = useState<boolean>(false)

    return (
        <>
            <h1 className={style.title}>{lang.getString("pages.register_domain.title")}</h1>
            <div className={style.parent}>
                <div className={style.controlContainer}>
                    <label className={style.controlTitle}>Domain</label>
                    <div>
                        <label>Domain</label>
                        <TextField className={style.textInput} placeholder="example" />
                        <label>TLD</label>
                        <TextField className={style.textInput} placeholder="com" />
                        <label className={style.error}>Domain already taken</label>
                    </div>
                </div>
                <div className={style.controlContainer}>
                    <label className={style.controlTitle}>Target</label>
                    <div>
                        { !advancedTargetMode && <>
                            <label>Target Machine</label>
                            <Select>
                                <Option value="a" label="1"/>
                                <Option value="b" label="b"/>
                                <Option value="ac" label="c"/>
                                <Option value="d" label="d"/>
                            </Select>
                            <Button label="Advanced" onClick={() => setAdvancedTargetMode(true)}/>
                            </>
                        }
                        { advancedTargetMode && <>
                            <label>Target IP</label>
                            <TextField className={style.textInput} placeholder="10.0.0.0" />
                            <Button label="Simple" onClick={() => setAdvancedTargetMode(false)}/>
                            </>
                        }
                    </div>
                </div>
                <Button label="Register" theme="primary" className={style.submit}/>
            </div>
        </>
    )
}

export default RegisterDomainPage;