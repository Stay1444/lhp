import { PropsWithChildren } from 'react';
import style from './HomePage.module.sass'
import { useLocation, useNavigate } from 'react-router';

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
        </div>
    )
}

const HomePage = () => {
    return (
        <div className={style.container}>
            <Card name='Maquinas' path='/machines'/>
            <Card name='Dominios' path='/domains'/>
        </div>
    )
}

export default HomePage;