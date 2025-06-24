import * as articleRepository from "../repositories/sqlArticleRepository.js";

// TODO : Change articleRepository to use the sqlArticleRepository

// GET /api/articles
export async function getAllArticles(req, res) {
  try {
    const articles = await articleRepository.getArticles();
    res.json(articles);
  } catch (error) {
    console.error("Error fetching articles:", error);
    res.status(500).json({ message: "Server error" });
  }
}

// GET /api/articles/:id
export async function getArticleById(req, res) {
  try {
    const article = await articleRepository.getArticleById(req.params.id);
    if (!article) {
      return res.status(404).json({ message: "Article not found" });
    }
    res.json(article);
  } catch (error) {
    console.error("Error fetching article:", error);
    res.status(500).json({ message: "Server error" });
  }
}

// POST /api/articles
export async function createArticle(req, res) {
  try {
    const newArticle = await articleRepository.createArticle(req.body);
    res.status(201).json(newArticle);
  } catch (error) {
    console.error("Error creating article:", error);
    res.status(500).json({ message: "Server error" });
  }
}

// PUT /api/articles/:id
export async function updateArticle(req, res) {
  try {
    const updatedArticle = await articleRepository.updateArticle(
      req.params.id,
      req.body
    );
    if (!updatedArticle) {
      return res.status(404).json({ message: "Article not found" });
    }
    res.json(updatedArticle);
  } catch (error) {
    console.error("Error updating article:", error);
    res.status(500).json({ message: "Server error" });
  }
}

// DELETE /api/articles/:id
export async function deleteArticle(req, res) {
  try {
    await articleRepository.deleteArticle(req.params.id);
    res.status(204).send();
  } catch (error) {
    console.error("Error deleting article:", error);
    res.status(500).json({ message: "Server error" });
  }
}

// GET /api/articles/with-journalist
export async function getAllArticlesWithJournalist(req, res) {
  try {
    const articles = await articleRepository.getArticlesWithJournalist();
    res.json(articles);
  } catch (error) {
    console.error("Error fetching articles with journalist:", error);
    res.status(500).json({ message: "Server error" });
  }
}

// GET /api/journalists/:id/articles
export async function getArticlesByJournalistId(req, res) {
  try {
    const articles = await articleRepository.getArticlesByJournalistId(req.params.id);
    res.json(articles);
  } catch (error) {
    console.error("Error fetching articles by journalist:", error);
    res.status(500).json({ message: "Server error" });
  }
}

// GET /api/articles/:id/with-journalist
export async function getArticleWithJournalistById(req, res) {
  try {
    const article = await articleRepository.getArticleWithJournalistById(req.params.id);
    console.log("Fetched article:", article);
    if (!article) {
      return res.status(404).json({ message: "Article not found" });
    }
    res.json(article);
  } catch (error) {
    console.error("Error fetching article with journalist:", error);
    res.status(500).json({ message: "Server error" });
  }
}

// GET /api/categories
export async function getAllCategories(req, res) {
  try {
    const categories = await articleRepository.getAllCategories();
    res.json(categories);
  } catch (error) {
    console.error("Error fetching categories:", error);
    res.status(500).json({ message: "Server error" });
  }
}

// GET /api/categories/:id/articles
export async function getArticlesByCategoryId(req, res) {
  try {
    const articles = await articleRepository.getArticlesByCategoryId(req.params.id);
    res.json(articles);
  } catch (error) {
    console.error("Error fetching articles by category:", error);
    res.status(500).json({ message: "Server error" });
  }
}

// GET /api/categories?ids=1,2,3
export async function getArticlesByCategoryIds(req, res) {
  try {
    const ids = req.query.ids ? req.query.ids.split(',').map(Number) : [];
    if (ids.length === 0) {
      return res.status(400).json({ message: "No category IDs provided" });
    }
    const articles = await articleRepository.getArticlesByCategoryIds(ids);
    res.json(articles);
  } catch (error) {
    console.error("Error fetching articles by categories:", error);
    res.status(500).json({ message: "Server error" });
  }
}
