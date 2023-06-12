import Image from "./Image";

export default class Domain {
    public id!: string;
    public name!: string;
    public creationDate!: string;
    public containerId?: string | undefined;
    public image?: Image | undefined;
    public address!: string;
}