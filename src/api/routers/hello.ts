import { publicProcedure, router } from "@/api/trpc";

export const helloRouter = router({
  world: publicProcedure.query(() => {
    return { message: "Hello, World!" };
  }),
});
