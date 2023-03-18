const sqlite3 = require('sqlite3').verbose();

// open the database connection
export function initDBIfNotExists() {
    let db = new sqlite3.Database('./data.db', (err) => {
        if (err) {
            console.error(err.message);
        }
    });

    db.serialize(() => {
        // Queries scheduled here will be serialized.
        db.run(`CREATE TABLE IF NOT EXISTS timings(
            id INTEGER NOT NULL PRIMARY KEY,
            subuh text,
            maghrib text
            )`);
        // if somehow the table is empty, insert a default row    
        db.get(`SELECT COUNT(*) as count FROM timings`, (err, row) => {
            if (row.count === 0) {
                db.run(`INSERT INTO timings (subuh, maghrib) VALUES ('5:30', '19:30')`);
            }
        });
    });
    return db;
}

