import React from "react";
import {
  LockRounded,
  AccountCircle,
  Visibility,
  VisibilityOff,
  EmailRounded,
  GroupRounded,
  PersonRounded,
} from "@mui/icons-material";
import {
  Box,
  Button,
  IconButton,
  InputAdornment,
  Stack,
  TextField,
} from "@mui/material";
import "./Login_Page.css";
import { Link } from "react-router-dom";
import logo from "../../assets/cascade_logo.png";

interface RegisterFormProps {
  onToggleForm: () => void;
}

export default function RegisterForm({}: RegisterFormProps) {
  const [showPassword, setShowPassword] = React.useState(false);

  const handleClickShowPassword = () => setShowPassword((show) => !show);

  const handleMouseDownPassword = (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    event.preventDefault();
  };

  return (
    <>
      <Stack
        direction="row"
        sx={{
          justifyContent: "center",
        }}
      >
        <Box className="logo">
          <img
            src={logo}
            alt="Cascade Logo"
            style={{ height: 300, width: 300 }}
          />
        </Box>
        <Box className="border-box">
          <div>
            <form action="">
              <h1 className="login">Register</h1>

              <div className="input-box">
                <div className="input-container">
                  <PersonRounded sx={{ mr: 1, my: 0.5 }} />
                  <TextField
                    id="firstname"
                    label="Firstname"
                    variant="standard"
                    fullWidth
                    className="input-field"
                    sx={{ mr: 2 }}
                  />
                  <GroupRounded sx={{ mr: 1, my: 0.5 }} />
                  <TextField
                    id="familyname"
                    label="Family name"
                    variant="standard"
                    fullWidth
                    className="input-field"
                  />
                </div>
                <div className="input-container">
                  <EmailRounded sx={{ mr: 1, my: 0.5 }} />
                  <TextField
                    id="email"
                    label="Email"
                    variant="standard"
                    fullWidth
                    className="input-field"
                  />
                </div>
                <div className="input-container">
                  <AccountCircle sx={{ mr: 1, my: 0.5 }} />
                  <TextField
                    id="username"
                    label="Username"
                    variant="standard"
                    fullWidth
                    className="input-field"
                  />
                </div>
                <div className="input-container">
                  <LockRounded sx={{ mr: 1, my: 0.5 }} />
                  <TextField
                    id="password"
                    label="Password"
                    type={showPassword ? "text" : "password"}
                    variant="standard"
                    fullWidth
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton
                            aria-label="toggle password visibility"
                            onClick={handleClickShowPassword}
                            onMouseDown={handleMouseDownPassword}
                          >
                            {showPassword ? (
                              <VisibilityOff className="eye-icon" />
                            ) : (
                              <Visibility className="eye-icon" />
                            )}
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                    className="input-field"
                  />
                </div>
              </div>
              <div className="remember-forgot">
                <label>
                  <input type="checkbox" />
                  Remember me
                </label>
              </div>

              <Button
                variant="contained"
                type="submit"
                sx={{
                  my: 2,
                  color: "#ffffff",
                  backgroundColor: "#033f63",
                  ":hover": { backgroundColor: "#ffffff", color: "#033f63" },
                }}
                className="button"
              >
                Register
              </Button>
              <div className="register-link">
                <p>
                  Already have an account?{" "}
                  <Link to="/login" className="register-link">
                    Login
                  </Link>
                </p>
              </div>
            </form>
          </div>
        </Box>
      </Stack>
    </>
  );
}
