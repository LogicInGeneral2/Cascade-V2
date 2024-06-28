import { Box, Divider, Stack, Typography } from "@mui/material";
import OfflinePinRoundedIcon from "@mui/icons-material/OfflinePinRounded";
import Rating from "@mui/material/Rating";
import { Graded as GradedType } from "../../models/Tasks_model";

interface TaskProps {
  tasks: GradedType;
}

const Graded_List: React.FC<TaskProps> = ({ tasks }) => {
  return (
    <Box className="entryTasks" sx={{ mb: 1 }}>
      <Stack
        direction="row"
        spacing={1}
        divider={<Divider orientation="vertical" flexItem />}
      >
        <OfflinePinRoundedIcon
          sx={{
            fontSize: "1.5rem",
            color: "#7c9885",
          }}
        />
        <Typography sx={{ fontSize: "0.65rem", alignContent: "center" }}>
          <Rating name="read-only" value={tasks.ratings} readOnly />
        </Typography>
        <Typography
          sx={{
            fontSize: "0.75rem",
            textAlign: "left",
            color: "#033f63",
            alignContent: "center",
            fontWeight: "bold",
          }}
        >
          {new Date(tasks.graded_date).toLocaleDateString()}
        </Typography>
      </Stack>
      <Divider sx={{ mt: 1, mb: 1 }} />
      <Typography
        sx={{ fontSize: "0.75rem", textAlign: "left", color: "#000000" }}
      >
        Remarks: {tasks.remarks}
      </Typography>
    </Box>
  );
};

export default Graded_List;
