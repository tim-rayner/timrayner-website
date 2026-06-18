import { createCallerFactory } from "@/api/trpc";
import { appRouter } from "@/api/root";

const createCaller = createCallerFactory(appRouter);
export const trpcServer = createCaller({});
