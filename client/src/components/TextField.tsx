import React, { useEffect, useRef } from "react";

import style from "./TextField.module.sass"

type TextFieldProps = {
    placeholder?: string,
    onChange?: (text: string) => void
    className?: string,
    type?: "text" | "number",
    value?: string,
    onSubmit?: () => void
};


const TextField: React.FC<TextFieldProps> = ({type = "text", value = "", placeholder, className, onChange, onSubmit}) => {
    const element = useRef<HTMLInputElement>(null);
    
    useEffect(() => {

        const handle = (e: KeyboardEvent) => {
            if (e.code == "Enter" && onSubmit != null && element.current == document.activeElement) {
                onSubmit()
            } 
        }

        document.addEventListener("keypress", handle);

        return () => {
            document.removeEventListener("keypress", handle);
        }
    }, [element, onSubmit])

    return (
        <input ref={element} type={type} placeholder={placeholder} value={value} className={`${style.input} ${className}`} onChange={(e) => {
            if (onChange == null) return;
            onChange(e.target.value);
        }}/>
    )
}

export default TextField;