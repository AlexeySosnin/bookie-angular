import { Leagues } from "./leagues";

export class Region {
    public id: number;
    public name: string;
    public is_active: boolean;
    public show: boolean=false;
    public leagues_count: number;
    public type: string; 
    public image:string;
    public leagues: Leagues[];
}
