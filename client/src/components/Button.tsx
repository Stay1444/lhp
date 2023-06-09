import React, { PropsWithChildren } from "react"
import style from "./Button.module.sass"

type ButtonProps = PropsWithChildren<{
    label: string,
    onClick?: () => void
    className?: string,
    theme?: "primary" | "secondary" | "danger" | "success",
    disabled?: boolean
}>;

const Button: React.FC<ButtonProps> = ({label, theme = "secondary", disabled = false, onClick, className, children}) => {
    return (
        <button 
        disabled={disabled} 
        className={`${style.button} ${disabled ? style.disabled : style.enabled} ${style[theme]} ${className}`} 
        onClick={onClick}>
            {label} {children}
        </button>
    )
}

export default Button;