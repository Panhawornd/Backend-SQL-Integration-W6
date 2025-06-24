import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { getArticles, removeArticle, getCategories, getArticlesByCategoryIds } from "../services/api";

//
// ArticleList component
//
export default function ArticleList() {
  const [articles, setArticles] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [categories, setCategories] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]);

  const navigate = useNavigate();

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    fetchArticles();
  }, [selectedCategories]);

  const fetchCategories = async () => {
    try {
      const data = await getCategories();
      setCategories(data);
    } catch (err) {
      setCategories([]);
    }
  };

  const fetchArticles = async () => {
    setIsLoading(true);
    setError("");
    try {
      let data;
      if (selectedCategories.length > 0) {
        data = await getArticlesByCategoryIds(selectedCategories);
      } else {
        data = await getArticles();
      }
      setArticles(data);
    } catch (err) {
      setError("Failed to load articles. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const deleteArticle = async (id) => {
    setIsLoading(true);
    setError("");
    try {
      await removeArticle(id);
      await fetchArticles(); // refresh the list
    } catch (err) {
      setError("Failed to delete article.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleView = (id) => navigate(`/articles/${id}`);

  const handleEdit = (id) => navigate(`/articles/${id}/edit`);

  const handleCategoryChange = (e) => {
    const value = parseInt(e.target.value);
    if (e.target.checked) {
      setSelectedCategories((prev) => [...prev, value]);
    } else {
      setSelectedCategories((prev) => prev.filter((id) => id !== value));
    }
  };

  return (
    <>
      <div style={{ marginBottom: 16 }}>
        <strong>Filter by Categories:</strong>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
          {categories.map((cat) => (
            <label key={cat.id} style={{ display: "flex", alignItems: "center", gap: 4 }}>
              <input
                type="checkbox"
                value={cat.id}
                checked={selectedCategories.includes(cat.id)}
                onChange={handleCategoryChange}
              />
              {cat.name}
            </label>
          ))}
        </div>
      </div>
      {isLoading && <p>Loading...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}
      <div className="article-list">
        {articles.map((article) => (
          <ArticleCard
            key={article.id}
            article={article}
            onView={handleView}
            onEdit={handleEdit}
            onDelete={deleteArticle}
          />
        ))}
      </div>
    </>
  );
}

function ArticleCard({ article, onView, onEdit, onDelete }) {
  // Support both single and multiple categories
  let categoryNames = article.category_names || article.category_name || article.category;
  if (typeof categoryNames === "string" && categoryNames.includes(",")) {
    categoryNames = categoryNames.split(",").map((c) => c.trim()).join(", ");
  }
  return (
    <div className="article-card">
      <div className="article-title">{article.title}</div>
      <div className="article-author">
        By {article.journalist_name ? (
          <Link to={`/journalists/${article.journalist_id}/articles`}>
            {article.journalist_name}
          </Link>
        ) : (
          "Unknown"
        )}
      </div>
      <div className="article-categories">
        <strong>Categories:</strong> {categoryNames || "None"}
      </div>
      <div className="article-actions">
        <button className="button-tertiary" onClick={() => onEdit(article.id)}>
          Edit
        </button>
        <button
          className="button-tertiary"
          onClick={() => onDelete(article.id)}
        >
          Delete
        </button>
        <button className="button-secondary" onClick={() => onView(article.id)}>
          View
        </button>
      </div>
    </div>
  );
}
