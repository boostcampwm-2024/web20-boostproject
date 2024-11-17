import { CreateBroadcastDto } from "../dto/createBroadcast.dto";
import { IBroadcast } from "./broadcast.interface";

export interface IBroadcastService {
  createBroadcast(createBroadcastDto: CreateBroadcastDto): Promise<IBroadcast>;
  incrementViewers(broadcastId: string): Promise<void>;
  decrementViewers(broadcastId: string): Promise<void>;
}
