
import initSqlJs from 'sql.js';
import localforage from 'localforage';
import { BookDefinition, GenericEntry, AllDataBooks, FieldDefinition, DataDesaEntry, DATA_DESA_KEY } from '../types';
import { DATA_DESA_FIELDS } from '../constants';


const SQL_JS_WASM_PATH = 'https://esm.sh/sql.js@1.10.3/dist/sql-wasm.wasm';
const DB_NAME_INDEXEDDB = 'digital_desa_db';
const DB_STORE_KEY = 'sqlite_database';
const DATA_DESA_TABLE_NAME = DATA_DESA_KEY; // 'data_desa_umum'
const LOCAL_INSTALLATION_TOKEN_KEY = 'local_installation_token';

let SQL: initSqlJs.SqlJsStatic;
let dbInstance: initSqlJs.Database | null = null; 

// Function to generate a simple UUID
function generateUUID() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}

export async function getSqlJsStatic(): Promise<initSqlJs.SqlJsStatic> {
  if (!SQL) {
    SQL = await initSqlJs({
      // Using locateFile as an alternative to mainWasmUrl
      locateFile: (file: string) => {
        if (file === 'sql-wasm.wasm') {
          return SQL_JS_WASM_PATH;
        }
        // sql.js might request other files in some scenarios, though unlikely for basic setup.
        // Returning the filename itself might cause issues if those files are not co-located.
        // However, for sql-wasm.wasm, this provides the correct CDN path.
        return file;
      }
    });
  }
  return SQL;
}

function mapJsTypeToSqliteType(jsType: FieldDefinition['type']): string {
  switch (jsType) {
    case 'number':
      return 'REAL'; 
    case 'text':
    case 'textarea':
    case 'date':
    case 'select':
    case 'file': // Store file (base64 data URL) as TEXT
    default:
      return 'TEXT';
  }
}

function createTableForBook(db: initSqlJs.Database, book: BookDefinition): void {
  if (book.key === DATA_DESA_TABLE_NAME || book.fields.length === 0) {
    return;
  }
  const columns = book.fields
    .map(field => `"${field.name}" ${mapJsTypeToSqliteType(field.type)}`)
    .join(', ');
  const createTableSql = `CREATE TABLE IF NOT EXISTS "${book.key}" (id INTEGER PRIMARY KEY AUTOINCREMENT, ${columns});`;
  try {
    db.run(createTableSql);
  } catch (e) {
    console.error(`Gagal membuat tabel ${book.key}:`, e);
    console.error("SQL:", createTableSql);
  }
}

async function createDataDesaTableIfNotExists(db: initSqlJs.Database): Promise<void> {
  // Add installation_id to DATA_DESA_FIELDS definition if not already present for schema creation
  const allDataDesaFields = [...DATA_DESA_FIELDS];
  if (!allDataDesaFields.find(f => f.name === 'installation_id')) {
    allDataDesaFields.push({ name: 'installation_id', label: 'Installation ID', type: 'text' });
  }

  const columns = allDataDesaFields
    .map(field => `"${field.name}" ${mapJsTypeToSqliteType(field.type)}`)
    .join(', ');
  const createTableSql = `CREATE TABLE IF NOT EXISTS "${DATA_DESA_TABLE_NAME}" (id INTEGER PRIMARY KEY, ${columns});`;
  try {
    db.run(createTableSql);
    console.log(`Tabel ${DATA_DESA_TABLE_NAME} berhasil diperiksa/dibuat.`);
  } catch (e) {
    console.error(`Gagal membuat tabel ${DATA_DESA_TABLE_NAME}:`, e);
    console.error("SQL:", createTableSql);
  }
}

export async function saveDatabaseToIndexedDB(db: initSqlJs.Database): Promise<void> {
  try {
    const dbBinary = db.export();
    await localforage.setItem(DB_STORE_KEY, dbBinary);
    console.log('Database berhasil disimpan ke IndexedDB.');
  } catch (error) {
    console.error('Gagal menyimpan database ke IndexedDB:', error);
  }
}

async function loadDatabaseFromIndexedDB(): Promise<Uint8Array | null> {
  try {
    const dbBinary = await localforage.getItem<Uint8Array>(DB_STORE_KEY);
    if (dbBinary) {
      console.log('Database berhasil dimuat dari IndexedDB.');
      return dbBinary;
    }
  } catch (error) {
    console.error('Gagal memuat database dari IndexedDB:', error);
  }
  return null;
}

export async function initializeDatabase(menuItems: BookDefinition[]): Promise<initSqlJs.Database> {
  const SQL = await getSqlJsStatic();
  const dbBinary = await loadDatabaseFromIndexedDB();
  let currentDb: initSqlJs.Database;

  if (dbBinary) {
    currentDb = new SQL.Database(dbBinary);
  } else {
    currentDb = new SQL.Database();
    console.log('Membuat database baru dan skema awal.');
  }
  
  await createDataDesaTableIfNotExists(currentDb);
  menuItems.forEach(book => {
      if (book.key !== DATA_DESA_TABLE_NAME && book.fields.length > 0) {
          const checkTableSql = `SELECT name FROM sqlite_master WHERE type='table' AND name='${book.key}';`;
          const result = currentDb.exec(checkTableSql);
          if (!result || result.length === 0 || result[0].values.length === 0) {
              console.log(`Tabel ${book.key} tidak ditemukan, membuat...`);
              createTableForBook(currentDb, book);
          }
      }
  });

  if (!dbBinary) { 
    await saveDatabaseToIndexedDB(currentDb);
  }
  
  return currentDb; 
}

function convertSqlResultToObjects(result: initSqlJs.QueryExecResult[] | undefined): GenericEntry[] {
    if (!result || result.length === 0 || !result[0]?.values || !result[0]?.columns) {
        return [];
    }
    const { columns, values } = result[0];
    return values.map(row => {
        const obj: GenericEntry = { id: 0 }; 
        columns.forEach((col, index) => {
            const value = row[index];
            obj[col] = value === null ? undefined : value;
        });
        return obj;
    });
}


export async function getAllEntries(db: initSqlJs.Database, bookKey: string): Promise<GenericEntry[]> {
  if (bookKey === DATA_DESA_TABLE_NAME) {
      console.warn(`Gunakan getDataDesa untuk mengambil data dari ${DATA_DESA_TABLE_NAME}`);
      return [];
  }
  try {
    const results = db.exec(`SELECT * FROM "${bookKey}"`);
    return convertSqlResultToObjects(results);
  } catch (e) {
    console.error(`Error mengambil entri dari ${bookKey}:`, e);
    return [];
  }
}

export async function addEntry(db: initSqlJs.Database, bookKey: string, entryData: Omit<GenericEntry, 'id'>, fields: FieldDefinition[]): Promise<number> {
  const columnNames = fields.map(f => `"${f.name}"`).join(', ');
  const placeholders = fields.map(() => '?').join(', ');
  const values = fields.map(f => entryData[f.name] !== undefined ? entryData[f.name] : null);

  const sql = `INSERT INTO "${bookKey}" (${columnNames}) VALUES (${placeholders})`;
  
  try {
    db.prepare(sql).run(values);
    const res = db.exec("SELECT last_insert_rowid()");
    const newId = res[0].values[0][0] as number;
    await saveDatabaseToIndexedDB(db);
    return newId;
  } catch (e) {
    console.error(`Gagal menambah entri ke ${bookKey}:`, e);
    console.error("SQL:", sql);
    console.error("Values:", values);
    throw e;
  }
}

export async function updateEntry(db: initSqlJs.Database, bookKey: string, entryData: GenericEntry, fields: FieldDefinition[]): Promise<void> {
  const setClauses = fields.map(f => `"${f.name}" = ?`).join(', ');
  const values = fields.map(f => entryData[f.name] !== undefined ? entryData[f.name] : null);
  values.push(entryData.id);

  const sql = `UPDATE "${bookKey}" SET ${setClauses} WHERE id = ?`;
  
  try {
    db.prepare(sql).run(values);
    await saveDatabaseToIndexedDB(db);
  } catch (e) {
    console.error(`Gagal memperbarui entri di ${bookKey} (ID: ${entryData.id}):`, e);
    console.error("SQL:", sql);
    console.error("Values:", values);
    throw e;
  }
}

export async function deleteDbEntry(db: initSqlJs.Database, bookKey: string, id: number): Promise<void> {
  const sql = `DELETE FROM "${bookKey}" WHERE id = ?`;
  try {
    db.prepare(sql).run([id]);
    await saveDatabaseToIndexedDB(db);
  } catch (e) {
    console.error(`Gagal menghapus entri dari ${bookKey} (ID: ${id}):`, e);
    console.error("SQL:", sql);
    throw e;
  }
}

export async function loadAllDataFromDb(db: initSqlJs.Database, menuItems: BookDefinition[]): Promise<AllDataBooks> {
  const allData: AllDataBooks = {};
  for (const book of menuItems) {
    if (book.key === DATA_DESA_TABLE_NAME || book.fields.length === 0) continue; 
    try {
      allData[book.key] = await getAllEntries(db, book.key);
    } catch (e) {
      console.error(`Gagal memuat data untuk buku ${book.key}:`, e);
      allData[book.key] = [];
    }
  }
  return allData;
}

export async function getDataDesa(db: initSqlJs.Database): Promise<DataDesaEntry | null> {
  try {
    const results = db.exec(`SELECT * FROM "${DATA_DESA_TABLE_NAME}" WHERE id = 1`);
    const entries = convertSqlResultToObjects(results);
    return entries.length > 0 ? (entries[0] as DataDesaEntry) : null;
  } catch (e) {
    console.warn(`Error mengambil data dari ${DATA_DESA_TABLE_NAME}:`, e);
    return null;
  }
}

export async function saveDataDesa(db: initSqlJs.Database, data: Omit<DataDesaEntry, 'id'>): Promise<void> {
  // Fetch current entry to check for existing installation_id
  const currentEntryInDb = await getDataDesa(db);
  let finalData = { ...data };
  let newInstallationId: string | undefined = undefined;

  if (!currentEntryInDb?.installation_id) {
    newInstallationId = generateUUID();
    finalData.installation_id = newInstallationId;
    console.log("Generated new installation ID:", newInstallationId);
  } else {
    // Preserve existing installation_id if it exists
    finalData.installation_id = currentEntryInDb.installation_id;
  }

  const fields = [...DATA_DESA_FIELDS];
  if (!fields.find(f => f.name === 'installation_id')) {
    fields.push({ name: 'installation_id', label: 'Installation ID', type: 'text' });
  }

  const columnNames = fields.map(f => `"${f.name}"`).join(', ');
  const placeholders = fields.map(() => '?').join(', ');
  
  const allColumnNames = `"id", ${columnNames}`;
  const allPlaceholders = `?, ${placeholders}`;
  
  const values = [1, ...fields.map(f => (finalData as any)[f.name] !== undefined ? (finalData as any)[f.name] : null)];

  const sql = `INSERT OR REPLACE INTO "${DATA_DESA_TABLE_NAME}" (${allColumnNames}) VALUES (${allPlaceholders})`;

  try {
    db.prepare(sql).run(values);
    await saveDatabaseToIndexedDB(db);
    console.log(`Data Desa berhasil disimpan/diperbarui.`);

    // If a new installation ID was generated and saved to DB, also save to localStorage
    if (newInstallationId) {
      localStorage.setItem(LOCAL_INSTALLATION_TOKEN_KEY, newInstallationId);
      console.log("Local installation token set in localStorage.");
    }
  } catch (e) {
    console.error(`Gagal menyimpan Data Desa:`, e);
    console.error("SQL:", sql);
    console.error("Data:", finalData);
    console.error("Values:", values);
    throw e;
  }
}
    