import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Record } from './record.entity';
import { Repository } from 'typeorm';

@Injectable()
export class RecordService {
  constructor(@InjectRepository(Record) private attendanceRepository: Repository<Record>) {}
}
