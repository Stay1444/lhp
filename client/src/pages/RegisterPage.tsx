import { useContext, useState } from "react";
import Button from "../components/Button";
import TextField from "../components/TextField";
import style from "./RegisterPage.module.sass"
import { IdentityContext } from "../context/IdentityContext";
import { IdentityController } from "../api/Controllers";
import { Link } from "react-router-dom";

const RegisterPage = () => {
    const identity = useContext(IdentityContext);

    const [username, setUsername] = useState<string>("");
    const [error, setError] = useState<string | undefined>(undefined);

    const valid = username.trim().length > 3;

    const submit = async () => {
        if (!valid) return;

        try {
            const token = await IdentityController.Register(username);

            if (token == undefined) {
                setError("Invalid username")
                return;
            }

            identity.login(token);
            setError(undefined)
        } catch (e) {
            setError((e as string).toString());
            return;
        }
    }

    return (
        <>
            <label className={style.title}>Register</label>

            <div className={style.fields}>

                { error && <label className={style.error}>{error}</label>}

                <TextField placeholder="Username" className={style.usernameField} 
                onSubmit={() => {
                    if (valid) submit();
                }}
                onChange={(t) => setUsername(t.trim().toLowerCase())} 
                value={username}/>

                <div className={style.buttonGroup}>
                    <Link className={style.register} to={'/login'}>Login</Link>
                    <Button className={style.btn} label="Register" theme="primary" disabled={!valid} onClick={submit}/>
                </div>
            </div>

        </>
    )
}

export default RegisterPage;
