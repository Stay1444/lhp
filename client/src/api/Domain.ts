export default class Domain {
    public id!: string
    public host!: string
    public tld!: string
    public target!: string
    public status?: number | undefined
}