// Atualizar contador do carrinho
function atualizarContadorCarrinho() {
    const carrinho = JSON.parse(localStorage.getItem('carrinho')) || [];
    const contador = document.getElementById('cart-count');
    if (contador) {
        contador.textContent = carrinho.length;
    }
}

// Atualizar contador de favoritos
function atualizarContadorFavoritos() {
    const favoritos = JSON.parse(localStorage.getItem('favoritos')) || [];
    const contador = document.getElementById('favorites-count');
    if (contador) {
        contador.textContent = favoritos.length;
    }
}

// Função para formatar preço
function formatarPreco(preco) {
    if (typeof preco === 'string') {
        return preco;
    }
    return preco.toLocaleString('pt-BR', {
        style: 'currency',
        currency: 'BRL'
    });
}

// Função para remover dos favoritos
function removerDosFavoritos(nome) {
    let favoritos = JSON.parse(localStorage.getItem('favoritos')) || [];
    favoritos = favoritos.filter(item => item.nome !== nome);
    localStorage.setItem('favoritos', JSON.stringify(favoritos));
    carregarFavoritos();
    atualizarContadorFavoritos();
}

// Função para adicionar ao carrinho
function adicionarAoCarrinho(produto) {
    let carrinho = JSON.parse(localStorage.getItem('carrinho')) || [];
    carrinho.push({
        ...produto,
        quantidade: 1
    });
    localStorage.setItem('carrinho', JSON.stringify(carrinho));
    atualizarContadorCarrinho();

    // Feedback visual
    const botao = document.querySelector(`[data-nome="${produto.nome}"]`);
    if (botao) {
        const textoOriginal = botao.innerHTML;
        botao.innerHTML = '<i class="fas fa-check"></i> Adicionado!';
        botao.disabled = true;
        setTimeout(() => {
            botao.innerHTML = textoOriginal;
            botao.disabled = false;
        }, 2000);
    }
}

// Função para criar card do produto
function criarCardProduto(produto) {
    const card = document.createElement('div');
    card.className = 'product-card';
    card.innerHTML = `
        <div class="product-image">
            <img src="${produto.imagem}" alt="${produto.nome}">
            <button class="remove-favorite" onclick="removerDosFavoritos('${produto.nome}')">
                <i class="fas fa-heart"></i>
            </button>
        </div>
        <div class="product-info">
            <h3>${produto.nome}</h3>
            <p class="price">${formatarPreco(produto.preco)}</p>
            <button class="add-to-cart" data-nome="${produto.nome}" onclick="adicionarAoCarrinho(${JSON.stringify(produto).replace(/"/g, '&quot;')})">
                <i class="fas fa-shopping-cart"></i> Adicionar ao Carrinho
            </button>
        </div>
    `;
    return card;
}

// Função para carregar favoritos
function carregarFavoritos() {
    const favoritos = JSON.parse(localStorage.getItem('favoritos')) || [];
    const grid = document.getElementById('favorites-grid');
    
    if (!grid) return;

    grid.innerHTML = '';

    if (favoritos.length === 0) {
        grid.innerHTML = `
            <div class="empty-favorites">
                <i class="far fa-heart"></i>
                <h3>Nenhum produto favorito</h3>
                <p>Adicione produtos aos favoritos clicando no coração em cada produto.</p>
                <a href="index.html#products" class="btn primary-btn">Ver Produtos</a>
            </div>
        `;
        return;
    }

    favoritos.forEach(produto => {
        const card = criarCardProduto(produto);
        grid.appendChild(card);
    });
}

// Inicializar quando a página carregar
document.addEventListener('DOMContentLoaded', function() {
    atualizarContadorCarrinho();
    atualizarContadorFavoritos();
    carregarFavoritos();
});
