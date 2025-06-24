//
//  This repository shall:
//  - Connect to the database (using the pool provided by the database.js)
// -  Perfrom the SQL querries to implement the bellow API
//

import { pool } from "../utils/database.js";

// Get all articles
export async function getArticles() {
    // TODO
    const [rows] = await pool.query("SELECT * FROM articles");
    return rows;
}

// Get one article by ID
export async function getArticleById(id) {
    // TODO
    const [rows] = await pool.query("SELECT * FROM articles WHERE id = ?", [id]);
    return rows[0];
}

// Create a new article
export async function createArticle(article) {
    // TODO
    const { title, content, category, journalist_id } = article;
    const [result] = await pool.query(
        "INSERT INTO articles (title, content, category, journalist_id) VALUES (?, ?, ?, ?)",
        [title, content, category, journalist_id]
    );
    return { id: result.insertId, ...article };
}

// Update an article by ID
export async function updateArticle(id, updatedData) {
    // TODO
    const { title, content, category, journalist_id } = updatedData;
    await pool.query(
        "UPDATE articles SET title = ?, content = ?, category = ?, journalist_id = ? WHERE id = ?",
        [title, content, category, journalist_id, id]
    );
    return { id, ...updatedData };
}

// Delete an article by ID
export async function deleteArticle(id) {
    // TODO
    await pool.query("DELETE FROM articles WHERE id = ?", [id]);
    return { id };
}

// Get all articles with journalist info (JOIN)
export async function getArticlesWithJournalist() {
    const [rows] = await pool.query(`
        SELECT a.*, j.name AS journalist_name, j.email AS journalist_email, j.bio AS journalist_bio
        FROM articles a
        LEFT JOIN journalists j ON a.journalist_id = j.id
    `);
    return rows;
}

// Get articles by journalist ID (JOIN)
export async function getArticlesByJournalistId(journalistId) {
    const [rows] = await pool.query(`
        SELECT a.*, j.name AS journalist_name, j.email AS journalist_email, j.bio AS journalist_bio
        FROM articles a
        LEFT JOIN journalists j ON a.journalist_id = j.id
        WHERE a.journalist_id = ?
    `, [journalistId]);
    return rows;
}

// Get single article with journalist info (JOIN)
export async function getArticleWithJournalistById(id) {
    const [rows] = await pool.query(`
        SELECT a.*, j.name AS journalist_name, j.email AS journalist_email, j.bio AS journalist_bio
        FROM articles a
        LEFT JOIN journalists j ON a.journalist_id = j.id
        WHERE a.id = ?
    `, [id]);
    return rows[0];
}

// Get all categories
export async function getAllCategories() {
    const [rows] = await pool.query('SELECT * FROM categories');
    return rows;
}

// Get all articles filtered by category, using JOIN to include category name
export async function getArticlesByCategoryId(categoryId) {
    const [rows] = await pool.query(`
        SELECT a.*, j.name AS journalist_name, j.email AS journalist_email, j.bio AS journalist_bio, c.name AS category_name
        FROM articles a
        LEFT JOIN journalists j ON a.journalist_id = j.id
        JOIN article_categories ac ON a.id = ac.article_id
        JOIN categories c ON ac.category_id = c.id
        WHERE c.id = ?
    `, [categoryId]);
    return rows;
}

// Get all articles filtered by multiple categories (array of category IDs)
export async function getArticlesByCategoryIds(categoryIds) {
    // Build placeholders for SQL IN clause
    const placeholders = categoryIds.map(() => '?').join(',');
    const [rows] = await pool.query(`
        SELECT a.*, j.name AS journalist_name, j.email AS journalist_email, j.bio AS journalist_bio, GROUP_CONCAT(c.name) AS category_names
        FROM articles a
        LEFT JOIN journalists j ON a.journalist_id = j.id
        JOIN article_categories ac ON a.id = ac.article_id
        JOIN categories c ON ac.category_id = c.id
        WHERE c.id IN (${placeholders})
        GROUP BY a.id
    `, categoryIds);
    return rows;
}
