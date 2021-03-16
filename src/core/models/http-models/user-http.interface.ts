import { IUser } from '../user.interface'; 
import { Evend } from '../evend';

export interface IUserHttp {
  data: Evend[];
  message: string;
}
