export type LogSeverity =
  | "INFO"
  | "WARNING"
  | "ERROR"
  | "DEBUG";

export interface LogEntry {
  id: string;
  timestamp: string;
  service: string;
  severity: LogSeverity;
  message: string;
}