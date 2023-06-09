import { useContext, useState } from "react";
import Button from "../components/Button";
import TextField from "../components/TextField";
import style from "./LoginPage.module.sass"
import { IdentityContext } from "../context/IdentityContext";
import { IdentityController } from "../api/Controllers";
import { Link } from "react-router-dom";
import { AxiosError } from "axios";

const LoginPage = () => {
    const identity = useContext(IdentityContext);

    const [username, setUsername] = useState<string>("");
    const [error, setError] = useState<string | undefined>(undefined);

    const valid = username.trim().length > 3;

    const submit = async () => {
        if (!valid) return;

        try {
            const token = await IdentityController.Login(username);

            if (token == undefined) {
                setError("Invalid username")
                return;
            }
            console.log("LOGGING IN")
            identity.login(token)
            setError(undefined)
        } catch (error) {
            if (error instanceof AxiosError) {
                if (error.response?.status == 401) {
                    setError("Error: Invalid username")
                    return;
                }
            }
            setError("Unknown Error")
        }

    }

    return (
        <>
            <label className={style.title}>Log In</label>

            <div className={style.fields}>

                { error && <label className={style.error}>{error}</label>}

                <TextField placeholder="Username" className={style.usernameField} 
                onSubmit={() => {
                    if (valid) submit();
                }}
                onChange={(t) => setUsername(t.trim().toLowerCase())} 
                value={username}/>

                <div className={style.buttonGroup}>
                    <Link className={style.register} to={'/register'}>Register</Link>
                    <Button className={style.btn} label="Log In" theme="primary" disabled={!valid} onClick={submit}/>
                </div>
            </div>

        </>
    )
}

export default LoginPage;
