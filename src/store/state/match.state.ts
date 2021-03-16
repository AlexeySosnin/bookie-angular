import { MatchPrice } from '../../core/models/matchPrice';

export interface IMatchState {
  matchs: MatchPrice[];
  selectedMatch: MatchPrice;
}

export const initialMatchState: IMatchState = {
  matchs: null,
  selectedMatch: null
};