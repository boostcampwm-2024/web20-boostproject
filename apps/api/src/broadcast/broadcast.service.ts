import { Injectable } from '@nestjs/common';
import { Broadcast } from './broadcast.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { MoreThan, Repository } from 'typeorm';
import { CreateBroadcastDto } from './dto/createBroadcast.dto';
import { UpdateBroadcastTitleDto } from './dto/update-broadcast-title.request.dto';
import { CustomException } from 'src/common/responses/exceptions/custom.exception';
import { ErrorStatus } from 'src/common/responses/exceptions/errorStatus';
import { Member } from '../member/member.entity';
import { BroadcastListDto } from './dto/broadcast-list.dto';
import { AttendanceService } from 'src/attendance/attendance.service';

@Injectable()
export class BroadcastService {
  constructor(
    @InjectRepository(Broadcast) private readonly broadcastRepository: Repository<Broadcast>,
    @InjectRepository(Member) private readonly memberRepository: Repository<Member>,
    private readonly attendanceService: AttendanceService,
  ) {}

  async getAllWithFilterAndPagination(queries: BroadcastListDto) {
    const { field, cursor, limit } = queries;

    const query = this.broadcastRepository
      .createQueryBuilder('broadcast')
      .leftJoinAndSelect('broadcast.member', 'member')
      .orderBy('broadcast.id', 'ASC')
      .take(limit + 1);

    if (field) {
      query.andWhere('member.field = :field', { field });
    }

    if (cursor) {
      query.andWhere('broadcast.id > :cursor', { cursor });
    }

    const queryResult = await query.getMany();
    const hasNextData = queryResult.length > limit;
    const broadcasts = queryResult.slice(0, limit);

    const nextCursor = hasNextData ? broadcasts[broadcasts.length - 1].id : null;

    return { broadcasts, nextCursor };
  }

  async getBroadcastInfo(broadcastId: string) {
    const broadcast = await this.broadcastRepository
      .createQueryBuilder('broadcast')
      .leftJoinAndSelect('broadcast.member', 'member')
      .where('broadcast.id = :broadcastId', { broadcastId })
      .getOne();

    if (!broadcast) throw new CustomException(ErrorStatus.BROADCAST_NOT_FOUND);

    return broadcast;
  }

  async updateTitle(userId: number, { title: broadcastTitle }: UpdateBroadcastTitleDto) {
    const broadcast = await this.broadcastRepository.findOne({
      where: { member: { id: userId } },
      relations: ['member'],
    });

    if (!broadcast) {
      throw new CustomException(ErrorStatus.BROADCAST_NOT_FOUND);
    }

    broadcast.title = broadcastTitle;
    await this.broadcastRepository.update(broadcast.id, broadcast);
  }

  async searchBroadcasts(keyword: string): Promise<Broadcast[]> {
    if (!keyword) {
      return [];
    }

    return this.broadcastRepository
      .createQueryBuilder('broadcast')
      .leftJoinAndSelect('broadcast.member', 'member')
      .where('broadcast.title LIKE :keyword', { keyword: `%${keyword}%` })
      .getMany();
  }

  async createBroadcast({ id, title, thumbnail, memberId }: CreateBroadcastDto): Promise<Broadcast> {
    const member = await this.memberRepository.findOne({ where: { id: memberId } });
    if (!member) {
      throw new CustomException(ErrorStatus.MEMBER_NOT_FOUND);
    }
    const existingBroadcast = await this.broadcastRepository.findOne({
      where: { member: { id: member.id } },
    });
    if (existingBroadcast) {
      throw new CustomException(ErrorStatus.BROADCAST_ALREADY_EXISTS);
    }

    const broadcast = this.broadcastRepository.create({
      id,
      title,
      thumbnail,
      startTime: new Date(),
      member: member,
    });

    this.attendanceService.createAttendance(broadcast);

    return await this.broadcastRepository.save(broadcast);
  }

  async incrementViewers(broadcastId: string): Promise<void> {
    const broadcast = await this.broadcastRepository.findOne({
      where: { id: broadcastId },
    });

    if (!broadcast) {
      throw new CustomException(ErrorStatus.BROADCAST_NOT_FOUND);
    }

    await this.broadcastRepository.update({ id: broadcastId }, { viewers: () => 'viewers + 1' });
  }

  async decrementViewers(broadcastId: string): Promise<void> {
    const broadcast = await this.broadcastRepository.findOne({
      where: { id: broadcastId },
    });

    if (!broadcast) {
      throw new CustomException(ErrorStatus.BROADCAST_NOT_FOUND);
    }

    await this.broadcastRepository.update({ id: broadcastId, viewers: MoreThan(0) }, { viewers: () => 'viewers - 1' });
  }

  async deleteBroadcast(broadcastId: string): Promise<void> {
    const broadcast = await this.broadcastRepository.findOne({
      where: { id: broadcastId },
    });

    if (!broadcast) {
      throw new CustomException(ErrorStatus.BROADCAST_NOT_FOUND);
    }

    await this.broadcastRepository.delete({ id: broadcastId });

    this.attendanceService.updateAttendance(broadcastId);
  }
}
