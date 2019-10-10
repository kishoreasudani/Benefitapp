const DB_CONFIG = {
  NAME: 'TABLE NAME',
  VERSION: '0.0.1',
  DESCRIPTION: 'Local database (replica of live) for offline work',
  SIZE: 1,
};
const TABLES = [{
  name: "name of talbe",
  property: "id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL , name VARCHR(255)"
}];
export {DB_CONFIG, TABLES};