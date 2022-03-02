\c nc_news_test

SELECT comments.comment_id, comments.article_id, comments.author, comments.votes, articles.article_id, articles.author, articles.created_at 
FROM comments
JOIN articles ON comments.article_id = articles.article_id;

SELECT comments.comment_id, comments.article_id, comments.author, comments.votes, articles.article_id, articles.author, articles.created_at 
FROM comments
RIGHT JOIN articles ON comments.article_id = articles.article_id;

SELECT articles.article_id, articles.author, articles.created_at, comments.comment_id, comments.article_id, comments.author, comments.votes 
FROM articles
LEFT JOIN comments ON comments.article_id = articles.article_id
ORDER BY articles.article_id ASC;