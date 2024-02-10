// import initSqlJs from 'sql.js';

// console.log("Loading WebAssembly file from:", import.meta.url);

// export { initSqlJs };
// // Initialize SQLite database and create tables
// const initializeDatabase = async () => {
//     try {
//         // Log the file path or URL to ensure it's correct
//         console.log("Loading WebAssembly file from:", '/path/to/sql-wasm.wasm');
        
//         // Load the WebAssembly file
//         const response = await fetch('/path/to/sql-wasm.wasm');
        
//         // Check if the response is successful
//         if (!response.ok) {
//             throw new Error('Failed to fetch WebAssembly file');
//         }
        
//         // Convert the response body to ArrayBuffer
//         const buffer = await response.arrayBuffer();
        
//         // Initialize SQLite with the WebAssembly binary
//         const SQL = await initSqlJs({ locateFile: () => '/path/to/sql-wasm.wasm' });
//         const db = new SQL.Database(buffer);
        
//         // Database initialization successful, you can perform further operations here
        
//         return db; // Return the initialized database instance
//     } catch (error) {
//         console.error('Error initializing database:', error);
//         throw error; // Rethrow the error for handling elsewhere
//     }
// };

//     const createDatabase = async () => {
//     const SQL = await initSqlJs(); // Load the SQL.js library
//     const db = new SQL.Database(); // Create an in-memory SQLite database

//     console.log("dataaaaaaaaaaaaaaaaaaa")
//     // // Create users table
//     // db.run(`
//     //     CREATE TABLE IF NOT EXISTS users (
//     //         id INTEGER PRIMARY KEY,
//     //         fullname TEXT,
//     //         email TEXT,
//     //         password TEXT
//     //     )
//     // `);

//     // // Create doctors table
//     // db.run(`
//     //     CREATE TABLE IF NOT EXISTS doctors (
//     //         id INTEGER PRIMARY KEY,
//     //         name TEXT,
//     //         free_date DATE,
//     //         free_time TIME
//     //     )
//     // `);

//     // return db; // Return the initialized database instance
// };

// export { initializeDatabase, createDatabase };
