import { Grid, Stack, Divider, useMediaQuery, Typography } from "@mui/material";
import DashboardCalender from "./Calender";
import "./home_page.css";
import Forecast from "./Forecast";
import { Gauge } from "@mui/x-charts/Gauge";
import CheckCircleRoundedIcon from "@mui/icons-material/CheckCircleRounded";
import PendingRoundedIcon from "@mui/icons-material/PendingRounded";
import AccessTimeFilledRoundedIcon from "@mui/icons-material/AccessTimeFilledRounded";
import NotificationsActiveRoundedIcon from "@mui/icons-material/NotificationsActiveRounded";
import TasksList from "./Upcoming_Lists";
import { useEffect, useState } from "react";
import api from "../../api";
import { Task, Submission } from "../../models/Tasks_model";

function Home() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [user, setUser] = useState<any>(null);
  const [ongoingTasksCount, setOngoingTasksCount] = useState(0);
  const [upcomingTasksCount, setUpcomingTasksCount] = useState(0);
  const [completedTasksCount, setCompletedTasksCount] = useState(0);
  const [expiredTasksCount, setExpiredTasksCount] = useState(0);

  const isSmallScreen = useMediaQuery("(max-width:1300px)");

  useEffect(() => {
    getUser();
    getTasks();
    getClasses();
    getSubmissions();
  }, []);

  const getUser = () => {
    api
      .get("/users/details/")
      .then((res) => {
        setUser(res.data);
      })
      .catch((err) => alert(err));
  };

  const getTasks = () => {
    api
      .get("/api/tasks/")
      .then((res) => {
        setTasks(res.data);
        countTasks(res.data);
      })
      .catch((err) => alert(err));
  };

  const getClasses = () => {
    api.get("/users/classes/").catch((err) => alert(err));
  };

  const getSubmissions = () => {
    api
      .get("/api/submissions/")
      .then((res) => {
        countSubmissions(res.data);
      })
      .catch((err) => alert(err));
  };

  const countTasks = (tasks: Task[]) => {
    const currentDate = new Date();
    const ongoing = tasks.filter(
      (task) => new Date(task.start_date) <= currentDate
    ).length;
    const upcoming = tasks.filter(
      (task) => new Date(task.start_date) > currentDate
    ).length;
    const expired = tasks.filter(
      (task) => new Date(task.due_date) < currentDate
    ).length;
    setOngoingTasksCount(ongoing);
    setUpcomingTasksCount(upcoming);
    setExpiredTasksCount(expired);
  };

  const countSubmissions = (submissions: Submission[]) => {
    setCompletedTasksCount(submissions.length);
  };

  const tasksPending = ongoingTasksCount - expiredTasksCount;

  return (
    <div className="home-page" style={{ marginTop: "50px" }}>
      <h1 className="header">Dashboard</h1>
      <Divider />
      <br />
      <br />
      <Grid container spacing={isSmallScreen ? 2 : 6}>
        <Grid item xs={12} md={4}>
          <div className="greetings">
            <Typography variant={isSmallScreen ? "h5" : "h4"}>
              Hello! Welcome back,
            </Typography>
            <Typography variant={isSmallScreen ? "h6" : "h5"}>
              {user && `${user.first_name} ${user.last_name}`}
            </Typography>
            <Divider />
          </div>
        </Grid>
        <Grid item xs={6} md={2}>
          <Stack
            direction={isSmallScreen ? "column" : "row"}
            spacing={2}
            divider={<Divider orientation="vertical" flexItem />}
            className="stats"
          >
            <PendingRoundedIcon
              style={{ fontSize: isSmallScreen ? "6vw" : "2vw" }}
            />
            <div>
              On Going Tasks
              <Gauge
                width={isSmallScreen ? 50 : 100}
                height={isSmallScreen ? 50 : 100}
                value={tasksPending}
              />
            </div>
          </Stack>
        </Grid>
        <Grid item xs={6} md={2}>
          <Stack
            direction={isSmallScreen ? "column" : "row"}
            spacing={2}
            divider={<Divider orientation="vertical" flexItem />}
            className="stats"
          >
            <CheckCircleRoundedIcon
              style={{ fontSize: isSmallScreen ? "6vw" : "2vw" }}
            />
            <div>
              Ended Tasks
              <Gauge
                width={isSmallScreen ? 50 : 100}
                height={isSmallScreen ? 50 : 100}
                value={expiredTasksCount}
              />
            </div>
          </Stack>
        </Grid>
        <Grid item xs={6} md={2}>
          <Stack
            direction={isSmallScreen ? "column" : "row"}
            spacing={2}
            divider={<Divider orientation="vertical" flexItem />}
            className="stats"
          >
            <AccessTimeFilledRoundedIcon
              style={{ fontSize: isSmallScreen ? "6vw" : "2vw" }}
            />
            <div>
              Upcoming Tasks
              <Gauge
                width={isSmallScreen ? 50 : 100}
                height={isSmallScreen ? 50 : 100}
                value={upcomingTasksCount}
              />
            </div>
          </Stack>
        </Grid>
        <Grid item xs={6} md={2}>
          <Stack
            direction={isSmallScreen ? "column" : "row"}
            spacing={2}
            divider={<Divider orientation="vertical" flexItem />}
            className="stats2"
          >
            <NotificationsActiveRoundedIcon
              style={{ fontSize: isSmallScreen ? "6vw" : "2vw" }}
            />
            <div>
              {user?.status === "Student"
                ? "Submitted Tasks"
                : "Tasks Pending Grading"}

              <Gauge
                width={isSmallScreen ? 50 : 100}
                height={isSmallScreen ? 50 : 100}
                value={completedTasksCount}
                startAngle={-90}
                endAngle={90}
              />
            </div>
          </Stack>
        </Grid>
        <Grid item xs={12} md={4}>
          <div className="forecast">
            <Forecast />
          </div>
          <div className="tasks-list">
            Upcoming Task
            <TasksList tasks={tasks} />
          </div>
        </Grid>
        <Grid item xs={12} md={8}>
          <div className="calender">
            <DashboardCalender />
          </div>
        </Grid>
      </Grid>
    </div>
  );
}

export default Home;
