import React from "react";
import {
  ListItem,
  ListItemAvatar,
  ListItemText,
  Avatar,
  Typography,
} from "@mui/material";
import { Task } from "../../models/Tasks_model";

interface TaskProps {
  tasks: Task[];
}

const TasksList: React.FC<TaskProps> = ({ tasks }) => {
  const currentDate = new Date(); 

  const upcomingTasks = tasks.filter((task) => {
    const taskStartDate = new Date(task.start_date); 
    return taskStartDate >= currentDate;
  });

  return (
    <div className="list">
      {upcomingTasks.map((task, index) => (
        <ListItem key={index} alignItems="flex-start">
          <ListItemAvatar>
            <Avatar alt={task.name} src={task.avatar} />
          </ListItemAvatar>
          <ListItemText
            primary={task.name}
            secondary={
              <React.Fragment>
                <Typography
                  sx={{ display: "inline" }}
                  component="span"
                  variant="body2"
                  color="text.primary"
                >
                  {task.description}
                </Typography>
                {" | " +
                  task.start_date.toString() +
                  " - " +
                  task.due_date.toString() +
                  " | "}
              </React.Fragment>
            }
          />
        </ListItem>
      ))}
    </div>
  );
};

export default TasksList;
