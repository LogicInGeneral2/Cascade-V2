import { Box, Typography } from "@mui/material";

function NotFound() {
  return (
    <Box sx={{ p: 10 }}>
      <Typography
        variant="h1"
        sx={{ fontWeight: "bold", color: "#7c9885", mb: 5 }}
      >
        404 Not Found
      </Typography>
      <Typography sx={{ color: "#033f63" }}>
        The page you're looking for doesn't exist!
      </Typography>
    </Box>
  );
}

export default NotFound;
