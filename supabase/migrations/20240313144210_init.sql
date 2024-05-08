CREATE TABLE IF NOT EXISTS "access" (
    user_id integer not null,
    repository_id integer not null,
    created timestamptz not null default now(),
    updated timestamptz,
    labels text[] not null,
    PRIMARY KEY (user_id, repository_id)
);

CREATE TABLE IF NOT EXISTS labels (
    id BIGSERIAL PRIMARY KEY,
    created timestamptz not null default now(),
    updated timestamptz,
    repository_id integer not null,
    user_id integer not null,
    label_from text not null,
    label_to text not null,
    authorized boolean not null
);
