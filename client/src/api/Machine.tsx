import Image from "./Image";

export default class Domain {
    public id!: string
    public name!: string
    public running!: boolean
    public containerId?: string | undefined
    public image?: Image | undefined;
}