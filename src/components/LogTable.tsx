import {
  Chip,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";

import type {
  LogEntry,
  LogSeverity,
} from "../types/log";

interface LogTableProps {
  logs: LogEntry[];
}

function getSeverityColor(
  severity: LogSeverity
):
  | "default"
  | "error"
  | "warning"
  | "info"
  | "success" {
  switch (severity) {
    case "ERROR":
      return "error";

    case "WARNING":
      return "warning";

    case "INFO":
      return "info";

    case "DEBUG":
      return "default";
  }
}

function formatTimestamp(
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

  return date.toLocaleString();
}

export default function LogTable({
  logs,
}: LogTableProps) {
  if (logs.length === 0) {
    return (
      <Paper
        variant="outlined"
        sx={{
          p: 4,
          borderRadius: 3,
          textAlign: "center",
        }}
      >
        <Typography
          color="text.secondary"
        >
          No logs match the current filters.
        </Typography>
      </Paper>
    );
  }

  return (
    <TableContainer
      component={Paper}
      variant="outlined"
      sx={{
        borderRadius: 3,
      }}
    >
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>
              Timestamp
            </TableCell>

            <TableCell>
              Service
            </TableCell>

            <TableCell>
              Severity
            </TableCell>

            <TableCell>
              Message
            </TableCell>
          </TableRow>
        </TableHead>

        <TableBody>
          {logs.map(
            (log) => (
              <TableRow
                key={log.id}
                hover
              >
                <TableCell
                  sx={{
                    whiteSpace:
                      "nowrap",
                  }}
                >
                  {formatTimestamp(
                    log.timestamp
                  )}
                </TableCell>

                <TableCell>
                  {log.service}
                </TableCell>

                <TableCell>
                  <Chip
                    label={
                      log.severity
                    }
                    color={getSeverityColor(
                      log.severity
                    )}
                    size="small"
                    variant="outlined"
                  />
                </TableCell>

                <TableCell>
                  {log.message}
                </TableCell>
              </TableRow>
            )
          )}
        </TableBody>
      </Table>
    </TableContainer>
  );
}