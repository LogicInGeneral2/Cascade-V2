import { Box, Divider, Stack, Typography } from "@mui/material";
import OfflinePinRoundedIcon from "@mui/icons-material/OfflinePinRounded";
import Rating from "@mui/material/Rating";
import { Graded as GradedType } from "../../models/Tasks_model";
import CalendarMonthRoundedIcon from "@mui/icons-material/CalendarMonthRounded";
import EventBusyRoundedIcon from "@mui/icons-material/EventBusyRounded";

interface TaskProps {
  tasks: GradedType;
}

const Graded_Task: React.FC<TaskProps> = ({ tasks }) => {
  return (
    <Box className="entryTasks">
      <Stack
        direction="row"
        spacing={1}
        divider={<Divider orientation="vertical" flexItem />}
      >
        <OfflinePinRoundedIcon
          sx={{
            fontSize: "1.875rem",
            color: "#7c9885",
          }}
        />
        <Typography sx={{ fontSize: "1rem", alignContent: "center" }}>
          {tasks.submission_name}
        </Typography>
      </Stack>
      <Divider sx={{ mt: 1, mb: 1 }} />
      <Stack
        direction="row"
        spacing={1}
        divider={<Divider orientation="vertical" flexItem />}
        sx={{ alignItems: "center", mb: 1, mt: 1 }}
      >
        <CalendarMonthRoundedIcon sx={{ fontSize: "1.2rem" }} />
        <Typography sx={{ fontSize: "0.8rem" }}>
          {new Date(tasks.submission_start_date).toLocaleDateString()}
        </Typography>
        <EventBusyRoundedIcon sx={{ fontSize: "1.2rem" }} />
        <Typography sx={{ fontSize: "0.8rem" }}>
          {new Date(tasks.submission_due_date).toLocaleDateString()}
        </Typography>
      </Stack>
      <Divider sx={{ mt: 1, mb: 1 }} />
      <Typography
        sx={{ fontSize: "1rem", textAlign: "left", color: "#000000" }}
      >
        Remarks: {tasks.remarks}
      </Typography>
      <Divider sx={{ mt: 1, mb: 1 }} />
      <Typography
        sx={{ fontSize: "0.8rem", textAlign: "left", color: "#033f63" }}
      >
        Submitted on: {new Date(tasks.submission_date).toLocaleDateString()}
      </Typography>
      <Divider sx={{ mt: 1, mb: 1 }} />
      <Typography
        sx={{ fontSize: "0.8rem", textAlign: "left", color: "#033f63" }}
      >
        Graded on: {new Date(tasks.graded_date).toLocaleDateString()}
      </Typography>
      <Divider sx={{ mt: 1, mb: 1 }} />
      <Stack
        direction="column"
        spacing={1}
        divider={<Divider orientation="vertical" flexItem />}
      >
        <Rating name="read-only" value={tasks.ratings} readOnly />
      </Stack>
    </Box>
  );
};

export default Graded_Task;
