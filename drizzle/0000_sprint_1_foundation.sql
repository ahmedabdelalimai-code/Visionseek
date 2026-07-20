-- VisionSeek OS Sprint 1 typed schema migration.
-- The Drizzle schema in src/lib/db/schema.ts is the source of truth.
CREATE EXTENSION IF NOT EXISTS pgcrypto;

CREATE TYPE opportunity_classification AS ENUM ('tactical', 'strategic', 'mixed');
CREATE TYPE opportunity_status AS ENUM ('draft', 'qualifying', 'decision_ready', 'decided', 'archived');
CREATE TYPE lifecycle_stage AS ENUM ('detect', 'verify', 'understand', 'connect', 'decide', 'build', 'operate', 'learn', 'compound');
CREATE TYPE decision_outcome AS ENUM ('approved', 'rejected', 'deferred');
CREATE TYPE inbox_status AS ENUM ('pending', 'in_review', 'resolved');

CREATE TABLE actors (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  display_name varchar(160) NOT NULL,
  email varchar(320) NOT NULL UNIQUE,
  role varchar(64) NOT NULL,
  oidc_subject varchar(255) UNIQUE,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE sources (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name varchar(300) NOT NULL,
  canonical_url text,
  source_type varchar(64) NOT NULL,
  publisher varchar(300),
  published_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE signals (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  source_id uuid REFERENCES sources(id) ON DELETE SET NULL,
  title varchar(300) NOT NULL,
  summary text NOT NULL,
  lifecycle_stage lifecycle_stage NOT NULL DEFAULT 'detect',
  observed_at timestamptz NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE opportunities (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title varchar(300) NOT NULL,
  summary text NOT NULL,
  classification opportunity_classification NOT NULL,
  status opportunity_status NOT NULL DEFAULT 'draft',
  lifecycle_stage lifecycle_stage NOT NULL DEFAULT 'detect',
  owner_actor_id uuid REFERENCES actors(id) ON DELETE RESTRICT,
  review_date timestamptz,
  key_gaps jsonb NOT NULL DEFAULT '[]'::jsonb,
  confidence numeric(4,3) NOT NULL DEFAULT 0.000 CHECK (confidence >= 0 AND confidence <= 1),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE theses (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  opportunity_id uuid NOT NULL REFERENCES opportunities(id) ON DELETE CASCADE,
  title varchar(300) NOT NULL,
  working_content text NOT NULL,
  active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE thesis_versions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  thesis_id uuid NOT NULL REFERENCES theses(id) ON DELETE CASCADE,
  version_number integer NOT NULL CHECK (version_number > 0),
  content text NOT NULL,
  published_at timestamptz,
  author_actor_id uuid NOT NULL REFERENCES actors(id) ON DELETE RESTRICT,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (thesis_id, version_number)
);

CREATE TABLE claims (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  thesis_id uuid NOT NULL REFERENCES theses(id) ON DELETE CASCADE,
  statement text NOT NULL,
  confidence numeric(4,3) NOT NULL DEFAULT 0.000 CHECK (confidence >= 0 AND confidence <= 1),
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE evidence (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  opportunity_id uuid NOT NULL REFERENCES opportunities(id) ON DELETE CASCADE,
  claim_id uuid REFERENCES claims(id) ON DELETE SET NULL,
  source_id uuid REFERENCES sources(id) ON DELETE SET NULL,
  title varchar(500) NOT NULL,
  excerpt text NOT NULL,
  reliability_score numeric(4,3) NOT NULL DEFAULT 0.500 CHECK (reliability_score >= 0 AND reliability_score <= 1),
  corroboration_status varchar(32) NOT NULL DEFAULT 'unverified',
  captured_by_actor_id uuid NOT NULL REFERENCES actors(id) ON DELETE RESTRICT,
  captured_at timestamptz NOT NULL DEFAULT now(),
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE decisions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  opportunity_id uuid NOT NULL REFERENCES opportunities(id) ON DELETE RESTRICT,
  outcome decision_outcome NOT NULL,
  rationale text NOT NULL,
  decided_by_actor_id uuid NOT NULL REFERENCES actors(id) ON DELETE RESTRICT,
  decided_at timestamptz NOT NULL DEFAULT now(),
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE decision_inbox_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  opportunity_id uuid NOT NULL REFERENCES opportunities(id) ON DELETE CASCADE,
  assigned_actor_id uuid NOT NULL REFERENCES actors(id) ON DELETE RESTRICT,
  status inbox_status NOT NULL DEFAULT 'pending',
  due_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE audit_events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  entity_type varchar(120) NOT NULL,
  entity_id uuid NOT NULL,
  action varchar(160) NOT NULL,
  actor_id uuid NOT NULL REFERENCES actors(id) ON DELETE RESTRICT,
  reason text,
  payload jsonb NOT NULL DEFAULT '{}'::jsonb,
  occurred_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE opportunity_confidence_changes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  opportunity_id uuid NOT NULL REFERENCES opportunities(id) ON DELETE CASCADE,
  previous_confidence numeric(4,3) NOT NULL CHECK (previous_confidence >= 0 AND previous_confidence <= 1),
  next_confidence numeric(4,3) NOT NULL CHECK (next_confidence >= 0 AND next_confidence <= 1),
  reason text NOT NULL,
  actor_id uuid NOT NULL REFERENCES actors(id) ON DELETE RESTRICT,
  created_at timestamptz NOT NULL DEFAULT now(),
  CHECK (previous_confidence <> next_confidence)
);

CREATE INDEX signals_stage_idx ON signals(lifecycle_stage);
CREATE INDEX opportunities_status_idx ON opportunities(status);
CREATE INDEX opportunities_classification_idx ON opportunities(classification);
CREATE INDEX theses_opportunity_active_idx ON theses(opportunity_id, active);
CREATE INDEX evidence_opportunity_idx ON evidence(opportunity_id);
CREATE INDEX decisions_opportunity_idx ON decisions(opportunity_id);
CREATE INDEX audit_events_entity_idx ON audit_events(entity_type, entity_id);

CREATE OR REPLACE FUNCTION prevent_audit_event_mutation() RETURNS trigger AS $$
BEGIN
  RAISE EXCEPTION 'audit_events are immutable';
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER audit_events_immutable
BEFORE UPDATE OR DELETE ON audit_events
FOR EACH ROW EXECUTE FUNCTION prevent_audit_event_mutation();

CREATE OR REPLACE FUNCTION prevent_published_thesis_version_mutation() RETURNS trigger AS $$
BEGIN
  IF OLD.published_at IS NOT NULL THEN
    RAISE EXCEPTION 'published thesis versions are immutable';
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER thesis_versions_published_immutable
BEFORE UPDATE OR DELETE ON thesis_versions
FOR EACH ROW EXECUTE FUNCTION prevent_published_thesis_version_mutation();
