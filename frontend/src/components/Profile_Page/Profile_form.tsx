import { Typography, Box, Divider, TextField, Button } from "@mui/material";

const EditInfo = ({ info, data }: { info: string; data: string }) => {
  return (
    <Box className="modalStyle">
      <Typography
        id="modal-modal-title"
        variant="h6"
        component="h2"
        sx={{ fontWeight: "bold" }}
      >
        Currently editing your {data}
      </Typography>
      <Divider />
      <TextField
        id="task_name"
        label="Enter a new value"
        variant="outlined"
        value={info}
        sx={{ mb: 2, mt: 2 }}
      />
      <Button
        variant="contained"
        sx={{ justifyContent: "center", width: "25%", margin: "auto" }}
      >
        Confirm
      </Button>
    </Box>
  );
};

export default EditInfo;
