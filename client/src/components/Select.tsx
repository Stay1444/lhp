import { PropsWithChildren } from "react";

import style from "./Select.module.sass"

type SelectProps = PropsWithChildren<{
    className?: string,
    disabled?: boolean
}>;

type OptionProps = PropsWithChildren<{
    value: string,
    selected?: boolean,
    label?: string,
    className?: string
}>;

const Select: React.FC<SelectProps> = ({className, disabled = false, children}) => {
    return (
        <select className={`${style.select} ${className}`} disabled={disabled}>
            {children}
        </select>
    )
}

const Option: React.FC<OptionProps> = ({value, selected = false, label, className, children}) => {
    return (
        <option className={`${style.option} ${className}`} value={value} selected={selected}>{children}{label}</option>
    )
}

export { Select, Option }