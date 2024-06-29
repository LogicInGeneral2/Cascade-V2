import React from "react";
import { Button } from "@mui/material";
import GetAppIcon from "@mui/icons-material/GetApp";

interface FileDownloadButtonProps {
  fileId: String;
}

const FileDownloadButton: React.FC<FileDownloadButtonProps> = ({ fileId }) => {
  const handleDownload = () => {
    const fileUrl = `http://127.0.0.1:8000/api/download/${fileId}/`; // Full URL including base path
    const anchor = document.createElement("a");
    anchor.href = fileUrl;
    anchor.download = ""; // Let the server handle the file name
    document.body.appendChild(anchor);
    anchor.click();
    document.body.removeChild(anchor);
  };

  return (
    <Button
      component="label"
      role={undefined}
      tabIndex={-1}
      variant="outlined"
      onClick={handleDownload}
      sx={{ p: 1, minWidth: "unset" }}
    >
      <GetAppIcon sx={{ mr: 1 }} />
      Download File
    </Button>
  );
};

export default FileDownloadButton;
