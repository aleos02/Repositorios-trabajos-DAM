import { Injectable } from '@angular/core';
import { SQLiteDBConnection } from '@capacitor-community/sqlite';
import { SQLiteService } from './sqlite.service';
import { Task } from '../models/task';

@Injectable({
    providedIn: 'root'
})
export class TaskService {
    public tasks: Task[] = [];
    public categorias: any[] = [];
    private db!: SQLiteDBConnection;
    private readonly DB_NAME = 'tasks_db';

    constructor(private sqliteService: SQLiteService) { }

    /**
     * Initializes the plugin, opens the database, and creates the table.
     */
    async initializeFull() {
        // 1. Initialize SQLite plugin
        await this.sqliteService.initializePlugin();

        // 2. Initialize web store if on web platform
        if (this.sqliteService.platform === 'web') {
            await this.sqliteService.initWebStore();
        }

        // 3. Open the database (creates it if it doesn't exist)
        this.db = await this.sqliteService.openDatabase(this.DB_NAME, false, 'no-encryption', 1, false);

        // 4. Create tasks table if it doesn't exist
        const sqlCreateCategories = `CREATE TABLE IF NOT EXISTS categories (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL UNIQUE);`

        const sqlCreateItems = `
      CREATE TABLE IF NOT EXISTS items (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    quantity INTEGER DEFAULT 0,
    category_id INTEGER NOT NULL,
    FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE CASCADE
        );`

        await this.db.execute(sqlCreateCategories);
        await this.db.execute(sqlCreateItems);

        // 5. Load initial tasks
        await this.loadTasks();
    }

    async loadTasks() {
        const res = await this.db.query(`
            SELECT items.*, categories.name as categoryName 
            FROM items 
            INNER JOIN categories ON items.category_id = categories.id
            `);
        this.tasks = res.values ? res.values : [];
        const resCat = await this.db.query('SELECT * FROM categories');
        this.categorias = resCat.values ? resCat.values : [];
        return this.tasks;
    }

    async addTask(title: string, quantity: number, category_id:number) {
        const sql = 'INSERT INTO items (name, quantity, category_id) VALUES (?, ?, ?)';
        await this.db.run(sql, [title, quantity, category_id]);
        await this.saveAndRefresh();
    }

    async updateTask(item: Task) {
        const sql = 'UPDATE items SET name = ?, quantity = ?, category_id = ? WHERE id = ?';
        await this.db.run(sql, [item.name, item.quantity, item.category_id, item.id]);
        await this.saveAndRefresh();
    }

    async deleteTask(id: number) {
        const sql = 'DELETE FROM items WHERE id = ?';
        await this.db.run(sql, [id]);
        await this.saveAndRefresh();
    }

    async insertTask(){
        const res = await this.db.query('SELECT * FROM categories');
        if(res.values && res.values.length === 0){
            const sqlCategory = `INSERT INTO categories (name) VALUES (?);`
            await this.db.run(sqlCategory, ['Botiquín']);
            await this.db.run(sqlCategory, ['Objetos']);
            await this.db.run(sqlCategory, ['Pokeballs']);
            await this.db.run(sqlCategory, ['MTs y MOs']);
            await this.db.run(sqlCategory, ['Objetos Clave']);
        }
        this.categorias = res.values ? res.values : [];
        const resTask = await this.db.query('SELECT * FROM items');
        if(resTask.values && resTask.values.length === 0){
            const sqlInsertTasks = `INSERT INTO items (name, quantity, category_id) VALUES (?, ?, ?);`
            await this.db.run(sqlInsertTasks, ['Restaurar todo', 10, 1]);
            await this.db.run(sqlInsertTasks, ['Mineral evolutivo', 5, 2]);
            await this.db.run(sqlInsertTasks, ['Master Ball', 6, 3]);
            await this.db.run(sqlInsertTasks, ['MT27 Fisura', 1, 4]);
            await this.db.run(sqlInsertTasks, ['Caña Vieja', 1, 5]);
        }
    }

    async resetTotal() {
        await this.db.execute('DELETE FROM items;');
        await this.db.execute('DELETE FROM categories;');
    
        await this.db.execute("DELETE FROM sqlite_sequence WHERE name='items';");
        await this.db.execute("DELETE FROM sqlite_sequence WHERE name='categories';");
    
        await this.saveAndRefresh();
    }

    async buscarObjetos(texto: string) {
        const res = await this.db.query(`
            SELECT items.*, categories.name as categoryName 
            FROM items 
            INNER JOIN categories ON items.category_id = categories.id
            WHERE items.name LIKE ? OR categories.name LIKE ?`, [`%${texto}%`, `%${texto}%`]
            );
        this.tasks = res.values ? res.values : [];
        return this.tasks;
    }

    async addCategoria(nombre: string) {
        const sql = 'INSERT INTO categories (name) VALUES (?)';
        await this.db.run(sql, [nombre]);
        await this.saveAndRefresh();
    }

    async subirStock(item: Task) {
        const sql = 'UPDATE items SET quantity = quantity + 1 WHERE id = ?';
        await this.db.run(sql, [item.id]);
        await this.saveAndRefresh();
    }

    async bajarStock(item: Task) {
        if(item.quantity! <= 0) return;
        const sql = 'UPDATE items SET quantity = quantity - 1 WHERE id = ?';
        await this.db.run(sql, [item.id]);
        await this.saveAndRefresh();
    }

    async deleteCategoria(id: number) {
        const sql = 'DELETE FROM categories WHERE id = ?';
        await this.db.run(sql, [id]);
        await this.saveAndRefresh();
    }

    /**
     * Syncs database to browser storage (IndexedDB) on web platform
     */
    private async saveAndRefresh() {
        if (this.sqliteService.platform === 'web') {
            await this.sqliteService.sqliteConnection.saveToStore(this.DB_NAME);
        }
        await this.loadTasks();
    }
}
