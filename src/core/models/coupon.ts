
export class NewCoupon {

    state: number; //1 (Single), 2 (Combined), 3 (System)
    is_changes_accepted: Boolean;//	required	optional	Are the coupon / bet odds changes accepted? true/false
    odds: any[]; //	required	optional	Odd IDs array.
    system: any[];
    banks: any[];
    stake: number;
    brand_id: number;
    created_at: string;
    updated_at: string;
    state_name: string;
    id: number;
    member_id: number;
    is_canceled: boolean;
    token: string;
    showDetail: boolean;
    counters: any[];
}


export class Odd {
    
}