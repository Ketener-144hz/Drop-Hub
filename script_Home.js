// Funções do carrinho e favoritos
function atualizarContadorCarrinho() {
    const carrinho = JSON.parse(localStorage.getItem('carrinho')) || [];
    const contador = document.getElementById('cart-count');
    if (contador) {
        contador.textContent = carrinho.length;
    }
}

function atualizarContadorFavoritos() {
    const favoritos = JSON.parse(localStorage.getItem('favoritos')) || [];
    const contador = document.getElementById('favorites-count');
    if (contador) {
        contador.textContent = favoritos.length;
    }
}

// Função para extrair preço do texto
function extrairPreco(elemento) {
    const precoTexto = elemento.textContent.replace('R$', '').trim();
    return parseFloat(precoTexto.replace(/\./g, '').replace(',', '.'));
}

// Função para adicionar aos favoritos
function toggleFavorito(botao) {
    // Encontrar o card do produto
    const card = botao.closest('.product-card');
    if (!card) return;

    // Pegar informações do produto
    const nome = card.querySelector('h3').textContent;
    const preco = card.querySelector('.price').textContent;
    const imagem = card.querySelector('.product-image img').src;

    // Criar objeto do produto
    const produto = {
        nome: nome,
        preco: preco,
        imagem: imagem
    };

    // Pegar favoritos existentes
    let favoritos = JSON.parse(localStorage.getItem('favoritos')) || [];
    
    // Verificar se o produto já está nos favoritos
    const index = favoritos.findIndex(item => item.nome === produto.nome);
    
    if (index === -1) {
        // Adicionar aos favoritos
        favoritos.push(produto);
        botao.classList.add('active');
        botao.querySelector('i').classList.remove('far');
        botao.querySelector('i').classList.add('fas');
    } else {
        // Remover dos favoritos
        favoritos.splice(index, 1);
        botao.classList.remove('active');
        botao.querySelector('i').classList.remove('fas');
        botao.querySelector('i').classList.add('far');
    }

    // Salvar no localStorage
    localStorage.setItem('favoritos', JSON.stringify(favoritos));
    
    // Atualizar contador de favoritos
    atualizarContadorFavoritos();
}

// Função para adicionar ao carrinho
function adicionarAoCarrinho(botao) {
    // Encontrar o card do produto
    const card = botao.closest('.product-card');
    if (!card) {
        console.error('Card não encontrado');
        return;
    }

    // Encontrar elementos necessários
    const nomeElemento = card.querySelector('h3');
    const precoElemento = card.querySelector('.price');
    const imagemElemento = card.querySelector('.product-image img');

    if (!nomeElemento || !precoElemento || !imagemElemento) {
        console.error('Elementos necessários não encontrados');
        return;
    }

    // Criar objeto do produto
    const produto = {
        nome: nomeElemento.textContent,
        preco: extrairPreco(precoElemento),
        imagem: imagemElemento.src,
        quantidade: 1
    };

    console.log('Produto a ser adicionado:', produto);

    // Adicionar ao localStorage
    let carrinho = JSON.parse(localStorage.getItem('carrinho')) || [];
    carrinho.push(produto);
    localStorage.setItem('carrinho', JSON.stringify(carrinho));

    // Atualizar contador
    atualizarContadorCarrinho();

    // Feedback visual
    const textoOriginal = botao.innerHTML;
    botao.innerHTML = '<i class="fas fa-check"></i> Adicionado!';
    botao.disabled = true;

    setTimeout(() => {
        botao.innerHTML = textoOriginal;
        botao.disabled = false;
    }, 2000);
}

// Função para animar os números das estatísticas
function animateStats() {
    const stats = document.querySelectorAll('.stat-number');
    
    stats.forEach(stat => {
        const target = parseInt(stat.getAttribute('data-target'));
        const duration = 2000; // 2 segundos
        const increment = target / (duration / 16); // 60 FPS
        let current = 0;
        
        const updateNumber = () => {
            current += increment;
            if (current < target) {
                stat.textContent = Math.round(current);
                requestAnimationFrame(updateNumber);
            } else {
                stat.textContent = target;
            }
        };
        
        updateNumber();
    });
}

// Função para verificar se um elemento está visível na tela
function isElementInViewport(el) {
    const rect = el.getBoundingClientRect();
    return (
        rect.top >= 0 &&
        rect.left >= 0 &&
        rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
        rect.right <= (window.innerWidth || document.documentElement.clientWidth)
    );
}

// Inicializar quando o documento carregar
document.addEventListener('DOMContentLoaded', function() {
    // Atualizar contadores
    atualizarContadorCarrinho();
    atualizarContadorFavoritos();

    // Carregar estado dos favoritos
    const favoritos = JSON.parse(localStorage.getItem('favoritos')) || [];
    document.querySelectorAll('.favorite-btn').forEach(botao => {
        const card = botao.closest('.product-card');
        const nome = card.querySelector('h3').textContent;
        
        if (favoritos.some(item => item.nome === nome)) {
            botao.classList.add('active');
            botao.querySelector('i').classList.remove('far');
            botao.querySelector('i').classList.add('fas');
        }
    });

    // Adicionar event listeners aos botões de favorito
    document.querySelectorAll('.favorite-btn').forEach(botao => {
        botao.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            toggleFavorito(this);
        });
    });

    // Adicionar event listeners aos botões de adicionar ao carrinho
    document.querySelectorAll('.add-to-cart').forEach(botao => {
        botao.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            adicionarAoCarrinho(this);
        });
    });

    // Adicionar event listener ao ícone do carrinho
    const carrinhoIcone = document.querySelector('.cart-icon');
    if (carrinhoIcone) {
        carrinhoIcone.addEventListener('click', function(e) {
            e.preventDefault();
            window.location.href = 'checkout.html';
        });
    }

    // Configurar filtros de produtos
    document.querySelectorAll('.filter-btn').forEach(botao => {
        botao.addEventListener('click', function() {
            // Remover classe active de todos os botões
            document.querySelectorAll('.filter-btn').forEach(btn => {
                btn.classList.remove('active');
            });

            // Adicionar classe active ao botão clicado
            this.classList.add('active');

            // Pegar o filtro
            const filtro = this.dataset.filter;

            // Filtrar os produtos
            document.querySelectorAll('.product-card').forEach(card => {
                if (filtro === 'all' || card.dataset.category === filtro) {
                    card.style.display = 'block';
                } else {
                    card.style.display = 'none';
                }
            });
        });
    });

    // Verificar se a seção já está visível quando a página carrega
    const statsSection = document.querySelector('.stats-container');
    if (statsSection && isElementInViewport(statsSection)) {
        animateStats();
    }
});

// Iniciar animação quando a seção estiver visível
document.addEventListener('scroll', function() {
    const statsSection = document.querySelector('.stats-container');
    if (statsSection && isElementInViewport(statsSection)) {
        animateStats();
        // Remover o event listener após a animação começar
        this.removeEventListener('scroll', arguments.callee);
    }
});