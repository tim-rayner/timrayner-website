import fs from "fs";
import path from "path";
import { trpcServer } from "@/lib/trpcServer";
import HomeClient from "./HomeClient";

export default async function HomePage() {
  const { message: serverMessage } = await trpcServer.hello.world();

  const rawReadme = fs.readFileSync(
    path.join(process.cwd(), "src/features/readme/content.md"),
    "utf-8"
  );

  return <HomeClient serverMessage={serverMessage} rawReadme={rawReadme} />;
}
