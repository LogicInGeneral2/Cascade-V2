// Profile_page.tsx
import React, { useEffect, useState } from "react";
import { Container, Grid, Divider } from "@mui/material";
import "./profile_page.css";
import UserInfo from "./User_Info";
import ClassList from "./Active_Classes";
import api from "../../api";

const ProfilePage: React.FC = () => {
  const [user, setUser] = useState({
    status: "",
    username: "",
    email: "",
    password: "",
    first_name: "",
    last_name: "",
    avatar: "",
  });

  const getUser = () => {
    api
      .get("/users/details/")
      .then((res) => {
        setUser(res.data);
        console.log(res.data);
      })
      .catch((err) => alert(err));
  };

  const [classes, setClasses] = useState([]);
  
  const getClasses = () => {
    api
      .get("/users/classes/")
      .then((res) => res.data)
      .then((data) => {
        setClasses(data);
        console.log(data);
      })
      .catch((err) => alert(err));
  };

  useEffect(() => {
    getUser();
    getClasses();
  }, []);

  return (
    <>
      <div className="profile-page" style={{ marginTop: "50px" }}>
        <h1 className="header">Profile</h1>
        <Divider />
        <br />
        <br />
        <Container sx={{ py: 5 }}>
          <UserInfo user={user} />
          <Grid item xs={12} className="classes">
            Active Classes
            <ClassList tasks={classes} />
          </Grid>
        </Container>
      </div>
    </>
  );
};

export default ProfilePage;
