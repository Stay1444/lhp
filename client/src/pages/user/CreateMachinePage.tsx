import { useContext, useEffect, useState } from "react";
import style from "./CreateMachinePage.module.sass"
import { LanguageContext } from "../../context/LanguageContext";
import TextField from "../../components/TextField";
import Button from "../../components/Button";
import { Option, Select } from "../../components/Select";
import { ImageController, MachineController } from "../../api/Controllers";
import ApiError from "../../api/ApiError";
import { useNavigate } from "react-router";
import Machine from "../../api/Machine";
import Image from "../../api/Image";

const CreateMachinePage = () => {
    const lang = useContext(LanguageContext);
    const [error, setError] = useState<string | undefined>(undefined);
    const navigate = useNavigate();

    const [images, setImages] = useState<Image[] | undefined>(undefined);

    useEffect(() => {
        ImageController.List().then((r) => {
            if (r == undefined) return;
            setImages(r);
            if (r.length > 0) setSelectedImage(r[0])
        })
    }, [])

    const [name, setName] = useState<string | undefined>(undefined);
    const [selectedImage, setSelectedImage] = useState<Image | undefined>(undefined);


    return (
        <>
            <h1 className={style.title}>{lang.getString("pages.create_machine.title")}</h1>
            <div className={style.parent}>
                <div className={style.controlContainer}>
                    <label className={style.controlTitle}>{lang.getString("pages.create_machine.labels.parameters")}</label>
                    <div>
                        <label>{lang.getString("pages.create_machine.labels.name")}</label>
                        <TextField className={style.textInput} placeholder={lang.getString("pages.create_machine.labels.name")} value={name} onChange={(r) =>  {
                            setError(undefined)
                            setName(r)
                        }}/>
                    </div>
                </div>
                <div className={style.controlContainer}>
                    <label className={style.controlTitle}>{lang.getString("pages.create_machine.labels.image")}</label>
                    <div>
                        <label>{lang.getString("pages.create_machine.labels.image")}</label>
                        <Select currentValue={selectedImage?.id} onSelect={(e) => {
                            setSelectedImage(images?.find(v => v.id == e))
                            setError(undefined)
                        }}>
                            {
                                images?.map((v, i) => {
                                    return <Option value={v.id} key={i} label={v.name}/>
                                })
                            }
                        </Select>
                        <p>
                            {selectedImage?.description}
                        </p>
                    </div>
                </div>
                
                { error && 
                    <label className={style.error}>{error}</label>
                }

                <Button label={lang.getString("pages.create_machine.controls.create")} theme="primary" className={style.submit} disabled={error != undefined || name == undefined || name.length < 3 || selectedImage == undefined} onClick={() => {
                    if (name == undefined || selectedImage == undefined) return;

                    MachineController.Create(name, selectedImage?.id).then(r => {
                        if (r == undefined) {
                            setError("An unknown error ocurred");
                            return;
                        }

                        if (r instanceof ApiError) {
                            setError(r.message)
                            return;
                        }

                        navigate("/machines")
                    })
                }}/>
            </div>
        </>
    )
}

export default CreateMachinePage;