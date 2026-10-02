import {
  Card,
  CardContent,
  Typography,
} from "@mui/material";

import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import type {
  LogEntry,
} from "../types/log";

interface ActivityChartProps {
  logs: LogEntry[];
}

function formatTime(
  timestamp: string
) {
  const date =
    new Date(timestamp);

  if (
    Number.isNaN(
      date.getTime()
    )
  ) {
    return timestamp;
  }

  return date.toLocaleTimeString(
    [],
    {
      hour: "2-digit",
      minute: "2-digit",
    }
  );
}

export default function ActivityChart({
  logs,
}: ActivityChartProps) {
  const groupedLogs =
    logs.reduce<
      Record<
        string,
        {
          timestamp: string;
          count: number;
        }
      >
    >(
      (
        accumulator,
        log
      ) => {
        const time =
          formatTime(
            log.timestamp
          );

        if (
          !accumulator[
            time
          ]
        ) {
          accumulator[
            time
          ] = {
            timestamp:
              time,
            count: 0,
          };
        }

        accumulator[
          time
        ].count += 1;

        return accumulator;
      },
      {}
    );

  const data =
    Object.values(
      groupedLogs
    );

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
          Activity Over Time
        </Typography>

        <ResponsiveContainer
          width="100%"
          height={280}
        >
          <LineChart
            data={data}
          >
            <CartesianGrid
              strokeDasharray="3 3"
              vertical={false}
            />

            <XAxis
              dataKey="timestamp"
            />

            <YAxis
              allowDecimals={false}
            />

            <Tooltip />

            <Line
              type="monotone"
              dataKey="count"
              stroke="#1976d2"
              strokeWidth={3}
              dot={{
                r: 4,
              }}
            />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}