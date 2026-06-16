import { query } from './db';

type StockColumn = 'stock' | 'stock_minimo';

let cachedStockColumn: StockColumn | null = null;

export async function getStockColumn(): Promise<StockColumn> {
  if (cachedStockColumn) return cachedStockColumn;

  const columns = await query(
    `SELECT COLUMN_NAME as column_name
     FROM information_schema.columns
     WHERE table_schema = DATABASE()
       AND table_name = 'productos'
       AND column_name IN (?, ?)`,
    ['stock', 'stock_minimo']
  );

  const rows = columns as Array<{ column_name: string }>;

  if (rows.some((row) => row.column_name === 'stock')) {
    cachedStockColumn = 'stock';
  } else {
    cachedStockColumn = 'stock_minimo';
  }

  return cachedStockColumn;
}
