const MachinesPage = () => {
    return (
        <>
            <h1 className={style.title}>{lang.getString("pages.domains.title")}</h1>
            <div className={style.parent}>
                <div className={style.controls}>

                </div>
                <table className={style.table}>
                    <thead>
                        <tr className={style.header}>
                            <th>{lang.getString("pages.domains.th.state")}</th>
                            <th>{lang.getString("pages.domains.th.image")}</th>
                            <th>{lang.getString("pages.domains.th.created")}</th>
                            <th>{lang.getString("pages.domains.th.ip")}</th>
                            <th>{lang.getString("pages.domains.th.ports")}</th>
                        </tr>
                    </thead>
                    <tr className={style.row}>
                        <td>hola</td>
                        <td>running</td>
                        <td>basic</td>
                        <td>3 years ago</td>
                        <td>10.0.0.1</td>
                        <td>3333, 3333</td>
                    </tr>
                </table>
            </div>
        </>   
    )
}

export default MachinesPage;