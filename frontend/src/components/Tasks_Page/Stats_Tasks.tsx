import React from "react";
import { BarChart } from "@mui/x-charts/BarChart";
import { Box, Divider, Stack, Typography } from "@mui/material";
import { Gauge } from "@mui/x-charts/Gauge";
import { PieChart, pieArcLabelClasses } from "@mui/x-charts/PieChart";
import { DefaultizedPieValueType } from "@mui/x-charts/models";
import { StatsTaskProps } from "../../models/Tasks_model";

interface StatsProps {
  taskCounts: StatsTaskProps;
}

const Stats_Task: React.FC<StatsProps> = ({ taskCounts }) => {
  const {
    upcoming = 0,
    ongoing = 0,
    completed = 0,
    graded = 0,
    students = 0,
  } = taskCounts;

  const data = [
    { id: "upcoming", value: upcoming, label: "Upcoming" },
    { id: "on_going", value: ongoing, label: "On Going" },
    { id: "completed", value: completed, label: "Completed" },
    { id: "graded", value: graded, label: "Graded" },
  ];

  const size = {
    width: 400,
    height: 200,
  };

  const TOTAL = data.map((item) => item.value).reduce((a, b) => a + b, 0);

  const getArcLabel = (params: DefaultizedPieValueType) => {
    const percent = params.value / TOTAL;
    return `${(percent * 100).toFixed(0)}%`;
  };

  return (
    <>
      <Box className="statsTask">
        <Typography sx={{ mb: 2 }}>Tasks Composition</Typography>
        <PieChart
          series={[
            {
              data,
              arcLabel: getArcLabel,
            },
          ]}
          slotProps={{
            legend: { hidden: true },
          }}
          sx={{
            [`& .${pieArcLabelClasses.root}`]: {
              fill: "white",
              fontWeight: "bold",
            },
          }}
          {...size}
        />
      </Box>

      <br />

      <Box className="statsTask">
        <Typography sx={{ mb: 2 }}>Completed vs. On Going</Typography>
        <Stack
          direction="row"
          spacing={2}
          divider={<Divider orientation="vertical" flexItem />}
        >
          <Gauge width={100} height={100} value={completed} />
          <Gauge width={100} height={100} value={ongoing} />
        </Stack>
      </Box>

      <br />

      <Box className="statsTask">
        <Typography sx={{ mb: 2 }}>Upcoming vs. On Going</Typography>
        <Stack
          direction="row"
          spacing={2}
          divider={<Divider orientation="vertical" flexItem />}
        >
          <Gauge width={100} height={100} value={upcoming} />
          <Gauge width={100} height={100} value={ongoing} />
        </Stack>
      </Box>

      <br />

      <Box className="statsTask">
        <Typography sx={{ mb: 2 }}>Total Active Students</Typography>
        <Stack
          direction="row"
          spacing={2}
          divider={<Divider orientation="vertical" flexItem />}
        >
          <Gauge width={100} height={100} value={students} />
        </Stack>
      </Box>

      <br />

      <Box className="statsTask">
        <Typography sx={{ mb: 2 }}>Tasks Composition</Typography>
        <BarChart
          xAxis={[
            {
              scaleType: "band",
              data: ["Upcoming", "On Going", "Completed", "Graded"],
            },
          ]}
          series={[{ data: [upcoming, ongoing, completed, graded] }]}
          {...size}
        />
      </Box>
    </>
  );
};

export default Stats_Task;
