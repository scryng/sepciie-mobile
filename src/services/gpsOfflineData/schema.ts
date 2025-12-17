import z from 'zod';


export const locationQueueItemSchema = z.object({
  /**
   * The time at which this position information was obtained, in milliseconds since epoch.
   */
  timestamp: z.number(),
  /**
   * The latitude in degrees.
   */
  latitude: z.number(),
  /**
   * The longitude in degrees.
   */
  longitude: z.number(),
  /**
   * The altitude in meters above the WGS 84 reference ellipsoid. Can be `null` on Web if it's not available.
   */
  altitude: z.number(),
  /**
   * The radius of uncertainty for the location, measured in meters. Can be `null` on Web if it's not available.
   */
  accuracy: z.number(),
  /**
   * The accuracy of the altitude value, in meters. Can be `null` on Web if it's not available.
   */
  altitudeAccuracy: z.number(),
  /**
   * Horizontal direction of travel of this device, measured in degrees starting at due north and
   * continuing clockwise around the compass. Thus, north is 0 degrees, east is 90 degrees, south is
   * 180 degrees, and so on. Can be `null` on Web if it's not available.
   */
  heading: z.number(),
  /**
   * The instantaneous speed of the device in meters per second. Can be `null` on Web if it's not available.
   */
  speed: z.number().nullable(),

  /**
   * The device id registered in navixy/traccar
   */
  gpsDeviceId: z.string().nullable(),
});
export type LocationQueueItem = z.infer<typeof locationQueueItemSchema>;

export const locationQueueSchema = z.array(locationQueueItemSchema);
export type LocationQueue = z.infer<typeof locationQueueSchema>;

export const deviceIdListSchema = z.array(z.string());
export type DeviceIdList = z.infer<typeof deviceIdListSchema>;