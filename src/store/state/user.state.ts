import { Evend } from "../../core/models/evend";
import { MatchPrice } from "../../core/models/matchPrice";

 

export interface IUserState {
  users: Evend[];
  matchs: MatchPrice;
  selectedUser: Evend;
}

export const initialUserState: IUserState = {
  users: null,
  matchs: null,
  selectedUser: null
};