import { Box, Button, Divider, Stack, Typography } from "@mui/material";
import CalendarMonthRoundedIcon from "@mui/icons-material/CalendarMonthRounded";
import EventBusyRoundedIcon from "@mui/icons-material/EventBusyRounded";
import CheckCircleRoundedIcon from "@mui/icons-material/CheckCircleRounded";
import DeleteIcon from "@mui/icons-material/Delete";
import { Submission } from "../../models/Tasks_model";
import api from "../../api";

interface TaskProps {
  submited: Submission;
  status: string;
}

const deleteTask = (id: any) => {
  api
    .delete(`/api/tasks/delete/${id}/`)
    .then((res) => {
      if (res.status === 204) {
        alert("Task deleted!");
        window.location.reload();
      } else alert("Failed to delete task.");
    })
    .catch((error) => alert(error));
};

const Completed_Task: React.FC<TaskProps> = ({ submited, status }) => {
  const { name, start_date, due_date, submission_date, task_id } = submited;

  const handleDelete = () => {
    if (window.confirm("Are you sure you want to delete this task?")) {
      deleteTask(task_id);
    }
  };

  return (
    <Box className="entryTasks">
      <Stack
        direction="row"
        spacing={1}
        divider={<Divider orientation="vertical" flexItem />}
      >
        <CheckCircleRoundedIcon
          sx={{
            fontSize: "1.875rem",
            color: "#7c9885",
          }}
        />
        <Stack
          direction={"row"}
          spacing={1}
          divider={<Divider orientation="horizontal" flexItem />}
        >
          <Typography sx={{ fontSize: "1rem", alignContent: "center" }}>
            {name}
          </Typography>
          {status === "Teacher" && (
            <Button sx={{ margin: "auto" }} onClick={handleDelete}>
              <DeleteIcon color="error" />
            </Button>
          )}
        </Stack>
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
          {new Date(start_date).toLocaleDateString()}
        </Typography>
        <EventBusyRoundedIcon sx={{ fontSize: "1.2rem" }} />
        <Typography sx={{ fontSize: "0.8rem" }}>
          {new Date(due_date).toLocaleDateString()}
        </Typography>
      </Stack>
      <Divider orientation="horizontal" flexItem />
      <Stack direction="row" spacing={1} sx={{ alignItems: "center", mt: 1 }}>
        {submission_date ? (
          <Typography sx={{ fontSize: "0.8rem" }}>
            Submitted on {new Date(submission_date).toLocaleDateString()}
          </Typography>
        ) : (
          <Typography sx={{ fontSize: "0.8rem", color: "red" }}>
            Due date expired
          </Typography>
        )}
      </Stack>
    </Box>
  );
};

export default Completed_Task;
