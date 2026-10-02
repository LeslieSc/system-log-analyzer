import {
  Button,
  Box,
} from "@mui/material";

interface FileUploadProps {
  onFileSelected: (
    file: File
  ) => void;

  onLoadSample: () => void;
}

export default function FileUpload({
  onFileSelected,
  onLoadSample,
}: FileUploadProps) {
  const handleFileChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file =
      event.target.files?.[0];

    if (file) {
      onFileSelected(file);
    }

    event.target.value = "";
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: {
          xs: "column",
          sm: "row",
        },
        gap: 2,
      }}
    >
      <Button
        variant="contained"
        component="label"
      >
        Upload CSV

        <input
          hidden
          type="file"
          accept=".csv,text/csv"
          onChange={
            handleFileChange
          }
        />
      </Button>

      <Button
        variant="outlined"
        onClick={
          onLoadSample
        }
      >
        Load Sample Data
      </Button>
    </Box>
  );
}