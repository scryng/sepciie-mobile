import { milliseconds } from 'date-fns';
import { storage } from '../../../db';
import { deviceIdListSchema, LocationQueueItem, locationQueueSchema } from './schema';
import { sleep } from '@/utils/other';
import { LogService } from '../logging/LogService';
import { isNullOrBlank } from '@/utils/strings';

export namespace GpsOfflineData {
  type TaskResult = {
    success: boolean;
    error?: string;
  };

  type BatchTaskOptions = {
    cooldown: number;
  };

  const defaultBatchCooldown = milliseconds({ seconds: 5 });

  function getQueueKey(): string {
    return 'offline-queue';
  }

  export async function getGpsDeviceId(): Promise<string | null> {
    try {
      const deviceId = await storage.getString('gps-device-id');
      return deviceId ?? null;
    } catch (e) {
      return null;
    }
  }

  export async function updateDeviceId(newDeviceId: string): Promise<void> {
    if (isNullOrBlank(newDeviceId)) {
      return;
    }

    await storage.set('gps-device-id', newDeviceId);
  }

  export async function getQueue(): Promise<Array<LocationQueueItem>> {
    const rawData = await storage.getString(getQueueKey());
    if (!rawData) {
      return [];
    }

    const json = JSON.parse(rawData);
    return locationQueueSchema.parse(json);
  }

  export async function updateQueue(queue: Array<LocationQueueItem>): Promise<void> {
    await storage.set(getQueueKey(), JSON.stringify(queue));
  }

  export async function add(item: LocationQueueItem): Promise<void> {
    const queue = await getQueue();
    const nextQueue = [...queue, item];
    await updateQueue(nextQueue);
  }

  export async function remove(item: LocationQueueItem): Promise<void> {
    const queue = await getQueue();
    const nextQueue = queue.filter((i) => i.timestamp !== item.timestamp);
    await updateQueue(nextQueue);
  }

  export async function runBatchTask(
    predicate: (item: LocationQueueItem) => Promise<TaskResult>,
    options?: BatchTaskOptions
  ) {
    const cooldown = options?.cooldown ?? defaultBatchCooldown;
    const queue = await getQueue();

    LogService.info('[Queue items] ' + JSON.stringify(queue, null, 4));
    LogService.info(`🕒 Starting offline queue sync of ${queue.length} items`);

    let failedItems: Array<LocationQueueItem> = [];
    for (const item of queue) {
      try {
        const result = await predicate(item);
        if (!result.success) {
          failedItems.push(item);
        }
      } catch (e) {
        console.error(e);
      }

      await sleep(cooldown);
    }

    await updateQueue(failedItems);
    
    const failures = Math.max(failedItems.length, 0);
    const successes = Math.max(queue.length - failures, 0);

    return {
      successes,
      failures,
    };
  }
}
