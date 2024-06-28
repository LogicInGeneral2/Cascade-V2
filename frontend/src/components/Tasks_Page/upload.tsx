import { ChangeEvent, useState } from "react";
import Button from "@mui/material/Button";
import UploadIcon from "@mui/icons-material/Upload";
import { Typography } from "@mui/material";

interface InputFileUploadProps {
  onFileChange: (file: File) => void;
}

const InputFileUpload: React.FC<InputFileUploadProps> = ({ onFileChange }) => {
  const [, setFile] = useState<File | null>(null);
  const [fileName, setFileName] = useState<string>("");

  const handleFileUpload = (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      const uploadedFile = event.target.files[0];
      setFile(uploadedFile);
      setFileName(uploadedFile.name);
      onFileChange(uploadedFile);
    }
  };

  return (
    <>
      <Button component="label" variant="outlined" startIcon={<UploadIcon />}>
        Upload
        <input type="file" hidden onChange={handleFileUpload} />
      </Button>
      {fileName && (
        <Typography sx={{ ml: 2, mt: 1, fontSize: "0.9rem" }}>
          Selected file: {fileName}
        </Typography>
      )}
    </>
  );
};

export default InputFileUpload;
