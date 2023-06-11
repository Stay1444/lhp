import { PropsWithChildren } from "react";

import style from "./Select.module.sass"

type SelectProps = PropsWithChildren<{
    className?: string,
    disabled?: boolean,
    currentValue?: string
}>;

type OptionProps = PropsWithChildren<{
    value: string,
    label?: string,
    className?: string
}>;

const Select: React.FC<SelectProps> = ({className, disabled = false, children, currentValue}) => {
    return (
        <select className={`${style.select} ${className}`} disabled={disabled} defaultValue={currentValue}>
            {children}
        </select>
    )
}

const Option: React.FC<OptionProps> = ({value, label, className, children}) => {
    return (
        <option className={`${style.option} ${className}`} value={value}>{children}{label}</option>
    )
}

export { Select, Option }