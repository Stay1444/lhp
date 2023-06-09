import { PropsWithChildren, useContext } from 'react';
import style from './HomePage.module.sass'
import { useLocation, useNavigate } from 'react-router';
import { LanguageContext } from '../../context/LanguageContext';

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

    return (
        <div className={style.container}>
            <Card name={langCtx.getString("pages.home.cards.machines.title")} path='/machines'>
                <label style={{display: 'block', marginBottom: '15px'}}><i className={`${style.ellipse} ${style.green}`}/>5 {langCtx.getString("pages.home.cards.machines.on")}</label>
                <label style={{display: 'block'}}><i className={`${style.ellipse} ${style.red}`}/>2 {langCtx.getString("pages.home.cards.machines.off")}</label>
            </Card>
            <Card name={langCtx.getString("pages.home.cards.domains.title")} path='/domains'>
                <label style={{display: 'block', marginBottom: '15px'}}><i className={`${style.ellipse} ${style.primary}`}/>5 {langCtx.getString("pages.home.cards.domains.registered")}</label>
            </Card>
        </div>
    )
}

export default HomePage;