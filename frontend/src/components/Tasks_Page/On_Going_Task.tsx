import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Button,
  Divider,
  LinearProgress,
  LinearProgressProps,
  Stack,
  Switch,
  Typography,
  CircularProgress,
  TextField,
  Modal,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMoreRounded";
import CalendarMonthRoundedIcon from "@mui/icons-material/CalendarMonthRounded";
import EventBusyRoundedIcon from "@mui/icons-material/EventBusyRounded";
import CenterFocusWeakIcon from "@mui/icons-material/CenterFocusWeak";
import DeleteIcon from "@mui/icons-material/Delete";
import { SubTask, Task } from "../../models/Tasks_model";
import { useEffect, useState } from "react";
import FileDownloadButton from "./download";
import RestartAltIcon from "@mui/icons-material/RestartAlt";
import api from "../../api";
import { Document, Page, pdfjs } from "react-pdf";
import React from "react";

pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  "pdfjs-dist/build/pdf.worker.min.mjs",
  import.meta.url
).toString();

interface TaskProps {
  tasks: Task;
  status: string;
}

function LinearProgressWithLabel(
  props: LinearProgressProps & {
    value: number;
    start_date: Date;
    due_date: Date;
  }
) {
  const { value, start_date, due_date, ...rest } = props;
  const currentDate = new Date();
  const dueDate = new Date(due_date);
  const startDate = new Date(start_date);
  const totalDuration = dueDate.getTime() - startDate.getTime();
  const elapsedDuration = currentDate.getTime() - startDate.getTime();
  let progress = (elapsedDuration / totalDuration) * 100;

  progress = Math.min(progress, 100);

  let color_progress: LinearProgressProps["color"] = "primary";
  if (currentDate > dueDate) {
    color_progress = "error";
    progress = 100;
  }

  return (
    <Box sx={{ display: "flex", alignItems: "center" }}>
      <Box sx={{ width: "100%", mt: 1 }}>
        <LinearProgress
          variant="determinate"
          value={progress}
          color={color_progress}
          {...rest}
        />
      </Box>
    </Box>
  );
}

const Calculate_Progress = (subtasks: SubTask[]): number => {
  const completedSubTasks = subtasks.filter((task) => task.completed);
  return (completedSubTasks.length / subtasks.length) * 100;
};

const On_Going_Task: React.FC<TaskProps> = ({ tasks, status }) => {
  const { name, start_date, due_date, subtasks, file_upload } = tasks;
  const [progress, setProgress] = useState<number>(
    Calculate_Progress(subtasks)
  );

  const [answer, setAnswer] = useState<string>("");

  const handleSwitchToggle = (index: number) => {
    const updatedSubTasks = [...subtasks];
    updatedSubTasks[index].completed = !updatedSubTasks[index].completed;
    const newProgress = Calculate_Progress(updatedSubTasks);
    setProgress(newProgress);
  };

  const [user, setUser] = useState<any>(null);
  useEffect(() => {
    getUser();
  }, []);

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

  const getUser = () => {
    api
      .get("/users/details/")
      .then((res) => {
        setUser(res.data);
      })
      .catch((err) => alert(err));
  };

  const handleDelete = () => {
    if (window.confirm("Are you sure you want to delete this task?")) {
      deleteTask(tasks.task_id);
    }
  };

  const handleSubmit = async () => {
    const submissionData = {
      student: user.id,
      task_id: tasks.task_id,
      answer: answer,
    };

    try {
      await api.post("/api/submissions/", submissionData);
      alert("Submission successful!");
      window.location.reload();
    } catch (error) {
      console.error("Error submitting:", error);
    }
  };

  const [numPages, setNumPages] = useState<number | null>(null);
  const [pageNumber, setPageNumber] = useState<number>(1);

  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const onDocumentLoadSuccess = ({ numPages }: { numPages: number }) => {
    setNumPages(numPages);
  };

  return (
    <Box className="entryTasks">
      <Stack
        direction="row"
        spacing={1}
        divider={<Divider orientation="vertical" flexItem />}
      >
        {progress === 0 ? (
          <RestartAltIcon sx={{ fontSize: "30px", color: "#7c9885" }} />
        ) : (
          <CircularProgress
            variant="determinate"
            value={progress}
            size="30px"
            sx={{
              color: "#7c9885",
            }}
          />
        )}
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
        <Accordion key={index} sx={{ mt: 1, mb: 1 }}>
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls={`task-name-${index}`}
            id={`task-name-${index}`}
          >
            <Typography
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              {task.title}{" "}
              {status === "Student" && (
                <>
                  <Switch
                    color="success"
                    checked={task.completed}
                    onChange={() => handleSwitchToggle(index)}
                  />

                  <Typography
                    sx={{
                      fontSize: "0.5rem",
                      color: "#5F8575",
                      display: "flex",
                    }}
                  >
                    Mark as Completed!
                  </Typography>
                </>
              )}
            </Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Typography
              sx={{
                fontSize: "1rem",
                textAlign: "left",
                color: "#000000",
                mb: 1,
              }}
            >
              {task.description}
            </Typography>
            <Stack
              direction="row"
              spacing={0.5}
              divider={<Divider orientation="vertical" flexItem />}
            >
              {task.file_upload && <FileDownloadButton fileId={task.id} />}
            </Stack>
          </AccordionDetails>
        </Accordion>
      ))}
      {status === "Student" && (
        <>
          <Divider sx={{ mt: 1, mb: 1 }} />
          <TextField
            id="task_answer"
            label="Answer Here"
            required
            multiline
            rows={4}
            value={answer}
            sx={{ width: "100%", mt: 1, mb: 1 }}
            onChange={(e) => setAnswer(e.target.value)}
          />
        </>
      )}
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

      <LinearProgressWithLabel
        value={progress}
        start_date={start_date}
        due_date={due_date}
      />

      {status === "Student" && (
        <>
          <Divider sx={{ mt: 1, mb: 1 }} />
          <Button
            variant="contained"
            disabled={progress !== 100 || answer.trim() === ""}
            onClick={handleSubmit}
          >
            Submit
          </Button>
        </>
      )}

      {file_upload && (
        <>
          <Button onClick={handleOpen} size="small" sx={{ mt: 2, mb: 1 }}>
            <CenterFocusWeakIcon sx={{ mr: 1 }} />
            Attachment
          </Button>
          <Modal
            open={open}
            onClose={handleClose}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
          >
            <Box
              sx={{
                position: "absolute" as "absolute",
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
                minwidth: 600,
                bgcolor: "background.paper",
                border: "2px solid #000",
                boxShadow: 24,
                p: 4,
              }}
            >
              <Document
                file={file_upload}
                onLoadSuccess={onDocumentLoadSuccess}
                renderMode="canvas"
              >
                <Page
                  pageNumber={pageNumber}
                  renderTextLayer={false}
                  renderAnnotationLayer={false}
                />
              </Document>
              <Typography sx={{ color: "#7c9885" }}>
                Page {pageNumber} of {numPages}
              </Typography>
              <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                <Button
                  disabled={pageNumber <= 1}
                  onClick={() => setPageNumber(pageNumber - 1)}
                >
                  Previous
                </Button>
                <Button
                  disabled={pageNumber >= (numPages || 0)}
                  onClick={() => setPageNumber(pageNumber + 1)}
                >
                  Next
                </Button>
              </Box>
            </Box>
          </Modal>
        </>
      )}
    </Box>
  );
};

export default On_Going_Task;
