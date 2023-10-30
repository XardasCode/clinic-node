DROP TABLE IF EXISTS visits CASCADE;
DROP TABLE IF EXISTS statuses CASCADE;
DROP TABLE IF EXISTS specializations CASCADE;
DROP TABLE IF EXISTS patients CASCADE;
DROP TABLE IF EXISTS doctors CASCADE;


CREATE TABLE IF NOT EXISTS specializations
(
    id   INT AUTO_INCREMENT NOT NULL,
    name VARCHAR(255)       NOT NULL UNIQUE,
    PRIMARY KEY (id)
);

CREATE TABLE IF NOT EXISTS doctors
(
    id                INT AUTO_INCREMENT NOT NULL,
    name              VARCHAR(255)       NOT NULL,
    email             VARCHAR(255)       NOT NULL UNIQUE,
    password          VARCHAR(255)       NOT NULL,
    specialization_id INT,
    PRIMARY KEY (id),
    KEY specialization_id (specialization_id)
);

CREATE TABLE IF NOT EXISTS patients
(
    id       INT AUTO_INCREMENT NOT NULL,
    name     VARCHAR(255)       NOT NULL,
    email    VARCHAR(255)       NOT NULL UNIQUE,
    password VARCHAR(255)       NOT NULL,
    PRIMARY KEY (id)
);

CREATE TABLE IF NOT EXISTS statuses
(
    id   INT AUTO_INCREMENT NOT NULL,
    name VARCHAR(255)       NOT NULL UNIQUE,
    PRIMARY KEY (id)
);


CREATE TABLE IF NOT EXISTS visits
(
    id        INT AUTO_INCREMENT NOT NULL,
    patient_id   INT                NOT NULL,
    doctor_id INT                NOT NULL,
    date      DATE           NOT NULL,
    status_id INT                NOT NULL,
    problem   TEXT               NOT NULL,
    diagnosis TEXT,
    treatment TEXT,
    PRIMARY KEY (id),
    KEY user_id (patient_id),
    KEY doctor_id (doctor_id),
    KEY status_id (status_id)
);

INSERT INTO patients (name, email, password)
VALUES ('Richard Cool', 'rich@mail.com', '123'),
       ('William Smith', 'will@mail.com', '123'),
       ('Linda Johnson', 'linda@mail.com', '123'),
       ('John Williams', 'john@mail.com', '123');


INSERT INTO specializations (name)
VALUES ('Cardiologist'),
       ('Dentist'),
       ('Dermatologist'),
       ('Endocrinologist'),
       ('Gastroenterologist'),
       ('Neurologist'),
       ('Ophthalmologist'),
       ('Otolaryngologies'),
       ('Pediatrician'),
       ('Psychiatrist'),
       ('Rheumatologist'),
       ('Surgeon');

INSERT INTO doctors (name, email, password, specialization_id)
VALUES ('Dr. Mike Ericsson', 'mike@mail.com', '123', 1),
       ('Dr. John Smith', 'smith@mail.com', '123', 2),
       ('Dr. Linda Johnson', 'lindaJ@mail.com', '123', 3),
       ('Dr. William Smith', 'wsmth@mail.com', '123', 4),
       ('Dr. Richard Cool', 'rich@mail.com', '123', 5),
       ('Dr. John Williams', 'john@mail.com', '123', 6),
       ('Dr. Laura Smith', 'laura@mail.com', '123', 7),
       ('Dr. Linda Williams', 'lWillams@mail.com', '123', 8),
       ('Dr. William Johnson', 'drJohnson@mail.com', '123', 9),
       ('Dr. Ria Johnson', 'ria@mail.com', '123', 10),
       ('Dr. Vanessa Williams', 'vaneSSa@mail.com', '123', 11),
       ('Dr. Liza Richard', 'liZZZa@mail.com', '123', 12);

INSERT INTO statuses (name)
VALUES ('Pending'),
       ('Done'),
       ('Canceled'),
       ('In progress');


INSERT INTO visits (patient_id, doctor_id, date, status_id, problem)
VALUES (1, 5, '2020-01-01', 1, 'I have a problem with my heart'),
       (2, 6, '2020-01-02', 1, 'I have a problem with my teeth'),
       (3, 7, '2020-01-03', 1, 'I have a problem with my stomach'),
       (4, 8, '2020-01-04', 1, 'I have a problem with my eyes'),
       (1, 5, '2021-05-16', 1, 'I have a problem with my heart'),
       (2, 6, '2021-05-17', 1, 'I have a problem with my teeth'),
       (3, 7, '2021-05-18', 1, 'I have a problem with my stomach'),
       (4, 8, '2021-05-19', 1, 'I have a problem with my eyes'),
       (2, 5, '2021-05-20', 1, 'I have a problem with my heart'),
       (3, 5, '2022-06-21', 1, 'I have pain in my heart');