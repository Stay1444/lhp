export default class Domain {
    public id!: string
    public host!: string
    public tld!: boolean
    public target!: Date

    public fullDomain() {
        return `${this.host}.${this.tld}`
    }
}