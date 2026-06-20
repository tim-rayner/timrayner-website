-- Enable the pgvector extension for cosine-similarity search.
-- Run once per Supabase project before creating the chunks table.
create extension if not exists vector;
