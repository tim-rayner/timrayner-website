import { trpcServer } from "@/lib/trpcServer";
import HomeClient from "./HomeClient";

export default async function HomePage() {
  const { message: serverMessage } = await trpcServer.hello.world();

  return <HomeClient serverMessage={serverMessage} />;
}
