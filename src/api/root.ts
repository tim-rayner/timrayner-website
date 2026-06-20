import { router } from "@/api/trpc";
import { helloRouter } from "@/api/routers/hello";
import { chatRouter } from "@/api/routers/chat";

export const appRouter = router({
  hello: helloRouter,
  chat: chatRouter,
});

export type AppRouter = typeof appRouter;
