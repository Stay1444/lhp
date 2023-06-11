import { PropsWithChildren, useContext, useEffect, useState } from 'react';
import style from './HomePage.module.sass'
import { useLocation, useNavigate } from 'react-router';
import { LanguageContext } from '../../context/LanguageContext';
import Domain from '../../api/Domain';
import { DomainController, MachineController } from '../../api/Controllers';
import Machine from '../../api/Machine';

type CardProps = PropsWithChildren<{
    name: string;
    path: string;
}>;


const Card: React.FC<CardProps> = ({name, path, children}) => {
    const location = useLocation();
    const navigate = useNavigate();

    const active = location.pathname.toLowerCase() == path.toLowerCase();
    
    return (
        <div className={style.card} onClick={() => {
            if (active) return;
            navigate(path);
        }}>
            <label className={style.cardName}>{name}</label>


            <div>
                {children}
            </div>
        </div>
    )
}

const HomePage = () => {
    const langCtx = useContext(LanguageContext);

    const [domains, setDomains] = useState<Domain[] | undefined>(undefined);
    const [machines, setMachines] = useState<Machine[] | undefined>(undefined);

    useEffect(() => {

        DomainController.List().then((r) => {
            if (r != undefined) {
                setDomains(r)
            }
        });

        MachineController.List().then((r) => {
            if (r != undefined) {
                setMachines(r)
            }
        })

    }, []);

    return (
        <div className={style.container}>
            { 
                machines && <Card name={langCtx.getString("pages.home.cards.machines.title")} path='/machines'>
                <label style={{display: 'block', marginBottom: '15px'}}><i className={`${style.ellipse} ${style.green}`}/>{machines?.filter(x => x.running).length} {langCtx.getString("pages.home.cards.machines.on")}</label>
                <label style={{display: 'block'}}><i className={`${style.ellipse} ${style.red}`}/>{machines?.filter(x => !x.running).length} {langCtx.getString("pages.home.cards.machines.off")}</label>
            </Card>
            }

            {
                domains && <Card name={langCtx.getString("pages.home.cards.domains.title")} path='/domains'>
                <label style={{display: 'block', marginBottom: '15px'}}><i className={`${style.ellipse} ${style.primary}`}/>{domains?.length ?? 0} {langCtx.getString("pages.home.cards.domains.registered")}</label>
            </Card>
            }
            
            
        </div>
    )
}

export default HomePage;