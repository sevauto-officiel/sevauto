document.addEventListener('DOMContentLoaded', () => {
  const container = document.getElementById('articles-container');
  if (!container) return;

  fetch('articles.json', { cache: 'no-store' })
    .then(response => {
      if (!response.ok) throw new Error('Fichier articles.json introuvable');
      return response.json();
    })
    .then(data => renderArticles(container, Array.isArray(data.articles) ? data.articles : []))
    .catch(() => {
      container.innerHTML = '<div class="empty-state">Impossible de charger les articles pour le moment.</div>';
    });
});

function renderArticles(container, articles) {
  if (!articles.length) {
    container.innerHTML = '<div class="empty-state">Aucun article pour le moment. Revenez bientôt !</div>';
    return;
  }

  const sorted = [...articles].sort((a, b) => new Date(b.date || 0) - new Date(a.date || 0));

  container.innerHTML = sorted.map(article => {
    const dateLabel = formatDate(article.date);
    const cover = article.image
      ? `<img class="article-cover" src="${escapeAttr(article.image)}" alt="${escapeAttr(article.title || 'Article AKMServive')}" loading="lazy" decoding="async">`
      : '';
    const body = article.body ? renderMarkdown(article.body) : '';
    const summary = article.summary ? `<p class="article-summary">${escapeHtml(article.summary)}</p>` : '';

    return `
      <article class="panel article-card">
        ${cover}
        <div class="article-body">
          ${dateLabel ? `<p class="eyebrow compact">${dateLabel}</p>` : ''}
          <h2>${escapeHtml(article.title || 'Sans titre')}</h2>
          ${summary}
          <div class="article-content">${body}</div>
        </div>
      </article>
    `;
  }).join('');

  if (window.refreshReveals) window.refreshReveals();
}

function renderMarkdown(markdown) {
  const html = window.marked ? window.marked.parse(markdown) : escapeHtml(markdown);
  return window.DOMPurify ? window.DOMPurify.sanitize(html) : html;
}

function formatDate(value) {
  if (!value) return '';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '';
  return date.toLocaleDateString('fr-FR', { year: 'numeric', month: 'long', day: 'numeric' });
}

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

function escapeAttr(value) {
  return escapeHtml(value).replace(/"/g, '&quot;');
}
