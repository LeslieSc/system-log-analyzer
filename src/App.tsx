import {
  Alert,
  AppBar,
  Box,
  Button,
  Container,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  TextField,
  Toolbar,
  Typography,
} from "@mui/material";

import Papa from "papaparse";

import {
  useMemo,
  useState,
} from "react";

import ActivityChart from "./components/ActivityChart";
import FileUpload from "./components/FileUpload";
import LogChart from "./components/LogChart";
import LogTable from "./components/LogTable";
import StatCard from "./components/StatCard";

import type {
  LogEntry,
  LogSeverity,
} from "./types/log";

interface RawLog {
  timestamp?: string;
  service?: string;
  severity?: string;
  message?: string;
}

const validSeverities: LogSeverity[] = [
  "INFO",
  "WARNING",
  "ERROR",
  "DEBUG",
];

function parseLogs(
  csvText: string
): LogEntry[] {
  const result =
    Papa.parse<RawLog>(
      csvText,
      {
        header: true,
        skipEmptyLines: true,
      }
    );

  return result.data
    .map(
      (
        row,
        index
      ): LogEntry | null => {
        const timestamp =
          row.timestamp?.trim();

        const service =
          row.service?.trim();

        const message =
          row.message?.trim();

        const severity =
          row.severity
            ?.trim()
            .toUpperCase();

        if (
          !timestamp ||
          !service ||
          !message ||
          !severity ||
          !validSeverities.includes(
            severity as LogSeverity
          )
        ) {
          return null;
        }

        return {
          id: `${timestamp}-${service}-${index}`,
          timestamp,
          service,
          severity:
            severity as LogSeverity,
          message,
        };
      }
    )
    .filter(
      (
        log
      ): log is LogEntry =>
        log !== null
    );
}

export default function App() {
  const [
    logs,
    setLogs,
  ] = useState<LogEntry[]>([]);

  const [
    search,
    setSearch,
  ] = useState("");

  const [
    severityFilter,
    setSeverityFilter,
  ] = useState<
    LogSeverity | "ALL"
  >("ALL");

  const [
    error,
    setError,
  ] = useState<
    string | null
  >(null);

  const handleFileSelected =
    async (
      file: File
    ) => {
      try {
        setError(null);

        const text =
          await file.text();

        const parsedLogs =
          parseLogs(text);

        if (
          parsedLogs.length ===
          0
        ) {
          setError(
            "No valid log entries were found. Make sure the CSV contains timestamp, service, severity and message columns."
          );

          return;
        }

        setLogs(parsedLogs);
      } catch {
        setError(
          "The file could not be processed."
        );
      }
    };

  const handleLoadSample =
    async () => {
      try {
        setError(null);

        const response =
          await fetch(
            "/sample-logs.csv"
          );

        if (!response.ok) {
          throw new Error(
            "Sample file could not be loaded."
          );
        }

        const text =
          await response.text();

        const parsedLogs =
          parseLogs(text);

        if (
          parsedLogs.length ===
          0
        ) {
          setError(
            "The sample file does not contain valid log entries."
          );

          return;
        }

        setLogs(parsedLogs);
      } catch {
        setError(
          "Sample data could not be loaded."
        );
      }
    };

  const filteredLogs =
    useMemo(() => {
      const normalizedSearch =
        search
          .trim()
          .toLowerCase();

      return logs.filter(
        (log) => {
          const matchesSeverity =
            severityFilter ===
              "ALL" ||
            log.severity ===
              severityFilter;

          const matchesSearch =
            normalizedSearch ===
              "" ||
            log.service
              .toLowerCase()
              .includes(
                normalizedSearch
              ) ||
            log.message
              .toLowerCase()
              .includes(
                normalizedSearch
              );

          return (
            matchesSeverity &&
            matchesSearch
          );
        }
      );
    }, [
      logs,
      search,
      severityFilter,
    ]);

  const errorCount =
    logs.filter(
      (log) =>
        log.severity ===
        "ERROR"
    ).length;

  const warningCount =
    logs.filter(
      (log) =>
        log.severity ===
        "WARNING"
    ).length;

  const serviceCount =
    new Set(
      logs.map(
        (log) =>
          log.service
      )
    ).size;

  const handleClear = () => {
    setLogs([]);
    setSearch("");
    setSeverityFilter(
      "ALL"
    );
    setError(null);
  };

  return (
    <Box
      sx={{
        minHeight:
          "100vh",
        backgroundColor:
          "#f5f7fa",
      }}
    >
      <AppBar
        position="static"
        elevation={0}
      >
        <Toolbar>
          <Typography
            variant="h6"
            sx={{
              fontWeight: 600,
            }}
          >
            System Log Analyzer
          </Typography>
        </Toolbar>
      </AppBar>

      <Container
        maxWidth="xl"
        sx={{
          py: {
            xs: 3,
            md: 5,
          },
        }}
      >
        <Stack
          spacing={4}
        >
          <Box>
            <Typography
              variant="h4"
              sx={{
                fontWeight: 700,
                mb: 1,
              }}
            >
              Log Dashboard
            </Typography>

            <Typography
              color="text.secondary"
            >
              Upload and analyze system log files.
            </Typography>
          </Box>

          <Box
            sx={{
              display: "flex",
              flexDirection: {
                xs: "column",
                md: "row",
              },
              justifyContent:
                "space-between",
              alignItems: {
                xs: "stretch",
                md: "center",
              },
              gap: 2,
            }}
          >
            <FileUpload
              onFileSelected={
                handleFileSelected
              }
              onLoadSample={
                handleLoadSample
              }
            />

            {logs.length >
              0 && (
              <Button
                color="inherit"
                variant="outlined"
                onClick={
                  handleClear
                }
              >
                Clear Data
              </Button>
            )}
          </Box>

          {error && (
            <Alert
              severity="error"
            >
              {error}
            </Alert>
          )}

          <Box
            sx={{
              display:
                "grid",
              gridTemplateColumns: {
                xs: "1fr",
                sm: "repeat(2, 1fr)",
                lg: "repeat(4, 1fr)",
              },
              gap: 2,
            }}
          >
            <StatCard
              title="Total Logs"
              value={
                logs.length
              }
            />

            <StatCard
              title="Errors"
              value={
                errorCount
              }
            />

            <StatCard
              title="Warnings"
              value={
                warningCount
              }
            />

            <StatCard
              title="Services"
              value={
                serviceCount
              }
            />
          </Box>

          {logs.length >
            0 && (
            <Box
              sx={{
                display:
                  "grid",
                gridTemplateColumns: {
                  xs: "1fr",
                  lg: "1fr 1fr",
                },
                gap: 2,
              }}
            >
              <LogChart
                logs={logs}
              />

              <ActivityChart
                logs={logs}
              />
            </Box>
          )}

          <Box>
            <Typography
              variant="h5"
              sx={{
                fontWeight: 600,
                mb: 2,
              }}
            >
              Log Entries
            </Typography>

            <Box
              sx={{
                display:
                  "flex",
                flexDirection: {
                  xs: "column",
                  md: "row",
                },
                gap: 2,
                mb: 2,
              }}
            >
              <TextField
                fullWidth
                label="Search logs"
                placeholder="Search by service or message"
                value={search}
                onChange={(
                  event
                ) =>
                  setSearch(
                    event
                      .target
                      .value
                  )
                }
              />

              <FormControl
                sx={{
                  minWidth: {
                    xs: "100%",
                    md: 200,
                  },
                }}
              >
                <InputLabel>
                  Severity
                </InputLabel>

                <Select
                  value={
                    severityFilter
                  }
                  label="Severity"
                  onChange={(
                    event
                  ) =>
                    setSeverityFilter(
                      event
                        .target
                        .value as
                        | LogSeverity
                        | "ALL"
                    )
                  }
                >
                  <MenuItem
                    value="ALL"
                  >
                    All
                  </MenuItem>

                  <MenuItem
                    value="INFO"
                  >
                    INFO
                  </MenuItem>

                  <MenuItem
                    value="WARNING"
                  >
                    WARNING
                  </MenuItem>

                  <MenuItem
                    value="ERROR"
                  >
                    ERROR
                  </MenuItem>

                  <MenuItem
                    value="DEBUG"
                  >
                    DEBUG
                  </MenuItem>
                </Select>
              </FormControl>
            </Box>

            <LogTable
              logs={
                filteredLogs
              }
            />
          </Box>
        </Stack>
      </Container>
    </Box>
  );
}