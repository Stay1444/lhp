import { useContext, useEffect, useState } from "react";
import style from "./EditDomainPage.module.sass"
import { LanguageContext } from "../../context/LanguageContext";
import TextField from "../../components/TextField";
import Button from "../../components/Button";
import { Option, Select } from "../../components/Select";
import { DomainController, MachineController } from "../../api/Controllers";
import ApiError from "../../api/ApiError";
import { useNavigate, useParams } from "react-router";
import Machine from "../../api/Machine";
import Domain from "../../api/Domain";

const EditDomainPage = () => {
    const lang = useContext(LanguageContext);
    const { id } = useParams();
    
    const [advancedTargetMode, setAdvancedTargetMode] = useState<boolean>(false)
    const [error, setError] = useState<string | undefined>(undefined);

    const [domain, setDomain] = useState<Domain | undefined>(undefined);
    const [machines, setMachines] = useState<Machine[] | undefined>(undefined);
    const [target, setTarget] = useState<string | undefined>(undefined);

    const navigate = useNavigate();

    useEffect(() => {
        MachineController.List().then(r => {
            if (r != undefined) {
                setMachines(r);
            }
        })

        if (id == undefined) {
            navigate("/domains");
            return;
        }

        DomainController.GetById(id).then(r => {
            if (r == undefined) {
                navigate("/domains")
                return;
            }
            
            setDomain(r)
            setTarget(r.target)
        })
    }, []);

    if (domain == undefined) return <>Loading</>

    return (
        <>
            <h1 className={style.title}>{domain.host}.{domain.tld}</h1>
            <div className={style.parent}>
                <div className={style.controlContainer}>
                    <label className={style.controlTitle}>{lang.getString("pages.edit_domain.labels.target")}</label>
                    <div>
                        { !advancedTargetMode && <>
                            <label>{lang.getString("pages.edit_domain.labels.machines")}</label>
                            <Select currentValue={machines?.find(x => x.address == domain.target)?.address} onSelect={x => setTarget(x)}>
                                { machines != undefined && machines.map((v) => {
                                    return <Option value={v.address} label={`${v.name} - ${v.address}`}/>
                                })}
                            </Select>
                            <Button label={lang.getString("pages.edit_domain.controls.advanced")} onClick={() => setAdvancedTargetMode(true)}/>
                            </>
                        }
                        { advancedTargetMode && <>
                            <label>{lang.getString("pages.edit_domain.labels.target_ip")}</label>
                            <TextField className={style.textInput} placeholder="10.0.0.0" value={target} onChange={(e) => {
                                setError(undefined)
                                setTarget(e)
                            }}/>
                            <Button label={lang.getString("pages.edit_domain.controls.simple")} onClick={() => setAdvancedTargetMode(false)}/>
                            </>
                        }

                        { error && 
                            <label className={style.error}>{error}</label>
                        }
                    </div>
                </div>
                <div className={style.buttonGroup}>
                    <Button label={lang.getString("pages.edit_domain.controls.delete")} theme="danger" className={style.delete} onClick={() => {
                        DomainController.Delete(domain.id).then((r) => {
                            if (r instanceof ApiError) {
                                setError(r.message)
                                return;
                            }
                            
                            if (r !== true) {
                                setError("An unknown error ocurred.")
                                return;
                            }

                            navigate("/domains")
                        })
                        return;
                    }}/>
                    <Button label={lang.getString("pages.edit_domain.controls.update")} theme="primary" className={style.submit} disabled={error != undefined || target == undefined} onClick={() => {
                        if (domain == undefined || target == undefined) return;
                        
                        DomainController.Update(domain.id, target).then(r => {
                            if (r instanceof ApiError) {
                                setError(r.message);
                                return;
                            }

                            if (r == undefined) {
                                setError("Unknown error")
                                return;
                            }

                            navigate("/domains")
                        })
                    }}/>
                </div>
            </div>
        </>
    )
}

export default EditDomainPage;