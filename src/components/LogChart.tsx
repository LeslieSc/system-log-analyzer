import {
  Card,
  CardContent,
  Typography,
} from "@mui/material";

import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import type {
  LogEntry,
  LogSeverity,
} from "../types/log";

interface LogChartProps {
  logs: LogEntry[];
}

const severities: LogSeverity[] = [
  "INFO",
  "WARNING",
  "ERROR",
  "DEBUG",
];

export default function LogChart({
  logs,
}: LogChartProps) {
  const data =
    severities.map((severity) => ({
      severity,
      count: logs.filter(
        (log) =>
          log.severity === severity
      ).length,
    }));

  return (
    <Card
      variant="outlined"
      sx={{
        borderRadius: 3,
        height: "100%",
      }}
    >
      <CardContent>
        <Typography
          variant="h6"
          sx={{
            fontWeight: 600,
            mb: 3,
          }}
        >
          Logs by Severity
        </Typography>

        <ResponsiveContainer
          width="100%"
          height={280}
        >
          <BarChart data={data}>
            <CartesianGrid
              strokeDasharray="3 3"
              vertical={false}
            />

            <XAxis
              dataKey="severity"
            />

            <YAxis
              allowDecimals={false}
            />

            <Tooltip />

            <Bar
              dataKey="count"
              fill="#1976d2"
              radius={[
                6,
                6,
                0,
                0,
              ]}
            />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}