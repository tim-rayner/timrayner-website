# Lib Module (tRPC client utilities)

## Client-side usage (Client Components)

Import `trpc` from `@/lib/trpc` for tRPC hooks:

```ts
import { trpc } from '@/lib/trpc'

const { data } = trpc.hello.world.useQuery()
const mutation = trpc.posts.create.useMutation()
```

`TrpcProvider` must wrap any subtree that uses client-side tRPC hooks — it is already added in `src/app/layout.tsx`.

## Server-side usage (Server Components / Route Handlers)

Import from `@/lib/trpcServer` for direct server-side calls (no HTTP round-trip):

```ts
import { trpcServer } from '@/lib/trpcServer'

const data = await trpcServer.hello.world()
```

Use this in `page.tsx` Server Components and `generateMetadata` functions.
