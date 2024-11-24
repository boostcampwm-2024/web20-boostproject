import { Injectable } from '@nestjs/common';
import { Broadcast } from './broadcast.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { MoreThan, Repository } from 'typeorm';
import { CreateBroadcastDto } from './dto/createBroadcast.dto';
import { UpdateBroadcastTitleDto } from './dto/update-broadcast-title.request.dto';
import { CustomException } from 'src/common/responses/exceptions/custom.exception';
import { ErrorStatus } from 'src/common/responses/exceptions/errorStatus';
import { Attendance } from 'src/attendance/attendance.entity';

@Injectable()
export class BroadcastService {
  constructor(
    @InjectRepository(Broadcast) private readonly broadcastRepository: Repository<Broadcast>,
    @InjectRepository(Attendance) private readonly attendanceRepository: Repository<Attendance>,
  ) {}

  async getAll() {
    return this.broadcastRepository
      .createQueryBuilder('broadcast')
      .leftJoinAndSelect('broadcast.member', 'member')
      .getMany();
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
    // 임시 broadcastId로 사용
    const tempBroadcastId = '1';
    const broadcast = await this.broadcastRepository.findOne({
      where: { id: tempBroadcastId },
    });

    // TODO: 현재 userId로 넘어오는 값이 null 임
    // const broadcast = await this.broadcastRepository.findOne({
    //   where: { member: { id: userId } },
    //   relations: ['member'],
    // });

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

  async createBroadcast({ id, title, thumbnail }: CreateBroadcastDto): Promise<Broadcast> {
    const broadcast = this.broadcastRepository.create({
      id,
      title,
      thumbnail,
      startTime: new Date(),
      member: null,
    });

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

    // attendance 테이블에 출석 기록 저장 기능
    const endTime = new Date();

    const attendance = this.attendanceRepository.create({
      attended: Attendance.isAttended(broadcast.startTime, endTime),
      startTime: broadcast.startTime,
      endTime,
      member: broadcast.member,
    });

    await this.attendanceRepository.save(attendance);
  }
}
