document.addEventListener('DOMContentLoaded', function() {
    // Carrega as informações do pedido do localStorage
    const orderInfo = JSON.parse(localStorage.getItem('lastOrder')) || {
        id: '#' + Math.floor(10000 + Math.random() * 90000),
        date: new Date().toLocaleDateString('pt-BR'),
        status: 'Processando',
        total: 'R$ 399,90'
    };
    
    // Atualiza as informações na página
    document.querySelector('.order-number strong').textContent = orderInfo.id;
    document.getElementById('current-date').textContent = orderInfo.date;
    document.querySelector('.order-total strong').textContent = orderInfo.total;
    
    // Limpa o pedido atual do localStorage (mas mantém na lista de pedidos)
    localStorage.removeItem('lastOrder');
    
    // Cria o efeito de confete
    createConfetti();
});

function createConfetti() {
    const container = document.querySelector('.success-container');
    const colors = [
        '#00c853', // verde primário
        '#5efc82', // verde claro
        '#2979ff', // azul
        '#ffeb3b', // amarelo
        '#ff9800', // laranja
        '#e91e63'  // rosa
    ];
    
    const confettiCount = 150;
    
    for (let i = 0; i < confettiCount; i++) {
        setTimeout(() => {
            const confetti = document.createElement('div');
            confetti.className = 'confetti';
            
            // Propriedades aleatórias para cada confete
            const size = Math.random() * 10 + 5;
            const color = colors[Math.floor(Math.random() * colors.length)];
            const left = Math.random() * 100;
            const duration = Math.random() * 3 + 2;
            const delay = Math.random() * 2;
            
            // Estilo do confete
            confetti.style.width = `${size}px`;
            confetti.style.height = `${size}px`;
            confetti.style.backgroundColor = color;
            confetti.style.left = `${left}%`;
            confetti.style.position = 'fixed';
            confetti.style.top = '-10px';
            confetti.style.zIndex = '999';
            confetti.style.borderRadius = Math.random() > 0.5 ? '50%' : '0';
            confetti.style.opacity = '0';
            
            // Animação do confete
            confetti.style.animation = `confettiFall ${duration}s ease ${delay}s forwards`;
            
            // Adiciona o confete ao DOM
            document.body.appendChild(confetti);
            
            // Remove o confete após a animação
            setTimeout(() => {
                confetti.remove();
            }, (duration + delay) * 1000);
        }, Math.random() * 1000); // Início aleatório para cada confete
    }
}

// Adiciona um efeito de pulso ao botão "Continuar Comprando"
setTimeout(() => {
    const continueButton = document.querySelector('.continue-shopping-btn');
    
    setInterval(() => {
        continueButton.style.transform = 'scale(1.05)';
        setTimeout(() => {
            continueButton.style.transform = 'scale(1)';
        }, 500);
    }, 3000);
}, 3000);
