CREATE TABLE IF NOT EXISTS ingressos (
  id SERIAL PRIMARY KEY,
  codigo VARCHAR(30) NOT NULL UNIQUE,
  nome_torcedor VARCHAR(120) NOT NULL,
  documento VARCHAR(30) NOT NULL,
  partida VARCHAR(120) NOT NULL,
  estadio VARCHAR(120) NOT NULL,
  setor VARCHAR(50) NOT NULL,
  assento VARCHAR(20) NOT NULL,
  valor NUMERIC(10, 2) NOT NULL,
  status VARCHAR(20) NOT NULL CHECK (status IN ('valido', 'utilizado', 'cancelado', 'suspeito', 'duplicado')),
  data_compra DATE NOT NULL,
  criado_em TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO ingressos
  (codigo, nome_torcedor, documento, partida, estadio, setor, assento, valor, status, data_compra)
VALUES
  ('CUP-2026-0001', 'Ana Souza', '11122233344', 'Brasil x Argentina', 'MetLife Stadium', 'A', 'A12', 450.00, 'valido', '2026-06-01'),
  ('CUP-2026-0002', 'Carlos Lima', '22233344455', 'Franca x Alemanha', 'AT&T Stadium', 'B', 'B21', 380.00, 'utilizado', '2026-06-02'),
  ('CUP-2026-0003', 'Marina Costa', '33344455566', 'Espanha x Japao', 'SoFi Stadium', 'C', 'C08', 320.00, 'cancelado', '2026-06-03'),
  ('CUP-2026-0004', 'Pedro Alves', '44455566677', 'Mexico x Canada', 'Azteca', 'D', 'D15', 290.00, 'suspeito', '2026-06-04'),
  ('CUP-2026-0005', 'Juliana Rocha', '55566677788', 'Portugal x Uruguai', 'Hard Rock Stadium', 'E', 'E19', 410.00, 'duplicado', '2026-06-05')
ON CONFLICT (codigo) DO NOTHING;
