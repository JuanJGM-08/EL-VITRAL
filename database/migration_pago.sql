-- Agregar columna pago a la tabla pedidos
ALTER TABLE pedidos ADD COLUMN pago ENUM('pendiente', 'pagado', 'anticipo') DEFAULT 'pendiente' AFTER estado;