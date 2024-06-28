import {
  Box,
  Button,
  Divider,
  FormControl,
  Grid,
  InputLabel,
  List,
  ListItemButton,
  ListItemText,
  MenuItem,
  Pagination,
  Rating,
  Select,
  SelectChangeEvent,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import CalendarMonthRoundedIcon from "@mui/icons-material/CalendarMonthRounded";
import EventBusyRoundedIcon from "@mui/icons-material/EventBusyRounded";
import ErrorIcon from "@mui/icons-material/Error";
import React, { useEffect, useState } from "react";
import "./grading_page.css";
import EventAvailableIcon from "@mui/icons-material/EventAvailable";
import SchoolIcon from "@mui/icons-material/School";
import api from "../../api";
import {
  Submission,
  Task,
  classes,
  Graded as GradedType,
} from "../../models/Tasks_model";
import Graded_List from "./Graded_List";

function Grading_Page() {
  const [classId, setClassId] = useState<string>("");
  const [tasksData, setTasks] = useState<Task[]>([]);
  const [classesData, setClasses] = useState<classes[]>([]);
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [graded, setGraded] = useState<GradedType[]>([]);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [rating, setRating] = React.useState<number | null>(null);
  const [remarks, setRemarks] = React.useState("");
  const [paginationCount, setPaginationCount] = useState<number>(1);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const submissionsPerPage = 1;

  useEffect(() => {
    getClasses();
  }, []);

  useEffect(() => {
    if (classId) {
      getTask();
      getGraded();
    }
  }, [classId]);

  useEffect(() => {
    if (selectedTask) {
      getSubmissions(selectedTask.task_id);
      getSubmissionsCount(selectedTask.task_id);
    }
  }, [selectedTask]);

  const getClasses = () => {
    api
      .get("/users/classes/")
      .then((res) => res.data)
      .then((data) => {
        setClasses(data);
      })
      .catch((err) => alert(err));
  };

  const getTask = () => {
    api
      .get("/api/tasks/")
      .then((res) => res.data)
      .then((data) => setTasks(data))
      .catch((err) => alert(err));
  };

  const getGraded = () => {
    api
      .get("/api/graded-submissions/")
      .then((res) => res.data)
      .then((data) => setGraded(data))
      .catch((err) => alert(err));
  };

  const getSubmissions = (taskId: string) => {
    api
      .get(`/api/submissions/?task_id=${taskId}`)
      .then((res) => res.data)
      .then((data) => {
        setSubmissions(data);
      })
      .catch((err) => alert(err));
  };

  const getSubmissionsCount = (taskId: string) => {
    api
      .get(`/api/submissions/?task_id=${taskId}`)
      .then((res) => res.data.length)
      .then((count) =>
        setPaginationCount(Math.ceil(count / submissionsPerPage))
      )
      .catch((err) => alert(err));
  };

  const getStudentId = (submission: Submission | undefined): any => {
    if (submission) {
      return submission.student;
    }
    return "No submissions yet";
  };

  const getSubmissionDate = (submission: Submission | undefined): string => {
    if (submission) {
      return submission.submission_date.toLocaleDateString();
    }
    return "No submissions yet";
  };

  const getSubmissionAnswer = (submission: Submission | undefined): string => {
    if (submission) {
      return submission.answer || "No answer provided";
    }
    return "No submissions yet";
  };

  const createGrade = () => {
    if (!selectedTask) return null;

    const taskSubmissions = submittedTasks.filter(
      (sub) => sub.task_id === selectedTask.task_id
    );

    const startIndex = (currentPage - 1) * submissionsPerPage;
    const paginatedSubmissions = taskSubmissions.slice(
      startIndex,
      startIndex + submissionsPerPage
    );

    const gradedDetails = paginatedSubmissions.map(async (submission) => {
      const payload = {
        submission_name: selectedTask.name,
        submission_date: submission.submission_date.toISOString().split("T")[0],
        submission_start_date: selectedTask.start_date
          .toISOString()
          .split("T")[0],
        submission_due_date: selectedTask.due_date.toISOString().split("T")[0],
        student: submission.student,
        ratings: rating,
        remarks: remarks,
        task_id: selectedTask.task_id,
      };

      console.log("Submitting grading:", payload);

      try {
        await api.post("/api/graded-submissions/", payload);

        //await api.delete(`api/submissions/delete/${submission.id}/`);
        //console.log(`Deleted submission with ID: ${submission.id}`);

        window.location.reload();
      } catch (err) {
        console.error("Failed to submit grading or delete submission:", err);
        alert(err);
      }
    });

    Promise.all(gradedDetails).then(() => {
      console.log("All gradings submitted successfully");
    });
  };

  const handleChange = (event: SelectChangeEvent) => {
    const selectedClass = classesData.find(
      (cls) => cls.subject === event.target.value
    );
    if (selectedClass) {
      setClassId(selectedClass.id);
    }
  };

  const handleListItemClick = (
    _event: React.MouseEvent<HTMLDivElement, MouseEvent>,
    index: number
  ) => {
    setSelectedIndex(index);
    setSelectedTask(filteredTasks[index]);
    setCurrentPage(1);
    setRating(null);
    setRemarks("");
  };

  const isConfirmEnabled = rating !== null && remarks.trim() !== "";

  const filteredTasks = tasksData
    .filter((task) => task.class_id === classId)
    .map((task) => ({
      ...task,
      start_date: new Date(task.start_date),
      due_date: new Date(task.due_date),
    }));

  const submittedTasks = submissions.map((submission) => ({
    ...submission,
    submission_date: new Date(submission.submission_date),
    student: submission.student,
  }));

  const renderSubmissionDetails = () => {
    if (!selectedTask) return null;

    const taskSubmissions = submittedTasks.filter(
      (sub) => sub.task_id === selectedTask.task_id
    );

    const startIndex = (currentPage - 1) * submissionsPerPage;
    const paginatedSubmissions = taskSubmissions.slice(
      startIndex,
      startIndex + submissionsPerPage
    );

    return paginatedSubmissions.map((submission, index) => (
      <div key={index}>
        <Box className="SubmissionAnswer" sx={{ p: 2 }}>
          <Divider sx={{ my: 2 }} />
          <Stack
            direction="row"
            spacing={1}
            divider={<Divider orientation="vertical" flexItem />}
            sx={{ alignItems: "center" }}
          >
            <SchoolIcon sx={{ fontSize: "1.2rem" }} />
            <Typography variant="body2">
              ID: {getStudentId(submission)}
            </Typography>
            <EventAvailableIcon sx={{ fontSize: "1.2rem" }} />
            <Typography variant="body2">
              Submitted on: {getSubmissionDate(submission)}
            </Typography>
          </Stack>
          <Divider sx={{ my: 2 }} />
          <Typography
            variant="body1"
            sx={{
              color: "#000000",
              whiteSpace: "pre-wrap",
              wordBreak: "break-word",
              overflow: "hidden",
              textOverflow: "ellipsis",
              maxWidth: "600",
            }}
          >
            Submitted answer: {getSubmissionAnswer(submission)}
          </Typography>
          <Divider sx={{ my: 2 }} />
        </Box>
        <Divider sx={{ mb: 2, borderColor: "#033f63", borderWidth: 1 }} />
        <form onSubmit={handleFormSubmit}>
          <Typography
            sx={{
              fontSize: "1rem",
              color: "#5F8575",
              display: "flex",
              alignItems: "center",
              fontStyle: "italic",
              ml: 2,
              mt: 5,
            }}
          >
            Give a rating and remarks to complete the grading! (Maximum of 100
            words)
          </Typography>
          <Box className="GradingInput">
            <FormControl fullWidth sx={{ m: 1 }}>
              <TextField
                id="remarks"
                label="Remarks"
                multiline
                maxRows={5}
                value={remarks}
                onChange={(e) => {
                  if (e.target.value.length <= 100) {
                    setRemarks(e.target.value);
                  }
                }}
              />
            </FormControl>
            <Stack
              direction="row"
              spacing={2}
              divider={<Divider orientation="vertical" flexItem />}
              sx={{ justifyContent: "right", mt: 2 }}
            >
              <Box>
                <Rating
                  name="simple-controlled"
                  precision={1}
                  value={rating}
                  onChange={(_event, newValue) => {
                    setRating(newValue);
                  }}
                />
              </Box>
              <Button
                type="submit"
                variant="contained"
                disabled={!isConfirmEnabled}
              >
                Submit Grading
              </Button>
            </Stack>
          </Box>
        </form>
      </div>
    ));
  };

  const handleFormSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    createGrade();
  };

  return (
    <>
      <div className="TaskHeaderContent" style={{ marginTop: "50px" }}>
        <h1 className="header">Grading</h1>
        <FormControl>
          <InputLabel id="class-select-label">Class</InputLabel>
          <Select
            labelId="class-select-label"
            id="class-select"
            value={classId}
            label="Class"
            sx={{ width: 120 }}
            onChange={handleChange}
          >
            {Array.from(new Set(classesData.map((cls) => cls.subject))).map(
              (subject) => (
                <MenuItem key={subject} value={subject}>
                  {subject}
                </MenuItem>
              )
            )}
          </Select>
        </FormControl>
      </div>
      <Divider />
      <br />
      <br />

      <Grid
        container
        sx={{
          justifyContent: "center",
        }}
      >
        <Grid item xs={2} className="GradingPending">
          <Stack direction="column" spacing={1} className="GradingHeader">
            <Typography sx={{ fontSize: "1.2rem" }}>
              Tasks ready for grading
            </Typography>
            <Typography sx={{ fontSize: "0.6rem" }}>
              {filteredTasks.length} active tasks...
            </Typography>
          </Stack>
          <Box>
            {filteredTasks.length > 0 ? (
              <List className="GradingLists">
                {filteredTasks.map((task, index) => (
                  <ListItemButton
                    key={task.task_id}
                    selected={selectedIndex === index}
                    onClick={(event) => handleListItemClick(event, index)}
                    className={
                      selectedIndex === index
                        ? "GradingSelected"
                        : "GradingListItem"
                    }
                  >
                    <ListItemText
                      primary={
                        <React.Fragment>
                          <Typography
                            sx={{ fontSize: "1rem", alignContent: "center" }}
                          >
                            {task.name}
                          </Typography>
                        </React.Fragment>
                      }
                      secondary={
                        <React.Fragment>
                          <Divider sx={{ mt: 1, mb: 1 }} />

                          <Stack
                            direction="row"
                            spacing={1}
                            divider={
                              <Divider orientation="vertical" flexItem />
                            }
                            sx={{ alignItems: "center" }}
                          >
                            <CalendarMonthRoundedIcon
                              sx={{ fontSize: "1.2rem" }}
                            />
                            <Typography sx={{ fontSize: "0.8rem" }}>
                              {task.start_date.toLocaleDateString()}
                            </Typography>
                            <EventBusyRoundedIcon sx={{ fontSize: "1.2rem" }} />
                            <Typography sx={{ fontSize: "0.8rem" }}>
                              {task.due_date.toLocaleDateString()}
                            </Typography>
                          </Stack>
                        </React.Fragment>
                      }
                    />
                  </ListItemButton>
                ))}
              </List>
            ) : (
              <Typography
                sx={{
                  fontSize: "1rem",
                  color: "#5F8575",
                  textAlign: "center",
                  mt: 2,
                  p: 5,
                }}
              >
                Class has no active tasks or choose a class on the top right to
                start!
              </Typography>
            )}
          </Box>
        </Grid>

        <Divider orientation="vertical" flexItem />

        <Grid item xs={6} className="GradingMain">
          {selectedTask ? (
            <>
              <Box className="GradingTitle">
                <Stack direction="column" spacing={1} divider={<Divider />}>
                  <Stack
                    direction="row"
                    spacing={1}
                    divider={<Divider orientation="vertical" flexItem />}
                    sx={{ alignItems: "center" }}
                  >
                    <Typography sx={{ fontSize: "2rem", flexGrow: 1 }}>
                      {selectedTask.name}
                    </Typography>
                    <Pagination
                      count={paginationCount}
                      page={currentPage}
                      onChange={(_event, value) => setCurrentPage(value)}
                      variant="outlined"
                    />
                  </Stack>
                  <Stack
                    direction="row"
                    spacing={1}
                    divider={<Divider orientation="vertical" flexItem />}
                    sx={{ alignItems: "center" }}
                  >
                    <CalendarMonthRoundedIcon sx={{ fontSize: "1.2rem" }} />
                    <Typography sx={{ fontSize: "0.8rem" }}>
                      {selectedTask.start_date.toLocaleDateString()}
                    </Typography>

                    <EventBusyRoundedIcon sx={{ fontSize: "1.2rem" }} />
                    <Typography sx={{ fontSize: "0.8rem" }}>
                      {selectedTask.due_date.toLocaleDateString()}
                    </Typography>
                  </Stack>
                </Stack>
              </Box>

              {selectedTask?.subtasks.map((subTask, index) => (
                <Box sx={{ background: "#e8ecec" }}>
                  <Typography
                    key={index}
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      color: "#033f63",
                      p: 2,
                      fontSize: "1rem",
                      fontWeight: "bold",
                    }}
                  >
                    {index + 1}. {subTask.title}
                  </Typography>
                  <Divider sx={{ mb: 1 }} />
                  <Typography
                    sx={{
                      fontSize: "0.8rem",
                      textAlign: "left",
                      color: "#033f63",
                      p: 2,
                    }}
                  >
                    {subTask.description}
                  </Typography>
                </Box>
              ))}
              <Divider sx={{ mb: 2, borderColor: "#033f63", borderWidth: 1 }} />
              <Box>{renderSubmissionDetails()}</Box>
            </>
          ) : (
            <>
              <ErrorIcon
                sx={{
                  fontSize: "2rem",
                  mt: 20,
                  alignContent: "center",
                  alignItems: "center",
                  justifyContent: "center",
                  justifyItems: "center",
                  color: "#033f63",
                }}
              />
              <Typography
                sx={{
                  display: "float",
                  alignItems: "center",
                  color: "#033f63",
                  p: 2,
                  fontSize: "1.5rem",
                  fontWeight: "bold",
                }}
              >
                Select a task to view submissions
              </Typography>
            </>
          )}
        </Grid>

        <Grid item xs={2} className="Graded">
          <Stack direction="column" spacing={1} className="GradedHeader">
            <Typography sx={{ fontSize: "1.2rem" }}>Graded tasks</Typography>
            <Typography sx={{ fontSize: "0.6rem" }}>
              {graded.length} total tasks graded...
            </Typography>
          </Stack>
          <Box sx={{ p: 2 }}>
            {graded.length > 0 ? (
              graded.map((task) => <Graded_List key={task.id} tasks={task} />)
            ) : (
              <Typography
                sx={{
                  fontSize: "1rem",
                  color: "#5F8575",
                  textAlign: "center",
                  mt: 2,
                }}
              >
                No graded tasks. Let's start grading!
              </Typography>
            )}
          </Box>
        </Grid>
      </Grid>
    </>
  );
}

export default Grading_Page;
