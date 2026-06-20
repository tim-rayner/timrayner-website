-- Retrieval function used by the chat.ask tRPC procedure.
-- Returns chunks ranked by cosine similarity to the query embedding.
create or replace function match_chunks (
  query_embedding vector(1536),
  match_threshold float,
  match_count int
)
returns table (id bigint, content text, metadata jsonb, similarity float)
language sql stable as $$
  select c.id, c.content, c.metadata,
         1 - (c.embedding <=> query_embedding) as similarity
  from chunks c
  where 1 - (c.embedding <=> query_embedding) > match_threshold
  order by c.embedding <=> query_embedding
  limit match_count;
$$;
