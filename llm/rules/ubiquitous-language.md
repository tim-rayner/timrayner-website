# Ubiquitous language

## Glossary

> **Domain language is not defined yet.**
> Ask the developer what the project's core domain entities are, then populate this glossary before writing any domain-facing code.
> Remove this notice once real terms are added.

## DDD usage policy for agents

- Use glossary terms as the default language for domain code: entities, value objects, aggregates, domain services, domain events, commands, and queries.
- Use the same domain terms in API input/output fields, acceptance criteria, and tests when they represent domain concepts.
- Do not invent synonyms when a glossary term already exists.
- If a required concept has no glossary entry, propose the new term first, then use it consistently after approval.

## Naming guidance

Once terms are defined, prefer names aligned to glossary terms. For example, if the domain has a `Project` entity:

- `ProjectService`
- `ProjectId`
- `ProjectCreated`

Avoid unapproved synonyms for the same concept.

## Bounded context and translation

- If a term has different meanings across bounded contexts, qualify names and document both meanings in this glossary.
- Keep domain language in the domain layer; map infrastructure or external API terminology at boundaries (anti-corruption layer).
