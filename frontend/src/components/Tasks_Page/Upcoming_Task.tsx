import {
  Accordion,
  AccordionSummary,
  Box,
  Button,
  Divider,
  Stack,
  Typography,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMoreRounded";
import CalendarMonthRoundedIcon from "@mui/icons-material/CalendarMonthRounded";
import EventBusyRoundedIcon from "@mui/icons-material/EventBusyRounded";
import BrowseGalleryRoundedIcon from "@mui/icons-material/BrowseGalleryRounded";
import DeleteIcon from "@mui/icons-material/Delete";
import { Task } from "../../models/Tasks_model";
import api from "../../api";

interface TaskProps {
  tasks: Task;
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

const Upcoming_Task: React.FC<TaskProps> = ({ tasks, status }) => {
  const { name, start_date, due_date, subtasks, task_id } = tasks;

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
        <BrowseGalleryRoundedIcon
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
      {subtasks.map((task, index) => (
        <Accordion key={index} disabled sx={{ mt: 1, mb: 1 }}>
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls={`task-name-${index}`}
            id={`task-name-${index}`}
          >
            <Typography>{task.title}</Typography>
          </AccordionSummary>
        </Accordion>
      ))}
      <Divider sx={{ mt: 1, mb: 1 }} />
      <Stack
        direction="row"
        spacing={1}
        divider={<Divider orientation="vertical" flexItem />}
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
    </Box>
  );
};

export default Upcoming_Task;
