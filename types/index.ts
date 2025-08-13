export type AuthProps = {
  authed: boolean;
  username: string;
  displayName: string;
};

export type ScheduleItem = {
  description: string;
  duration?: number; // in minutes
  startTime?: number;
  endTime?: number;
  isTask?: boolean;
  isCompleted?: boolean;
};
