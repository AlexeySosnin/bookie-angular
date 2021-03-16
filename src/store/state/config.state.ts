import { IConfig } from '../../core/models/config.interface';


export interface IConfigState {
  config: IConfig;
}

export const initialConfigState: IConfigState = {
  config: null
};
