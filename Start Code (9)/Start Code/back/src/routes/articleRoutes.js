import { Router } from "express";
import {
  getAllArticles,
  getArticleById,
  createArticle,
  updateArticle,
  deleteArticle,
  getAllArticlesWithJournalist,
  getArticleWithJournalistById,
  getAllCategories,
  getArticlesByCategoryId,
  getArticlesByCategoryIds
} from "../controllers/articleController.js";

const articleRouter = Router();
// Place category routes first so they are not shadowed by /:id
articleRouter.get("/categories", getAllCategories);
articleRouter.get("/categories/:id/articles", getArticlesByCategoryId);
articleRouter.get("/categories-articles", getArticlesByCategoryIds);

articleRouter.get("/with-journalist", getAllArticlesWithJournalist);
articleRouter.get("/:id/with-journalist", getArticleWithJournalistById);

articleRouter.get("/", getAllArticles);
articleRouter.get("/:id", getArticleById);
articleRouter.post("/", createArticle);
articleRouter.put("/:id", updateArticle);
articleRouter.delete("/:id", deleteArticle);

export default articleRouter;
