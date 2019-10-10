import SQLite from "react-native-sqlite-2";

import {DB_CONFIG} from "../config/dbConfig";

const db = SQLite.openDatabase(
  DB_CONFIG.NAME + ".db",
  DB_CONFIG.VERSION,
  DB_CONFIG.DESCRIPTION,
  DB_CONFIG.SIZE
);

/**
 * SQL CREATE table operation
 * @param {string} tableName
 * @param {string ',' separated values} columns
 * @param {function} callbackData
 */
const executeCreate = async (tableName = '', columns = '') => {
  return new Promise(function (resolve, reject) {
    try {
      const query = "CREATE TABLE IF NOT EXISTS " + tableName + "(" + columns + ")";
      console.log(query);
      db.transaction((txn) => {
        txn.executeSql(query, [], function (tx, res) {
          let response = {};
          response['txn'] = tx;
          response['res'] = res;
          resolve(response);
        }, (err) => {
          reject(err)
        });
      });
    } catch (e) {
      console.log('Table Creation execution error', e);
      reject(e);
    }
  })
};

/**
 * SQL INSERT operation
 * @param {string} tableName
 * @param {string ',' separated values} columns
 * @param {array of values} params
 * @param {function} callbackData
 */
const executeInsert = async (tableName = '', columns = '', params = []) => {
  const values = ':' + columns.split(',').join(',:');
  return new Promise(function (resolve, reject) {
    try {
      const query = "INSERT INTO " + tableName + " (" + columns + ") VALUES (" + values + ")";
      console.log(query);
      db.transaction((txn) => {
        txn.executeSql(query, params, function (tx, res) {
          let response = {};
          response['txn'] = tx;
          response['res'] = res;
          resolve(response);
        }, (err) => {
          reject(err)
        });
      });
    } catch (e) {
      console.log('Insert execution error', e);
      reject(e);
    }
  })
};

/**
 * SQL SELECT, JOIN or any Query operation
 * @param {string} query
 * @param {array of values} params
 * @param {function} callbackData
 */
const executeQuery = async (query = '', params = []) => {
  return new Promise(function (resolve, reject) {
    try {
      console.log(query);
      db.transaction((txn) => {
        txn.executeSql(query, params, function (tx, res) {
          let response = {};
          response['txn'] = tx;
          response['res'] = res;
          resolve(response);
        }, err => {
          reject(err)
        });
      });
    } catch (e) {
      console.log('Query execution error', e);
      reject(e);
    }
  })
};

/**
 * SQL DELETE operation
 * @param {string} tableName
 * @param {string} conditions
 * @param {function} callbackData
 */
const executeDelete = async (tableName, conditions = null) => {
  const whereCondition = conditions != null ? ' WHERE ' + conditions : '';
  return new Promise(function (resolve, reject) {
    try {
      const query = "DELETE FROM " + tableName + whereCondition;
      console.log(query);
      db.transaction((txn) => {
        txn.executeSql(query, [], function (tx, res) {
          let response = {};
          response['txn'] = tx;
          response['res'] = res;
          resolve(response);
        }, err => {
          reject(err)
        });
      });
    } catch (e) {
      console.log('Delete execution error', e);
      reject(e);
    }
  })
};

/**
 * SQL DROP operation
 * @param {string} tableName
 * @param {function} callbackData
 */
const executeDrop = async (tableName) => {
  return new Promise(function (resolve, reject) {
    try {
      const query = "DROP TABLE IF EXISTS " + tableName;
      console.log(query);
      db.transaction((txn) => {
        txn.executeSql(query, [], function (tx, res) {
          let response = {};
          response['txn'] = tx;
          response['res'] = res;
          resolve(response);
        }, err => {
          reject(err)
        });
      });
    } catch (e) {
      console.log('Drop table execution error', e);
      reject(e);
    }
  })
};

const DBService = {
  Create: executeCreate,
  Insert: executeInsert,
  Query: executeQuery,
  Delete: executeDelete,
  Drop: executeDrop,
};

export {DBService};
