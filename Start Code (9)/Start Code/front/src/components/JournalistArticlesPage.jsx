import { useParams, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { getArticlesByJournalistId } from "../services/api";

export default function JournalistArticlesPage() {
  const { id } = useParams();
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [journalist, setJournalist] = useState(null);

  useEffect(() => {
    fetchArticles();
  }, [id]);

  const fetchArticles = async () => {
    try {
      setLoading(true);
      const data = await getArticlesByJournalistId(id);
      setArticles(data);
      if (data.length > 0) {
        setJournalist({
          name: data[0].journalist_name,
          email: data[0].journalist_email,
          bio: data[0].journalist_bio,
        });
      } else {
        setJournalist(null);
      }
      setError("");
    } catch (err) {
      setError("Failed to fetch articles.");
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div>Loading articles...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      <h2>{journalist ? journalist.name : "Journalist"}</h2>
      {journalist && (
        <>
          {journalist.email && <div><strong>Email:</strong> {journalist.email}</div>}
          {journalist.bio && <div><strong>Bio:</strong> {journalist.bio}</div>}
        </>
      )}
      <h3>Articles by {journalist ? journalist.name : "this journalist"}:</h3>
      {articles.length === 0 ? (
        <div>No articles found.</div>
      ) : (
        <ul>
          {articles.map((article) => (
            <li key={article.id}>
              <Link to={`/articles/${article.id}`}>{article.title}</Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
} 