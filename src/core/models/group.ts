import { Evend } from "./evend";
import { Leagues } from "./leagues";
import { Sport } from "./sport";
import { Region } from "./region";

export class GroupEvent {
    public events: any[];
    public nodes: Node;
    public date: string;
}


export class Node {
  public sport: Sport;
  public region: Region;
  public league: Leagues;
}

