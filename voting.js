document.addEventListener('DOMContentLoaded', function() {
    const articleGrid = document.getElementById('article-grid');
    const articles = Array.from(document.querySelectorAll('.article-box'));

    // Initialize vote data from localStorage or set defaults
    const voteData = JSON.parse(localStorage.getItem('voteData')) || {
        articles: {
            'ai': { upvotes: 0, downvotes: 0 },
            'home-automation': { upvotes: 0, downvotes: 0 },
            'ux-design': { upvotes: 0, downvotes: 0 },
            'tech-history': { upvotes: 0, downvotes: 0 }
        },
        userVotes: {}
    };

    // Function to save vote data to localStorage
    function saveVoteData() {
        localStorage.setItem('voteData', JSON.stringify(voteData));
    }

    // Function to update vote display
    function updateVoteDisplay(article) {
        const articleId = article.dataset.articleId;
        const upvoteCount = article.querySelector('.upvote-count');
        const downvoteCount = article.querySelector('.downvote-count');
        const upvoteButton = article.querySelector('.upvote');
        const downvoteButton = article.querySelector('.downvote');

        upvoteCount.textContent = voteData.articles[articleId].upvotes;
        downvoteCount.textContent = voteData.articles[articleId].downvotes;

        // Check if the user has voted (either upvote or downvote)
        const hasVoted = voteData.userVotes[articleId] !== undefined;

        if (voteData.userVotes[articleId] === 'upvote') {
            upvoteButton.classList.add('active');
            downvoteButton.classList.remove('active');
            article.classList.add('voted'); // Highlight the article
        } else if (voteData.userVotes[articleId] === 'downvote') {
            downvoteButton.classList.add('active');
            upvoteButton.classList.remove('active');
            article.classList.add('voted'); // Highlight the article
        } else {
            upvoteButton.classList.remove('active');
            downvoteButton.classList.remove('active');
            article.classList.remove('voted'); // Remove highlight when vote is undone
        }
    }

    // Function to sort articles by net votes
    function sortArticles() {
        const sortedArticles = articles.sort((a, b) => {
            const aId = a.dataset.articleId;
            const bId = b.dataset.articleId;
            const aNetVotes = voteData.articles[aId].upvotes - voteData.articles[aId].downvotes;
            const bNetVotes = voteData.articles[bId].upvotes - voteData.articles[bId].downvotes;
            return bNetVotes - aNetVotes;
        });

        articleGrid.innerHTML = '';
        sortedArticles.forEach(article => {
            const articleLink = article.closest('.article-link');
            articleGrid.appendChild(articleLink);
        });
    }

    // Handle vote button clicks and prevent redirection
    document.querySelectorAll('.vote-button').forEach(button => {
        button.addEventListener('click', function(event) {
            event.stopPropagation();
            event.preventDefault();
            const article = this.closest('.article-box');
            const articleId = article.dataset.articleId;
            const action = this.dataset.action;

            const currentVote = voteData.userVotes[articleId];

            if (currentVote === action) {
                if (action === 'upvote') {
                    voteData.articles[articleId].upvotes--;
                } else {
                    voteData.articles[articleId].downvotes--;
                }
                delete voteData.userVotes[articleId];
            } else {
                if (currentVote === 'upvote') {
                    voteData.articles[articleId].upvotes--;
                } else if (currentVote === 'downvote') {
                    voteData.articles[articleId].downvotes--;
                }

                if (action === 'upvote') {
                    voteData.articles[articleId].upvotes++;
                    voteData.userVotes[articleId] = 'upvote';
                } else {
                    voteData.articles[articleId].downvotes++;
                    voteData.userVotes[articleId] = 'downvote';
                }
            }

            updateVoteDisplay(article);
            saveVoteData();
            sortArticles();
        });
    });

    // Handle Read More button clicks
    document.querySelectorAll('.read-more-btn').forEach(button => {
        button.addEventListener('click', function(event) {
            event.stopPropagation();
            const articleLink = this.closest('.article-link').querySelector('.article-content-link');
            if (articleLink) {
                window.location.href = articleLink.href;
            }
        });
    });

    // Initialize vote displays and sort
    articles.forEach(article => updateVoteDisplay(article));
    sortArticles();
});