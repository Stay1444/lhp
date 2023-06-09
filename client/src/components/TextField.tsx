import React from "react";

import style from "./TextField.module.sass"

type TextFieldProps = {
    placeholder?: string,
    onChange?: (text: string) => void
    className?: string,
    type?: "text" | "number"
};


const TextField: React.FC<TextFieldProps> = ({type = "text", placeholder, onChange, className}) => {
    return (
        <input type={type} placeholder={placeholder} className={`${style.input} ${className}`} onChange={(e) => {
            if (onChange == null) return;
            onChange(e.target.value);
        }}/>
    )
}

export default TextField;