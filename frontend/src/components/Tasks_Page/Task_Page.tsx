import { useEffect, useState } from "react";
import {
  Box,
  Button,
  CircularProgress,
  Divider,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Modal,
  Select,
  SelectChangeEvent,
  Stack,
  Typography,
} from "@mui/material";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import ArrowOutwardIcon from "@mui/icons-material/ArrowOutward";
import ErrorIcon from "@mui/icons-material/Error";
import "./task_page.css";
import Upcoming_Task from "./Upcoming_Task";
import On_Going_Task from "./On_Going_Task";
import Completed_Task from "./Completed_Task";
import Graded_Task from "./Graded_Task";
import InsertTasks from "./Tasks_Form";
import Stats_Task from "./Stats_Tasks";
import api from "../../api";
import {
  Task,
  Graded as GradedType,
  Submission,
  classes,
  StatsTaskProps,
} from "../../models/Tasks_model";

function Tasks_Page() {
  const [user, setUser] = useState<any>(null);
  const [tasksData, setTasks] = useState<Task[]>([]);
  const [classId, setClassId] = useState<string>("");
  const [open, setOpen] = useState<boolean>(false);
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [graded, setGraded] = useState<GradedType[]>([]);
  const [classesData, setClasses] = useState<classes[]>([]);
  const [totalStudents, setTotalStudents] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    getUser();
    if (user?.status === "Teacher") {
      getClassesForTeacher();
    } else if (user?.status === "Student") {
      getClassesForStudent();
    }
  }, [user?.status]);

  useEffect(() => {
    if (classId) {
      setLoading(true);
      getTask();
      getSubmissions();
      getGraded();
    }
  }, [classId]);

  const getClassesForTeacher = () => {
    api
      .get("/users/classes/")
      .then((res) => res.data)
      .then((data) => {
        const uniqueClasses = Array.from(
          new Set(data.map((cls: { id: any }) => cls.id))
        ).map((id) => {
          return data.find((cls: { id: unknown }) => cls.id === id);
        });
        setClasses(uniqueClasses);
        calculateTotalStudents(uniqueClasses);
      })
      .catch((err) => alert(err));
  };

  const getClassesForStudent = () => {
    api
      .get("/users/classes/")
      .then((res) => res.data)
      .then((data) => {
        setClasses(data);
        calculateTotalStudents(data);
      })
      .catch((err) => alert(err));
  };

  const getUser = () => {
    api
      .get("/users/details/")
      .then((res) => setUser(res.data))
      .catch((err) => alert(err));
  };

  const getTask = () => {
    api
      .get("/api/tasks/")
      .then((res) => res.data)
      .then((data) => {
        setTasks(data);
        setLoading(false);
      })
      .catch((err) => {
        alert(err);
        setLoading(false);
      });
  };

  const getSubmissions = () => {
    api
      .get("/api/submissions/")
      .then((res) => res.data)
      .then((data) => {
        setSubmissions(data);
        setLoading(false);
      })
      .catch((err) => {
        alert(err);
        setLoading(false);
      });
  };

  const getGraded = () => {
    api
      .get("/api/graded-submissions/")
      .then((res) => res.data)
      .then((data) => {
        const filteredGraded =
          user?.status === "Student"
            ? data.filter((task: { student: any }) => task.student === user.id)
            : data;
        setGraded(filteredGraded);
        setLoading(false);
      })
      .catch((err) => {
        alert(err);
        setLoading(false);
      });
  };

  const handleChange = (event: SelectChangeEvent<string>) => {
    setClassId(event.target.value);
  };

  const calculateTotalStudents = (classesData: classes[]) => {
    const total = classesData.reduce(
      (sum, classData) => sum + (classData.student_count || 0),
      0
    );
    setTotalStudents(total);
  };

  const filteredTasks = tasksData.filter((task) => task.class_id === classId);
  const currentDate = new Date();

  const completedTasksFromSubmissions = submissions.map((submission) => {
    const task = tasksData.find(
      (task) => task.task_id === submission.task_id && task.class_id === classId
    );
    return task
      ? {
          ...submission,
          name: task.name,
          start_date: task.start_date,
          due_date: task.due_date,
        }
      : null;
  });

  const completedTasksFromTasks = tasksData.filter(
    (task) =>
      task.class_id === classId &&
      new Date(task.due_date) < currentDate &&
      !completedTasksFromSubmissions.some(
        (submission) => submission?.task_id === task.task_id
      )
  );

  const completedTasksForTeacher = completedTasksFromTasks.filter(
    (task) => new Date(task.due_date) < currentDate
  );

  const completedTasks =
    user?.status === "Teacher"
      ? [...completedTasksForTeacher]
      : [...completedTasksFromSubmissions, ...completedTasksFromTasks];

  const onGoingTasks = filteredTasks.filter((task) => {
    const taskStartDate = new Date(task.start_date);
    const taskDueDate = new Date(task.due_date);
    return (
      taskStartDate <= currentDate &&
      taskDueDate >= currentDate &&
      !completedTasks.some(
        (completedTask) =>
          completedTask && completedTask.task_id === task.task_id
      )
    );
  });

  const upcomingTasks = filteredTasks.filter(
    (task) => new Date(task.start_date) > currentDate
  );

  const stats: StatsTaskProps = {
    upcoming: upcomingTasks.length,
    ongoing: onGoingTasks.length,
    completed: completedTasks.length,
    graded: graded.length,
    students: totalStudents,
  };

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  return (
    <div style={{ marginTop: "50px" }}>
      <div className="TaskHeaderContent">
        <h1 className="header">Tasks</h1>
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
            {user?.status === "Teacher"
              ? classesData.map((cls) => (
                  <MenuItem key={cls.id} value={cls.id}>
                    {cls.subject}
                  </MenuItem>
                ))
              : classesData.map((cls) => (
                  <MenuItem key={cls.id} value={cls.id}>
                    {cls.subject}
                  </MenuItem>
                ))}
          </Select>
        </FormControl>
      </div>
      <Divider />
      <br />
      <br />
      {classId ? (
        loading ? (
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              height: "100vh",
            }}
          >
            <CircularProgress />
          </Box>
        ) : (
          <Grid container spacing={6} className="mainTasks">
            <Grid item xs={3}>
              <Typography sx={{ fontWeight: "bold", mb: 2 }}>
                UPCOMING
                {user?.status === "Teacher" && (
                  <Button onClick={handleOpen} disabled={!classId}>
                    <AddCircleIcon />
                  </Button>
                )}
              </Typography>
              <Modal
                open={open}
                onClose={handleClose}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
              >
                <InsertTasks classId={classId} />
              </Modal>
              <Stack
                direction="column"
                spacing={1}
                divider={<Divider orientation="vertical" flexItem />}
              >
                {upcomingTasks && upcomingTasks.length > 0 ? (
                  upcomingTasks.map((task: Task) => (
                    <Upcoming_Task
                      key={task.task_id}
                      tasks={task}
                      status={user?.status}
                    />
                  ))
                ) : (
                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      justifyContent: "center",
                      textAlign: "center",
                      gap: "0.5rem",
                      marginTop: "1rem",
                    }}
                  >
                    <ErrorIcon
                      sx={{
                        color: "#7c9885",
                        fontSize: "1.5rem",
                      }}
                    />
                    <Typography
                      sx={{ mb: 2, color: "#7c9885", fontSize: "0.8rem" }}
                    >
                      No upcoming tasks.
                    </Typography>
                  </Box>
                )}
              </Stack>
            </Grid>
            <Grid item xs={3} sx={{ height: "100%", overflow: "auto" }}>
              <Typography sx={{ fontWeight: "bold", mb: 2 }}>
                ON GOING
              </Typography>
              <Divider sx={{ mb: 2 }} />
              <Stack
                direction="column"
                spacing={1}
                divider={<Divider orientation="horizontal" flexItem />}
              >
                {onGoingTasks && onGoingTasks.length > 0 ? (
                  onGoingTasks.map((task: Task) => (
                    <On_Going_Task
                      key={task.task_id}
                      tasks={task}
                      status={user?.status}
                    />
                  ))
                ) : (
                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      justifyContent: "center",
                      textAlign: "center",
                      gap: "0.5rem",
                      marginTop: "1rem",
                    }}
                  >
                    <ErrorIcon
                      sx={{
                        color: "#7c9885",
                        fontSize: "1.5rem",
                      }}
                    />
                    <Typography
                      sx={{ mb: 2, color: "#7c9885", fontSize: "0.8rem" }}
                    >
                      No ongoing tasks.
                    </Typography>
                  </Box>
                )}
              </Stack>
            </Grid>
            <Grid item xs={3}>
              <Typography sx={{ fontWeight: "bold", mb: 2 }}>
                COMPLETED
              </Typography>
              <Divider sx={{ mb: 2 }} />
              <div className="entryList">
                <Stack
                  direction="column"
                  spacing={1}
                  divider={<Divider orientation="horizontal" flexItem />}
                >
                  {completedTasks && completedTasks.length > 0 ? (
                    completedTasks.map((task, index) => (
                      <Completed_Task
                        key={index}
                        submited={task as unknown as Submission}
                        status={user?.status}
                      />
                    ))
                  ) : (
                    <Box
                      sx={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: "0.5rem",
                      }}
                    >
                      <ErrorIcon
                        sx={{
                          color: "#7c9885",
                          fontSize: "1.5rem",
                        }}
                      />
                      <Typography
                        sx={{ fmb: 2, color: "#7c9885", fontSize: "0.8rem" }}
                      >
                        No task are completed yet.
                      </Typography>
                    </Box>
                  )}
                </Stack>
              </div>
            </Grid>
            <Grid item xs={3}>
              {user?.status === "Teacher" && (
                <>
                  <Typography sx={{ fontWeight: "bold", mb: 2 }}>
                    CURRENT STATS
                  </Typography>
                  <Divider sx={{ mb: 2 }} />
                  <Stack
                    direction="column"
                    spacing={1}
                    divider={<Divider orientation="horizontal" flexItem />}
                  >
                    <Stats_Task taskCounts={stats} />
                  </Stack>
                </>
              )}
              {user?.status === "Student" && (
                <>
                  <Typography sx={{ fontWeight: "bold", mb: 2 }}>
                    GRADED
                  </Typography>
                  <Divider sx={{ mb: 2 }} />
                  <Stack
                    direction="column"
                    spacing={1}
                    divider={<Divider orientation="horizontal" flexItem />}
                  >
                    {graded && graded.length > 0 ? (
                      graded.map((gradedTask, index) => (
                        <Graded_Task key={index} tasks={gradedTask} />
                      ))
                    ) : (
                      <Box
                        sx={{
                          display: "flex",
                          flexDirection: "column",
                          alignItems: "center",
                          justifyContent: "center",
                          gap: "0.5rem",
                        }}
                      >
                        <ErrorIcon
                          sx={{
                            color: "#7c9885",
                            fontSize: "1.5rem",
                          }}
                        />
                        <Typography
                          sx={{ fmb: 2, color: "#7c9885", fontSize: "0.8rem" }}
                        >
                          No task are graded yet.
                        </Typography>
                      </Box>
                    )}
                  </Stack>
                </>
              )}
            </Grid>
          </Grid>
        )
      ) : (
        <div>
          <Box
            sx={{
              display: "flex",
              flexDirection: "row",
              gap: 2,
              justifyContent: "center",
              textAlign: "center",
            }}
          >
            <ErrorIcon sx={{ fontSize: "2rem", color: "#7c9885" }} />
            <Typography
              sx={{
                fontWeight: "bold",
                mb: 2,
                color: "#7c9885",
                fontSize: "1.5rem",
              }}
            >
              Please select a class to begin
            </Typography>
            <ArrowOutwardIcon sx={{ fontSize: "2rem", color: "#7c9885" }} />
          </Box>
        </div>
      )}
    </div>
  );
}

export default Tasks_Page;
