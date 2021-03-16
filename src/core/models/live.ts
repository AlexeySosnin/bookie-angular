export class Live {

    public  event_id: number;
    public  handicap: string;
    public  id: number;
    public  is_active: number;
    public  market_type_id: number;
    public  name: string;

    public  market_type: MarketGroup;
    public  odds: Odd[];
    public  group: string;
    public  is_handicap: string;
    public  is_over_under: string;
    public  priority: string;

}

export class MarketGroup {
    public id: number;
    public name: string;

    public kind: string;
    public sport_id: string;
    public is_handicap: string;
    public is_over_under: string;
}

export class Odd {
    public event_id: number;
    public handicap: string;
    public id: number;
    public is_active: boolean;
    public market_id: number;
    public name: string;
    public orjName: string;
    public price: number;
    public priority: number;
}