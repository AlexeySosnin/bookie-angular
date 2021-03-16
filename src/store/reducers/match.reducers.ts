import { EMatchActions } from '../actions/match.actions';
import { MatchActions } from '../actions/match.actions';
import { initialMatchState, IMatchState } from '../state/match.state';

export function matchReducers(
  state = initialMatchState,
  action: MatchActions
): IMatchState {
  switch (action.type) {
    case EMatchActions.GetMatchsSuccess: {
      return {
        ...state,
        matchs: action.payload
      };
    }
    case EMatchActions.GetMatchSuccess: {
      return {
        ...state,
        selectedMatch: action.payload
      };
    }
    default:
      return state;
  }
};
