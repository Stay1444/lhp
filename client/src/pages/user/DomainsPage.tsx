import { useContext, useEffect, useState } from "react";
import { LanguageContext } from "../../context/LanguageContext";

import style from "./DomainsPage.module.sass"
import TextField from "../../components/TextField";
import Button from "../../components/Button";

import { TbPlaylistAdd } from "react-icons/tb";
import Domain from "../../api/Domain";
import { useNavigate } from "react-router";
import { DomainController, MachineController } from "../../api/Controllers";
import Machine from "../../api/Machine";

const DomainsPage = () => {
    const lang = useContext(LanguageContext);
    const navigate = useNavigate();

    const [query, setQuery] = useState<string | undefined>(undefined);
    const [domains, setDomains] = useState<Domain[] | undefined>(undefined);
    const [machines, setMachines] = useState<Machine[] | undefined>(undefined);
    useEffect(() => {

        DomainController.List().then((r) => {
            if (r != undefined) {
                setDomains(r);
            }
        })

        MachineController.List().then(r => {
            if (r != undefined) {
                setMachines(r)
            }
        })

    }, [])

    const queryItem = (item: Domain): Domain | undefined => {
        if (query == undefined || query == "") return item;

        if (
            `${item.host}.${item.tld}`.toLowerCase().includes(query.toLowerCase()) ||
            item.target.toLowerCase().includes(query.toLowerCase())
        )
        {
            return item;
        }

        return;
    }

    if (domains == undefined) return (<></>)

    return (
        <>
            <h1 className={style.title}>{lang.getString("pages.domains.title")}</h1>
            <div className={style.parent}>
                <div className={style.controls}>
                    <label className={style.boxTitle}>{lang.getString("pages.domains.controls.title")}</label>
                    <TextField className={style.searchField} placeholder={lang.getString("pages.domains.controls.search")} value={query ?? ""} onChange={(t) => {
                        if (t.trim() == "") {
                            setQuery(undefined)
                        } else {
                            setQuery(t)
                        }
                    }}/>
                    <Button className={style.registerBtn} theme='primary' label="" onClick={() => navigate("/domains/register")}>
                        <div style={{display: 'flex', flexDirection: 'row', justifyContent: 'center', alignItems: 'center'}}>
                            <TbPlaylistAdd style={{fontSize: "1.5em", marginRight: "10px"}}/>
                            <label>{lang.getString("pages.domains.controls.register_domain")}</label>
                        </div>
                    </Button>
                </div>
                <table className={style.table}>
                    <thead>
                        <tr className={style.header}>
                            <th>{lang.getString("pages.domains.th.fullname")}</th>
                            <th>{lang.getString("pages.domains.th.name")}</th>
                            <th>{lang.getString("pages.domains.th.tld")}</th>
                            <th>{lang.getString("pages.domains.th.ip")}</th>
                            <th>{lang.getString("pages.domains.th.machine")}</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            domains
                                .filter((v) => queryItem(v))
                                .map((v, i) => {
                                return  <tr className={style.row} key={i} onClick={() => {
                                    navigate(`/domains/${v.id}`)
                                }}>
                                            <td className={style.selectable}>{v.host}.{v.tld}</td>
                                            <td className={style.selectable}>{v.host}</td>
                                            <td className={style.selectable}>{v.tld}</td>
                                            <td className={style.selectable}>{v.target}</td>
                                        <td>{machines?.find(x => x.address == v.target)?.name}</td>
                            </tr>
                            })
                        }
                    </tbody>
                </table>
            </div>
        </>
    )
}

export default DomainsPage;