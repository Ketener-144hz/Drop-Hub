document.addEventListener('DOMContentLoaded', function() {
    console.log('Checkout página carregada');
    carregarItensCarrinho();
    setupFormValidation();
});

function carregarItensCarrinho() {
    const carrinho = JSON.parse(localStorage.getItem('carrinho')) || [];
    console.log('Itens no carrinho:', carrinho);
    
    const containerItens = document.querySelector('.cart-items');
    if (!containerItens) {
        console.error('Container de itens não encontrado');
        return;
    }

    containerItens.innerHTML = '';

    if (carrinho.length === 0) {
        containerItens.innerHTML = `
            <div class="empty-cart">
                <i class="fas fa-shopping-cart"></i>
                <p>Seu carrinho está vazio</p>
                <a href="index.html" class="btn primary-btn">Continuar Comprando</a>
            </div>
        `;
        atualizarTotais(0);
        return;
    }

    let subtotal = 0;
    carrinho.forEach((item, index) => {
        const itemElement = criarElementoItem(item, index);
        containerItens.appendChild(itemElement);
        subtotal += item.preco * item.quantidade;
    });

    console.log('Subtotal calculado:', subtotal);
    atualizarTotais(subtotal);
}

function formatarPreco(valor) {
    return valor.toLocaleString('pt-BR', {
        style: 'currency',
        currency: 'BRL'
    });
}

function criarElementoItem(item, index) {
    console.log('Criando elemento para item:', item);
    
    const div = document.createElement('div');
    div.className = 'cart-item';
    div.innerHTML = `
        <img src="${item.imagem}" alt="${item.nome}">
        <div class="cart-item-details">
            <h3>${item.nome}</h3>
            <div class="quantity-controls">
                <button class="quantity-btn minus" data-index="${index}">-</button>
                <span class="quantity">${item.quantidade}</span>
                <button class="quantity-btn plus" data-index="${index}">+</button>
            </div>
            <p class="cart-item-price">${formatarPreco(item.preco * item.quantidade)}</p>
        </div>
        <button class="remove-item" data-index="${index}">
            <i class="fas fa-trash"></i>
        </button>
    `;

    // Adicionar event listeners
    div.querySelector('.minus').addEventListener('click', () => atualizarQuantidade(index, -1));
    div.querySelector('.plus').addEventListener('click', () => atualizarQuantidade(index, 1));
    div.querySelector('.remove-item').addEventListener('click', () => removerItem(index));

    return div;
}

function atualizarQuantidade(index, mudanca) {
    console.log('Atualizando quantidade:', { index, mudanca });
    
    const carrinho = JSON.parse(localStorage.getItem('carrinho')) || [];
    
    if (carrinho[index]) {
        carrinho[index].quantidade += mudanca;
        
        if (carrinho[index].quantidade < 1) {
            removerItem(index);
            return;
        }
        
        localStorage.setItem('carrinho', JSON.stringify(carrinho));
        carregarItensCarrinho();
    }
}

function removerItem(index) {
    console.log('Removendo item:', index);
    
    const carrinho = JSON.parse(localStorage.getItem('carrinho')) || [];
    carrinho.splice(index, 1);
    localStorage.setItem('carrinho', JSON.stringify(carrinho));
    carregarItensCarrinho();
}

function atualizarTotais(subtotal) {
    console.log('Atualizando totais:', subtotal);
    
    const frete = subtotal > 0 ? 15.00 : 0;
    const total = subtotal + frete;

    document.querySelector('.subtotal .amount').textContent = formatarPreco(subtotal);
    document.querySelector('.shipping .amount').textContent = formatarPreco(frete);
    document.querySelector('.total .amount').textContent = formatarPreco(total);

    // Atualizar opções de parcelamento
    atualizarOpcoesParcelas(total);

    const submitButton = document.querySelector('button[type="submit"]');
    if (submitButton) {
        submitButton.disabled = subtotal === 0;
    }
}

function atualizarOpcoesParcelas(total) {
    const installmentsInfo = document.querySelector('.installments-info');
    const installmentsList = document.querySelector('.installments-list');
    const installmentsSelect = document.getElementById('installments');
    
    if (!installmentsInfo || !installmentsList || !installmentsSelect) return;
    
    // Limpar conteúdo anterior
    installmentsList.innerHTML = '';
    installmentsSelect.innerHTML = '';
    
    // Atualizar o cabeçalho
    const header = document.querySelector('.installments-header');
    if (!header) {
        const newHeader = document.createElement('div');
        newHeader.className = 'installments-header';
        newHeader.innerHTML = '<i class="fas fa-credit-card"></i> Opções de Parcelamento';
        installmentsInfo.insertBefore(newHeader, installmentsList);
    }

    const maxParcelas = 12;
    const parcelasHtml = [];
    const selectOptions = [];

    for (let i = 1; i <= maxParcelas; i++) {
        const valorParcela = total / i;
        
        // Só mostrar parcelas com valor mínimo de R$ 5
        if (valorParcela < 5) break;

        const juros = i <= 6 ? 0 : 1.99;
        const valorParcelaComJuros = juros > 0 ? valorParcela * (1 + juros/100) : valorParcela;

        const parcelaTexto = `${i}x de ${formatarPreco(valorParcelaComJuros)}${juros > 0 ? ` (${juros}% a.m.)` : ' sem juros'}`;
        
        const interestClass = juros > 0 ? 'with-interest' : 'no-interest';
        
        parcelasHtml.push(`
            <div class="installment-option ${interestClass}">
                <span class="parcela">${i}x de</span>
                <span class="valor">${formatarPreco(valorParcelaComJuros)}<small>${juros > 0 ? `${juros}% a.m.` : 'sem juros'}</small></span>
            </div>
        `);

        selectOptions.push(`
            <option value="${i}">${parcelaTexto}</option>
        `);
    }

    installmentsList.innerHTML = parcelasHtml.join('');
    installmentsSelect.innerHTML = selectOptions.join('');
    
    // Adicionar eventos de clique para as opções de parcelamento
    document.querySelectorAll('.installment-option').forEach((option, index) => {
        option.addEventListener('click', () => {
            // Remover classe selecionada de todas as opções
            document.querySelectorAll('.installment-option').forEach(opt => {
                opt.classList.remove('selected');
            });
            
            // Adicionar classe selecionada à opção clicada
            option.classList.add('selected');
            
            // Selecionar a opção correspondente no select
            installmentsSelect.selectedIndex = index;
        });
    });
    
    // Selecionar a primeira opção por padrão
    const firstOption = document.querySelector('.installment-option');
    if (firstOption) {
        firstOption.classList.add('selected');
        installmentsSelect.selectedIndex = 0;
    }
}

function setupFormValidation() {
    const form = document.getElementById('payment-form');
    if (!form) return;

    // Formatar número do cartão
    const cardInput = document.getElementById('card');
    if (cardInput) {
        cardInput.addEventListener('input', function(e) {
            let value = e.target.value.replace(/\D/g, '');
            if (value.length > 16) value = value.slice(0, 16);
            
            // Adicionar espaços a cada 4 dígitos
            const parts = [];
            for (let i = 0; i < value.length; i += 4) {
                parts.push(value.slice(i, i + 4));
            }
            e.target.value = parts.join(' ');
        });
    }

    // Formatar data de validade
    const expiryInput = document.getElementById('expiry');
    if (expiryInput) {
        expiryInput.addEventListener('input', function(e) {
            let value = e.target.value.replace(/\D/g, '');
            if (value.length > 4) value = value.slice(0, 4);
            
            if (value.length > 2) {
                e.target.value = value.slice(0, 2) + '/' + value.slice(2);
            } else {
                e.target.value = value;
            }
        });
    }

    // Formatar CVV
    const cvvInput = document.getElementById('cvv');
    if (cvvInput) {
        cvvInput.addEventListener('input', function(e) {
            let value = e.target.value.replace(/\D/g, '');
            if (value.length > 3) value = value.slice(0, 3);
            e.target.value = value;
        });
    }

    // Submissão do formulário
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        if (!validarFormulario()) return;
        
        const submitButton = form.querySelector('button[type="submit"]');
        submitButton.disabled = true;
        submitButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Processando...';
        
        // Simular processamento do pagamento
        setTimeout(function() {
            // Salvar o número do pedido para exibir na página de sucesso
            const orderNumber = '#' + Math.floor(10000 + Math.random() * 90000);
            const orderTotal = document.querySelector('.total .amount').textContent;
            const currentDate = new Date().toLocaleDateString('pt-BR');
            
            // Salvar informações do pedido para a página de sucesso
            const orderInfo = {
                id: orderNumber,
                date: currentDate,
                status: 'Processando',
                total: orderTotal
            };
            
            // Salvar o pedido na lista de pedidos do usuário
            const userOrders = JSON.parse(localStorage.getItem('userOrders')) || [];
            userOrders.push(orderInfo);
            localStorage.setItem('userOrders', JSON.stringify(userOrders));
            
            // Salvar para a página de sucesso
            localStorage.setItem('lastOrder', JSON.stringify(orderInfo));
            localStorage.removeItem('carrinho');
            
            // Redirecionar para a página de sucesso
            window.location.href = 'order-success.html';
        }, 2000);
    });
}

function validarFormulario() {
    const nome = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const cartao = document.getElementById('card').value;
    const validade = document.getElementById('expiry').value;
    const cvv = document.getElementById('cvv').value;
    const parcelas = document.getElementById('installments').value;

    if (!nome || !email || !cartao || !validade || !cvv || !parcelas) {
        alert('Por favor, preencha todos os campos.');
        return false;
    }

    if (!email.includes('@')) {
        alert('Por favor, insira um e-mail válido.');
        return false;
    }

    if (cartao.replace(/\s/g, '').length !== 16) {
        alert('Por favor, insira um número de cartão válido.');
        return false;
    }

    if (!validade.match(/^\d{2}\/\d{2}$/)) {
        alert('Por favor, insira uma data de validade válida (MM/AA).');
        return false;
    }

    if (cvv.length !== 3) {
        alert('Por favor, insira um CVV válido.');
        return false;
    }

    return true;
}
