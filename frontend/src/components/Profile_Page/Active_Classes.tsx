import React from "react";
import {
  ListItem,
  ListItemAvatar,
  ListItemText,
  Avatar,
  Typography,
} from "@mui/material";

type classes = {
  subject: string;
  avatar: string;
  code: string;
  start_date: Date;
};

const ClassList = ({ tasks }: { tasks: classes[] }) => {
  return (
    <div className="classList">
      {tasks.map((task, index) => (
        <ListItem key={index} alignItems="flex-start">
          <ListItemAvatar>
            <Avatar alt={task.subject} src={task.avatar} />
          </ListItemAvatar>
          <ListItemText
            primary={`${task.code} ${task.subject}`}
            secondary={
              <React.Fragment>
                <Typography
                  sx={{ display: "inline" }}
                  component="span"
                  variant="body2"
                  color="text.primary"
                ></Typography>
                {" — " + task.start_date}
              </React.Fragment>
            }
          />
        </ListItem>
      ))}
    </div>
  );
};

export default ClassList;
