CREATE TABLE tags (
                      tag_name VARCHAR(255) NOT NULL,
                      PRIMARY KEY (tag_name)
);

CREATE TABLE notes (
                       note_id UUID NOT NULL,
                       note_title VARCHAR(255) NOT NULL,
                       note_content TEXT,  -- Changed to TEXT to support long notes
                       file_location VARCHAR(255),

    -- Booleans usually map to boolean in Postgres, or BIT/TINYINT in MySQL
                       is_locked BOOLEAN NOT NULL DEFAULT FALSE,
                       is_trashed BOOLEAN NOT NULL DEFAULT FALSE,
                       is_pinned BOOLEAN NOT NULL DEFAULT FALSE,

    -- From BaseTimeEntity (assuming standard names)
                       created_at TIMESTAMP(6) WITH TIME ZONE,
                       updated_at TIMESTAMP(6) WITH TIME ZONE,

                       PRIMARY KEY (note_id)
);

CREATE TABLE note_tags (
                           note_id UUID NOT NULL,
                           tag_name VARCHAR(255) NOT NULL,

    -- Composite Primary Key prevents duplicate tags on the same note
                           PRIMARY KEY (note_id, tag_name),

    -- Foreign Key Constraints
                           CONSTRAINT fk_note_tags_note FOREIGN KEY (note_id)
                               REFERENCES notes (note_id) ON DELETE CASCADE,

                           CONSTRAINT fk_note_tags_tag FOREIGN KEY (tag_name)
                               REFERENCES tags (tag_name) ON DELETE CASCADE
);