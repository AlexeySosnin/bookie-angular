import {Sport} from './sport';
export class Leagues {

    public id: number;
    public events_count: number;
    public is_active: boolean;
    public region_id: number;
    public sport_id: number;
    public name: string;
    public sport: Sport;
    public options: [];
    public show: boolean = false;
    public check: boolean = false;
    public regions_count: number;
}
