CREATE DATABASE IF NOT EXISTS catalogo_jogos CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE catalogo_jogos;

DROP TABLE IF EXISTS jogos;
DROP TABLE IF EXISTS desenvolvedores;
DROP TABLE IF EXISTS estudios;

CREATE TABLE estudios (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    pais VARCHAR(60) NOT NULL
) ENGINE=InnoDB;

CREATE TABLE desenvolvedores (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    nickname VARCHAR(50) NOT NULL UNIQUE,
    nome VARCHAR(100) NOT NULL,
    estudio_id INT UNSIGNED NOT NULL,
    CONSTRAINT fk_dev_estudio FOREIGN KEY (estudio_id) REFERENCES estudios(id)
) ENGINE=InnoDB;

CREATE TABLE jogos (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    titulo VARCHAR(120) NOT NULL,
    genero VARCHAR(50) NOT NULL,
    ano_lancamento SMALLINT UNSIGNED NOT NULL,
    estudio_id INT UNSIGNED NOT NULL,
    CONSTRAINT fk_jogo_estudio FOREIGN KEY (estudio_id) REFERENCES estudios(id)
) ENGINE=InnoDB;

INSERT INTO estudios (nome, pais) VALUES
    ('Nintendo', 'Japão'),
    ('CD Projekt Red', 'Polônia');

INSERT INTO desenvolvedores (nickname, nome, estudio_id) VALUES
    ('shigsy', 'Shigeru Miyamoto', 1);

INSERT INTO jogos (titulo, genero, ano_lancamento, estudio_id) VALUES
    ('The Legend of Zelda: Breath of the Wild', 'Aventura', 2017, 1),
    ('The Witcher 3: Wild Hunt', 'RPG', 2015, 2);
