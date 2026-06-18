"use client";

import { trpc } from "@/lib/trpc";
import { Box, Typography } from "@mui/material";

interface Props {
  serverMessage: string;
}

export default function HomeClient({ serverMessage }: Props) {
  const { data } = trpc.hello.world.useQuery();

  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h4" gutterBottom>
        Tim Rayner
      </Typography>
      <Typography variant="h6" gutterBottom>
        Software Engineer
      </Typography>
    </Box>
  );
}
