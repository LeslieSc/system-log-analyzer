import {
  Card,
  CardContent,
  Typography,
} from "@mui/material";

interface StatCardProps {
  title: string;
  value: number;
}

export default function StatCard({
  title,
  value,
}: StatCardProps) {
  return (
    <Card
      variant="outlined"
      sx={{
        height: "100%",
        borderRadius: 3,
      }}
    >
      <CardContent>
        <Typography
          variant="body2"
          color="text.secondary"
          sx={{ mb: 1 }}
        >
          {title}
        </Typography>

        <Typography
          variant="h4"
          sx={{
            fontWeight: 700,
          }}
        >
          {value}
        </Typography>
      </CardContent>
    </Card>
  );
}