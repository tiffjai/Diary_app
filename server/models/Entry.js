const db = require('../db/connect');

class Entry {
    constructor({ id, user_id, date, text, category }) {
        this.id = id;
        this.user_id = user_id;
        this.date = new Date(date); // Ensure date is a Date object
        this.text = text;
        this.category = category;
    }

    static async create({ user_id, date, text, category }) {
        const result = await db.query(
            'INSERT INTO entries (user_id, date, text, category) VALUES ($1, $2, $3, $4) RETURNING *',
            [user_id, date, text, category]
        );
        return new Entry(result.rows[0]);
    }

    static async findById(id) {
        const result = await db.query('SELECT * FROM entries WHERE id = $1', [id]);
        return result.rows.length ? new Entry(result.rows[0]) : null;
    }

    static async findAll({ date, month, year, category }) {
        let query = 'SELECT * FROM entries WHERE 1=1';
        const params = [];

        if (date) {
            query += ' AND date::DATE = $1';
            params.push(date);
        }
        if (month) {
            query += ' AND EXTRACT(MONTH FROM date) = $2';
            params.push(month);
        }
        if (year) {
            query += ' AND EXTRACT(YEAR FROM date) = $3';
            params.push(year);
        }
        if (category) {
            query += ' AND category = $4';
            params.push(category);
        }

        query += ' ORDER BY date DESC';

        const result = await db.query(query, params);
        return result.rows.map(row => new Entry(row));
    }

    async update() {
        const result = await db.query(
            'UPDATE entries SET date = $1, text = $2, category = $3 WHERE id = $4 RETURNING *',
            [this.date, this.text, this.category, this.id]
        );
        Object.assign(this, result.rows[0]);
    }

    async delete() {
        await db.query('DELETE FROM entries WHERE id = $1', [this.id]);
    }
}

module.exports = Entry;
