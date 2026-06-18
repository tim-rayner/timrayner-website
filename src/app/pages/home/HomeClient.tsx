"use client";

import { Box, Divider, Typography } from "@mui/material";
import { trpc } from "@/lib/trpc";

interface Props {
  serverMessage: string;
}

export default function HomeClient({ serverMessage }: Props) {
  const { data } = trpc.hello.world.useQuery();

  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h4" gutterBottom>
        Home
      </Typography>

      <Box sx={{ mt: 3 }}>
        <Typography variant="overline" color="text.secondary">
          Server-side fetch (SSR)
        </Typography>
        <Typography variant="h6">{serverMessage}</Typography>
      </Box>

      <Divider sx={{ my: 3 }} />

      <Box>
        <Typography variant="overline" color="text.secondary">
          Client-side fetch (React Query via tPRC)
        </Typography>
        <Typography variant="h6">{data?.message ?? "Loading..."}</Typography>
      </Box>
    </Box>
  );
}
