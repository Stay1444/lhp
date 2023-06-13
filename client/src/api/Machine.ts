import Image from "./Image";
import MachineAddress from "./MachineAddress";

export default class Machine {
    public id!: string;
    public name!: string;
    public creationDate!: string;
    public containerId?: string | undefined;
    public image?: Image | undefined;
    public address!: MachineAddress;
}