// In-memory database for quick testing
const db = {
  threat_signatures: [],
  scan_history: [],
  quarantine: [],
  file_monitors: [],
  monitor_events: [],
  _nextId: {
    threat_signatures: 1,
    scan_history: 1,
    quarantine: 1,
    file_monitors: 1,
    monitor_events: 1
  }
};

export async function initDatabase() {
  console.log('In-memory database initialized');
}

export function query(table) {
  return db[table] || [];
}

export function insert(table, data) {
  const id = db._nextId[table]++;
  const record = {
    id,
    ...data,
    created_at: new Date().toISOString()
  };
  db[table].push(record);
  return { lastInsertRowid: id, record };
}

export function update(table, id, data) {
  const index = db[table].findIndex(r => r.id === id);
  if (index !== -1) {
    db[table][index] = { ...db[table][index], ...data, updated_at: new Date().toISOString() };
  }
}

export function findById(table, id) {
  return db[table].find(r => r.id === id);
}

export function count(table, filter = () => true) {
  return db[table].filter(filter).length;
}

export function findAll(table, filter = () => true) {
  return db[table].filter(filter);
}
