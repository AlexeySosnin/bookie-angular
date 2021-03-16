export class KeyValuePair<T>
{
    public key: string;
    public value: T;

    construct(key: string, value: T) {
        this.key = key;
        this.value = value;
    }
}