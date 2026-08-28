-- Ejecutar una sola vez en instalaciones que ya tienen la base de datos creada.
CREATE TABLE IF NOT EXISTS proyectos_destacados (
    id INT PRIMARY KEY AUTO_INCREMENT,
    titulo VARCHAR(150) NOT NULL,
    slug VARCHAR(180) NOT NULL UNIQUE,
    resumen VARCHAR(255) NOT NULL,
    descripcion TEXT,
    imagen_url VARCHAR(2048) NOT NULL,
    tecnologias TEXT,
    orden INT NOT NULL DEFAULT 0,
    activo BOOLEAN DEFAULT true,
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    fecha_actualizacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_proyectos_destacados_publicos (activo, orden)
);
