import { User } from "../../domain/entities/User";

export interface RequestContext {
  user: User | null;
}
