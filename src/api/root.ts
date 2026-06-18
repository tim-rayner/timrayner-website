import { router } from "@/api/trpc";
import { helloRouter } from "@/api/routers/hello";

export const appRouter = router({
  hello: helloRouter,
});

export type AppRouter = typeof appRouter;
