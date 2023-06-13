import { useContext, useEffect, useState } from "react";
import style from "./RegisterDomainPage.module.sass"
import { LanguageContext } from "../../context/LanguageContext";
import TextField from "../../components/TextField";
import Button from "../../components/Button";
import { Option, Select } from "../../components/Select";
import { DomainController, MachineController } from "../../api/Controllers";
import ApiError from "../../api/ApiError";
import { useNavigate } from "react-router";
import Machine from "../../api/Machine";

const RegisterDomainPage = () => {
    const lang = useContext(LanguageContext);
    const [advancedTargetMode, setAdvancedTargetMode] = useState<boolean>(false)
    const [error, setError] = useState<string | undefined>(undefined);

    const [domain, setDomain] = useState<string | undefined>(undefined);
    const [machines, setMachines] = useState<Machine[] | undefined>(undefined);
    const [tld, setTld] = useState<string | undefined>(undefined);
    const [target, setTarget] = useState<string | undefined>(undefined);

    const [checked, setChecked] = useState<boolean>(true);

    const navigate = useNavigate();

    useEffect(() => {
        MachineController.List().then(r => {
            if (r != undefined) {
                setMachines(r);

                if (r.length > 0) {
                    setTarget(r[0].address.address)
                }
            }
        })
    }, []);

    useEffect(() => {
        if (checked) return;
        console.log("checking")


        const timeout = setTimeout(() => {
            setChecked(true)

            if (domain != undefined && tld != undefined) {
                DomainController.Check(domain, tld).then(r => {
                    console.log(r)
                    if (r == undefined) return;
    
                    if (r instanceof ApiError) {
                        console.log("ERROR")
                        setError(r.message)
                        return
                    }

                    setError(undefined)
                });
            }

        }, 250)
        
        return () => clearTimeout(timeout)

    }, [checked, setError])

    return (
        <>
            <h1 className={style.title}>{lang.getString("pages.register_domain.title")}</h1>
            <div className={style.parent}>
                <div className={style.controlContainer}>
                    <label className={style.controlTitle}>{lang.getString("pages.register_domain.labels.domain")}</label>
                    <div>
                        <label>Domain</label>
                        <TextField className={style.textInput} placeholder={lang.getString("pages.register_domain.examples.host")} value={domain} onChange={(e) => {

                            setDomain(e.replace(" ", "").replace(".", ""))
                            setChecked(false)

                        }} />
                        <label>TLD</label>
                        <TextField className={style.textInput} placeholder={lang.getString("pages.register_domain.examples.tld")} value={tld} onChange={(e) => {
                            setTld(e.replace(" ", "").replace(".", ""))
                            setChecked(false)  
                        }} />
                        { error && 
                            <label className={style.error}>{error}</label>
                        }
                    </div>
                </div>
                <div className={style.controlContainer}>
                    <label className={style.controlTitle}>{lang.getString("pages.register_domain.labels.target")}</label>
                    <div>
                        { !advancedTargetMode && <>
                            <label>{lang.getString("pages.register_domain.labels.machines")}</label>
                            <Select onSelect={ip => setTarget(ip)}>
                                { machines != undefined && machines.map((v) => {
                                    return <Option value={v.address.address} label={`${v.name} - ${v.address.address}`}/>
                                })}
                            </Select>
                            <Button label={lang.getString("pages.register_domain.controls.advanced")} onClick={() => setAdvancedTargetMode(true)}/>
                            </>
                        }
                        { advancedTargetMode && <>
                            <label>{lang.getString("pages.register_domain.labels.target_ip")}</label>
                            <TextField className={style.textInput} placeholder="10.0.0.0" value={target} onChange={(e) => {
                                setChecked(false)
                                setTarget(e)
                            }}/>
                            <Button label={lang.getString("pages.register_domain.controls.simple")} onClick={() => setAdvancedTargetMode(false)}/>
                            </>
                        }
                    </div>
                </div>
                <Button label={lang.getString("pages.register_domain.controls.register")} theme="primary" className={style.submit} disabled={error != undefined || target == undefined || domain == undefined || tld == undefined} onClick={() => {
                    if (domain == undefined || tld == undefined || target == undefined) return;
                    
                    DomainController.Register(domain, tld, target).then(r => {
                        if (r == undefined) {
                            setError("An unknown error ocurred.")
                            return
                        }

                        if (r instanceof ApiError) {
                            setError(r.message)
                            return
                        }
                        console.log(r)

                        navigate("/domains")
                    })
                }}/>
            </div>
        </>
    )
}

export default RegisterDomainPage;