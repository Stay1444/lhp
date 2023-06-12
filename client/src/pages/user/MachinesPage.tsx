import { useContext, useEffect, useState } from "react";
import { LanguageContext } from "../../context/LanguageContext";

import style from "./MachinesPage.module.sass"
import TextField from "../../components/TextField";
import Button from "../../components/Button";

import { TbPlaylistAdd } from "react-icons/tb";
import { useNavigate } from "react-router";
import { MachineController } from "../../api/Controllers";
import Machine from "../../api/Machine";

import { FiTrash2,FiPower } from "react-icons/fi"
import MachineState from "../../api/MachineStatus";

const MachinesPage = () => {
    const lang = useContext(LanguageContext);
    const navigate = useNavigate();

    const [query, setQuery] = useState<string | undefined>(undefined);
    const [machines, setMachines] = useState<Machine[] | undefined>(undefined);
    const [machineStates, setMachineStates] = useState<MachineState[]>([]);


    useEffect(() => {

        MachineController.List().then((r) => {
            if (r == undefined) return;
            setMachines(r);

            for(const m of r) {
                MachineController.GetStatus(m.id).then(s => {
                    if (s == undefined) return;

                    setMachineStates(machineStates => [...machineStates, s])
                })
            }
        })

    }, [])

    useEffect(() => {
        const id = setInterval(() => {
            if (machines == undefined) return;
            const promises = []
            for(const machine of machines) {
                promises.push(MachineController.GetStatus(machine.id));
            }

            Promise.all(promises).then(result => {
                setMachineStates([...result]);
            })
        }, 5000)

        return () => clearInterval(id);

    }, [machines])

    const queryItem = (item: Machine): Machine | undefined => {
        if (query == undefined || query == "") return item;

        if (
            item.name.toLowerCase().includes(query.toLowerCase()) ||
            item.address.toLowerCase().includes(query.toLowerCase())
        )
        {
            return item;
        }

        return;
    }

    if (machines == undefined) return (<></>)

    return (
        <>
            <h1 className={style.title}>{lang.getString("pages.machines.title")}</h1>
            <div className={style.parent}>
                <div className={style.controls}>
                    <label className={style.boxTitle}>{lang.getString("pages.machines.controls.title")}</label>
                    <TextField className={style.searchField} placeholder={lang.getString("pages.machines.controls.search")} value={query ?? ""} onChange={(t) => {
                        if (t.trim() == "") {
                            setQuery(undefined)
                        } else {
                            setQuery(t)
                        }
                    }}/>
                    <Button className={style.createBtn} theme='primary' label="" onClick={() => navigate("/machines/create")}>
                        <div style={{display: 'flex', flexDirection: 'row', justifyContent: 'center', alignItems: 'center'}}>
                            <TbPlaylistAdd style={{fontSize: "1.5em", marginRight: "10px"}}/>
                            <label>{lang.getString("pages.machines.controls.create_machine")}</label>
                        </div>
                    </Button>
                </div>
                <table className={style.table}>
                    <thead>
                        <tr className={style.header}>
                            <th>{lang.getString("pages.machines.th.actions")}</th>
                            <th>{lang.getString("pages.machines.th.name")}</th>
                            <th>{lang.getString("pages.machines.th.state")}</th>
                            <th>{lang.getString("pages.machines.th.image")}</th>
                            <th>{lang.getString("pages.machines.th.created")}</th>
                            <th>{lang.getString("pages.machines.th.ip")}</th>
                            <th>{lang.getString("pages.machines.th.ports")}</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            machines
                                .filter((v) => queryItem(v))
                                .map((v, i) => {
                                    const state = machineStates.find(x => x.id == v.id);
                                return  <tr className={style.row} key={i}>
                                        <td style={{display: 'flex', flexDirection: 'row', columnGap: '10px', alignItems: 'center', justifyContent: 'center'}}> 
                                            <Button label="" theme="danger" onClick={() => {
                                                MachineController.Delete(v.id).then(() => {
                                                    MachineController.List().then((r) => {
                                                        if (r != undefined) {
                                                            setMachines(r);
                                                        }
                                                    })
                                                })
                                            }}>{<FiTrash2/>}</Button> 
                                            <Button label="" theme={state?.status == "created" ? "success" : state?.status == "stopped" ? "success" : state?.status == "exited" ? "success" : "danger"} onClick={() => {
                                                MachineController.Toggle(v.id).then(r => {
                                                    if (r == undefined) return;

                                                    setMachineStates(states => states.filter(x => x.id == v.id ? null : x))
                                                    setMachineStates([...machineStates, r])
                                                });
                                            }}>{<FiPower/>}</Button>
                                        </td>
                                        <td>{v.name}</td>
                                        <td>{state?.status}</td>
                                        <td>{v.image?.name ?? "<unknown>"}</td>
                                        <td>{new Date(v.creationDate).toLocaleTimeString()} {new Date(v.creationDate).toDateString()}</td>
                                        <td>{v.address}</td>
                                        <td>{v.image?.exposedPorts.map(x => <a className={style.port} target="_blank" href={`https://${v.address}:${x}/`}>{x}</a>)}</td>
                                    </tr>
                            })
                        }
                    </tbody>
                </table>
            </div>
        </>
    )
}

export default MachinesPage;