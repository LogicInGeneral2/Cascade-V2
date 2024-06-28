import React from "react";
import {
  Grid,
  Box,
  Divider,
  Stack,
  Typography,
  CardContent,
  Avatar,
  styled,
  Button,
} from "@mui/material";
import {
  SchoolRounded,
  EmailRounded,
  BadgeRounded,
  AutoStoriesRounded,
  AddAPhoto,
} from "@mui/icons-material";
import { Student } from "../../models/Tasks_model";
import api from "../../api";

const VisuallyHiddenInput = styled("input")({
  clip: "rect(0 0 0 0)",
  clipPath: "inset(50%)",
  height: 1,
  overflow: "hidden",
  position: "absolute",
  bottom: 0,
  left: 0,
  whiteSpace: "nowrap",
  width: 1,
});

const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
  const file = event.target.files?.[0];
  if (file) {
    const formData = new FormData();
    formData.append("avatar", file);

    try {
      await api.patch("/users/details/", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
    } catch (error) {
      console.error("Failed to upload avatar:", error);
    }
  }
};

type Props = {
  user: Student;
};

const UserInfo: React.FC<Props> = ({ user }) => {
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

        <Button
          component="label"
          role={undefined}
          tabIndex={-1}
          startIcon={<AddAPhoto />}
          sx={{ mb: 2, color: "#033f63" }}
        >
          <VisuallyHiddenInput type="file" onChange={handleFileChange} />
        </Button>

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
            </Stack>

            <Divider sx={{ mt: 2, mb: 2 }} />
          </Grid>
        </CardContent>
      </Grid>
    </Grid>
  );
};

export default UserInfo;
