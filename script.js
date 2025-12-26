// 1. DATA ATUAL NO HEADER
function updateCurrentDate() {
    const options = { 
        weekday: 'long', 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
    };
    const now = new Date();
    document.getElementById('current-date').textContent = 
        now.toLocaleDateString('pt-BR', options);
}

// 2. SISTEMA DE COMENTÁRIOS (Simulado)
class CommentSystem {
    constructor() {
        this.comments = JSON.parse(localStorage.getItem('rpg-comments')) || [];
        this.initialize();
    }
    
    initialize() {
        // Adicionar formulário de comentários se existir
        const commentForm = document.getElementById('comment-form');
        if (commentForm) {
            commentForm.addEventListener('submit', (e) => this.addComment(e));
        }
        
        this.displayComments();
    }
    
    addComment(e) {
        e.preventDefault();
        const form = e.target;
        const comment = {
            id: Date.now(),
            name: form.querySelector('#comment-name').value,
            text: form.querySelector('#comment-text').value,
            date: new Date().toLocaleString('pt-BR'),
            likes: 0
        };
        
        this.comments.unshift(comment);
        this.saveComments();
        this.displayComments();
        form.reset();
        
        // Mostrar confirmação
        this.showNotification('Comentário publicado!');
    }
    
    displayComments() {
        const container = document.getElementById('comments-container');
        if (!container) return;
        
        container.innerHTML = this.comments.map(comment => `
            <div class="comment" data-id="${comment.id}">
                <div class="comment-header">
                    <strong>${comment.name}</strong>
                    <span class="comment-date">${comment.date}</span>
                </div>
                <p>${comment.text}</p>
                <div class="comment-actions">
                    <button class="btn-like" onclick="commentSystem.likeComment(${comment.id})">
                        <i class="far fa-thumbs-up"></i> ${comment.likes}
                    </button>
                </div>
            </div>
        `).join('');
    }
    
    likeComment(id) {
        const comment = this.comments.find(c => c.id === id);
        if (comment) {
            comment.likes++;
            this.saveComments();
            this.displayComments();
        }
    }
    
    saveComments() {
        localStorage.setItem('rpg-comments', JSON.stringify(this.comments));
    }
    
    showNotification(message) {
        const notification = document.createElement('div');
        notification.className = 'notification';
        notification.textContent = message;
        document.body.appendChild(notification);
        
        setTimeout(() => notification.remove(), 3000);
    }
}

// 3. SISTEMA DE ENQUETES
class PollSystem {
    constructor() {
        this.polls = JSON.parse(localStorage.getItem('rpg-polls')) || {};
        this.initializePolls();
    }
    
    initializePolls() {
        document.querySelectorAll('.poll-form').forEach(form => {
            form.addEventListener('submit', (e) => this.vote(e));
        });
    }
    
    vote(e) {
        e.preventDefault();
        const form = e.target;
        const pollName = form.closest('.poll-widget').querySelector('.poll-question').textContent;
        const selected = form.querySelector('input[name="poll"]:checked');
        
        if (!selected) {
            alert('Por favor, selecione uma opção!');
            return;
        }
        
        // Registrar voto
        if (!this.polls[pollName]) {
            this.polls[pollName] = {};
        }
        
        if (!this.polls[pollName][selected.value]) {
            this.polls[pollName][selected.value] = 0;
        }
        
        this.polls[pollName][selected.value]++;
        localStorage.setItem('rpg-polls', JSON.stringify(this.polls));
        
        // Mostrar resultados
        this.showResults(form, pollName);
    }
    
    showResults(form, pollName) {
        const results = this.polls[pollName];
        const total = Object.values(results).reduce((a, b) => a + b, 0);
        
        const resultsHTML = Object.entries(results).map(([option, votes]) => {
            const percentage = total > 0 ? (votes / total * 100).toFixed(1) : 0;
            return `
                <div class="poll-result">
                    <div class="poll-result-label">${option}</div>
                    <div class="poll-result-bar">
                        <div class="poll-result-fill" style="width: ${percentage}%"></div>
                    </div>
                    <div class="poll-result-percentage">${percentage}%</div>
                </div>
            `;
        }).join('');
        
        form.innerHTML = `
            <h4>Resultados:</h4>
            ${resultsHTML}
            <p><small>Total de votos: ${total}</small></p>
            <button class="btn-poll" onclick="location.reload()">Votar Novamente</button>
        `;
    }
}

// 4. NEWSLETTER COM NETLIFY FORMS
function setupNewsletter() {
    const form = document.getElementById('newsletter-form');
    if (form) {
        form.addEventListener('submit', function(e) {
            // Netlify Forms lida automaticamente com o envio
            // Podemos apenas mostrar uma mensagem de sucesso
            setTimeout(() => {
                const successMsg = document.createElement('div');
                successMsg.className = 'newsletter-success';
                successMsg.innerHTML = `
                    <i class="fas fa-check-circle"></i>
                    <strong>Inscrição confirmada!</strong>
                    <p>Você receberá nossa próxima edição em breve.</p>
                `;
                form.replaceWith(successMsg);
            }, 100);
        });
    }
}

// 5. CHART ANIMATIONS
function animateCharts() {
    const chartItems = document.querySelectorAll('.chart-item');
    chartItems.forEach((item, index) => {
        item.style.animationDelay = `${index * 0.1}s`;
        item.classList.add('animate-in');
    });
}

// 6. INICIALIZAR TUDO QUANDO A PÁGINA CARREGAR
document.addEventListener('DOMContentLoaded', function() {
    // Atualizar data
    updateCurrentDate();
    
    // Inicializar sistemas
    window.commentSystem = new CommentSystem();
    window.pollSystem = new PollSystem();
    
    // Configurar newsletter
    setupNewsletter();
    
    // Animar charts
    animateCharts();
    
    // Atualizar data automaticamente a cada dia
    setInterval(updateCurrentDate, 86400000); // 24 horas
    
    // Efeito de digitação para manchetes
    const headlines = document.querySelectorAll('.news-title');
    headlines.forEach(headline => {
        const text = headline.textContent;
        headline.textContent = '';
        let i = 0;
        function typeWriter() {
            if (i < text.length) {
                headline.textContent += text.charAt(i);
                i++;
                setTimeout(typeWriter, 50);
            }
        }
        // typeWriter(); // Descomente para efeito de digitação
    });
});

// 7. SCROLL SUAVE PARA LINKS INTERNOS
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        const targetId = this.getAttribute('href');
        if (targetId === '#') return;
        
        const targetElement = document.querySelector(targetId);
        if (targetElement) {
            window.scrollTo({
                top: targetElement.offsetTop - 80,
                behavior: 'smooth'
            });
        }
    });
});

// 8. DARK MODE TOGGLE (opcional)
function toggleDarkMode() {
    document.body.classList.toggle('dark-mode');
    localStorage.setItem('darkMode', document.body.classList.contains('dark-mode'));
}

// Verificar preferência salva
if (localStorage.getItem('darkMode') === 'true') {
    document.body.classList.add('dark-mode');
}