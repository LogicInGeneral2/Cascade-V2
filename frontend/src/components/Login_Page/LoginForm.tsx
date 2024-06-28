import React, { useState } from "react";
import {
  LockRounded,
  AccountCircle,
  Visibility,
  VisibilityOff,
} from "@mui/icons-material";
import {
  Box,
  Button,
  CircularProgress,
  IconButton,
  InputAdornment,
  Stack,
  TextField,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import "./Login_Page.css";
import logo from "../../assets/cascade_logo.png";
import api from "../../api";
import { ACCESS_TOKEN, REFRESH_TOKEN } from "../../constants";

interface LoginFormProps {
  onToggleForm: () => void;
}

export default function LoginForm({}: LoginFormProps) {
  const [username, setUsernmae] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (event: { preventDefault: () => void }) => {
    setLoading(true);
    event.preventDefault();

    try {
      const res = await api.post("/api/token/", { username, password });
      localStorage.setItem(ACCESS_TOKEN, res.data.access);
      localStorage.setItem(REFRESH_TOKEN, res.data.refresh);
      navigate("/home");
    } catch (error) {
      alert(error);
    } finally {
      setLoading(false);
    }
  };

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
            style={{ height: 200, width: 200 }}
          />
        </Box>
        <Box className="border-box">
          <div>
            <form action="" onSubmit={handleSubmit}>
              <h1 className="login">Login</h1>

              <div className="input-box">
                <div className="input-container">
                  <AccountCircle sx={{ mr: 1, my: 0.5 }} />
                  <TextField
                    id="username"
                    label="Username"
                    variant="standard"
                    fullWidth
                    className="input-field"
                    value={username}
                    onChange={(event) => setUsernmae(event.target.value)}
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
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                  />
                </div>
              </div>

              {loading && (
                <Box sx={{ display: "flex", justifyContent: "center", mt: 2 }}>
                  <CircularProgress />
                </Box>
              )}

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
                Login
              </Button>
            </form>
          </div>
        </Box>
      </Stack>
    </>
  );
}
