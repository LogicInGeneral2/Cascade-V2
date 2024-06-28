import React, { useState } from "react";
import {
  Grid,
  IconButton,
  Box,
  Divider,
  Stack,
  Typography,
  CardContent,
  Avatar,
} from "@mui/material";
import {
  SchoolRounded,
  EmailRounded,
  BadgeRounded,
  AutoStoriesRounded,
} from "@mui/icons-material";

type UserInfoProps = {
  user: {
    status: string;
    username: string;
    email: string;
    password: string;
    first_name: string;
    last_name: string;
    avatar: string;
  };
};

const UserInfo: React.FC<UserInfoProps> = ({ user }) => {
  const [openModal, setOpenModal] = useState<{ [key: string]: boolean }>({
    email: false,
    password: false,
    username: false,
    avatar: false,
  });

  const handleOpen = (data: string) =>
    setOpenModal({ ...openModal, [data]: true });

  return (
    <Grid container className="content">
      <Grid item xs={2} className="sideInfo">
        <Box sx={{ mt: 2, mb: 2 }}>
          <Stack direction="row" spacing={2} className="sideInfoStatus">
            {user.status === "Teacher" ? (
              <>
                <AutoStoriesRounded
                  sx={{ fontSize: "1.25vw", paddingRight: "10px" }}
                />
                Teacher
              </>
            ) : (
              <>
                <SchoolRounded
                  sx={{ fontSize: "1.25vw", paddingRight: "10px" }}
                />
                Student
              </>
            )}
          </Stack>
        </Box>
        <Avatar
          src={user.avatar}
          alt={user.last_name}
          sx={{ my: 5, width: "100px", margin: "auto", height: "100px" }}
        />

        <Box sx={{ my: 2 }}>
          {user.first_name} <br /> {user.last_name} <br />
        </Box>
      </Grid>
      <Grid item xs={10} className="mainInfo">
        <CardContent sx={{ p: 4 }}>
          <Grid container direction="column" spacing={2}>
            <Divider sx={{ mt: 2, mb: 2 }} />
            <Stack
              direction="row"
              spacing={1}
              className="mainInfoStatus"
              divider={<Divider orientation="vertical" flexItem />}
            >
              <EmailRounded sx={{ fontSize: "1.25vw", paddingRight: "5px" }} />
              <Typography sx={{ width: "12%" }}>Email</Typography>
              <Typography sx={{ width: "100%" }}>{user.email}</Typography>
              <div style={{ marginLeft: "auto" }}>
                <IconButton onClick={() => handleOpen("email")}></IconButton>
              </div>
            </Stack>

            <Divider sx={{ mt: 2, mb: 2 }} />

            <Divider sx={{ mt: 2, mb: 2 }} />

            <Stack
              direction="row"
              spacing={1}
              className="mainInfoStatus"
              divider={<Divider orientation="vertical" flexItem />}
            >
              <BadgeRounded sx={{ fontSize: "1.25vw", paddingRight: "5px" }} />
              <Typography sx={{ width: "12%" }}>Username</Typography>
              <Typography sx={{ width: "100%" }}>{user.username}</Typography>
              <div style={{ marginLeft: "auto" }}>
                <IconButton onClick={() => handleOpen("username")}></IconButton>
              </div>
            </Stack>

            <Divider sx={{ mt: 2, mb: 2 }} />
          </Grid>
        </CardContent>
      </Grid>
    </Grid>
  );
};

export default UserInfo;
