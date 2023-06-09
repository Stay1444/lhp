import Button from "../components/Button";
import TextField from "../components/TextField";
import style from "./LoginPage.module.sass"

const LoginPage = () => {
    return (
        <>
            <label className={style.title}>Log In</label>

            <div className={style.fields}>
                <TextField placeholder="Username" className={style.usernameField}/>

                <Button className={style.btn} label="Log In" theme="primary"/>
            </div>

        </>
    )
}

export default LoginPage;