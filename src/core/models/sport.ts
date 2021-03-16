import { Region } from "./region";

export class Sport {

    public id: number;
    public name: string;
    public is_active: boolean;
    public show: boolean = false;
    public regions_count: number;
    public events_count: number;
    public type: string;
    public regions: Region[];
}
