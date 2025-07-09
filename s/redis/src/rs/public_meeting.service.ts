import { Injectable } from '@nestjs/common';
import Redis from 'ioredis';

export interface PublicMeeting {
  id: string;
  title: string;
  url: string;
}

@Injectable()
export class RedisMeetingService {
    private redis: Redis
    constructor() {
        this.redis = new Redis({
            host: process.env.REDIS_HOST || 'nest-redis',
            port: 6379,
        })
        this.redis.on('error', (err) => {
          console.error('Redis connection error:', err)
        })
    }

  private meetingKey = (id: string) => `meeting:${id}`;
  private meetingIdSet = 'public_meeting_ids';

  // Thêm meeting public mới
  async addMeeting(meeting: PublicMeeting): Promise<{ status: string }> {

    const fullMeeting: PublicMeeting = {
      ...meeting,
    };

    await this.redis.sadd(this.meetingIdSet, fullMeeting.id);
    await this.redis.hmset(this.meetingKey(fullMeeting.id), {
      title: fullMeeting.title,
      url: fullMeeting.url,
    });
    return { status: 'ok' }
  }

  // Lấy danh sách tất cả meeting public
  async getAllMeetings(): Promise<PublicMeeting[] | null> {
    const ids = await this.redis.smembers(this.meetingIdSet);
    if (ids.length === 0) return [];

    const pipeline = this.redis.pipeline();
    ids.forEach((id) => pipeline.hgetall(this.meetingKey(id)));

    const results = await pipeline.exec();

    return results && results.map(([, data]:any, i) => ({
      id: ids[i],
      title: data.title,
      url: data.url,
      createdAt: Number(data.createdAt),
    }));
  }

  // Xóa 1 meeting khỏi danh sách public
  async removeMeeting(id: string): Promise<void> {
    await this.redis.srem(this.meetingIdSet, id);
    await this.redis.del(this.meetingKey(id));
  }

  // Kiểm tra 1 meeting có tồn tại không
  async exists(id: string): Promise<boolean> {
    return (await this.redis.exists(this.meetingKey(id))) === 1;
  }

  // Lấy chi tiết 1 meeting theo id
  async getMeeting(id: string): Promise<PublicMeeting | null> {
    const data = await this.redis.hgetall(this.meetingKey(id));
    if (!data || !data.title) return null;

    return {
      id,
      title: data.title,
      url: data.url,
    };
  }
}

