document.addEventListener('DOMContentLoaded', function() {
    // Navegação entre seções
    const navButtons = document.querySelectorAll('.nav-button');
    const sections = document.querySelectorAll('.account-section');

    navButtons.forEach(button => {
        button.addEventListener('click', () => {
            const targetSection = button.dataset.section;
            
            // Remove active class from all buttons and sections
            navButtons.forEach(btn => btn.classList.remove('active'));
            sections.forEach(section => section.classList.remove('active'));
            
            // Add active class to clicked button and corresponding section
            button.classList.add('active');
            document.getElementById(targetSection).classList.add('active');
        });
    });

    // Manipulação do formulário de perfil
    const profileForm = document.getElementById('profile-form');
    if (profileForm) {
        profileForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Aqui você pode adicionar a lógica para salvar os dados do perfil
            const formData = {
                name: document.getElementById('name').value,
                email: document.getElementById('email').value,
                phone: document.getElementById('phone').value,
                birthdate: document.getElementById('birthdate').value
            };

            console.log('Dados do perfil:', formData);
            // Simula salvamento bem-sucedido
            showNotification('Perfil atualizado com sucesso!', 'success');
        });
    }

    // Manipulação do formulário de segurança
    const securityForm = document.getElementById('security-form');
    if (securityForm) {
        securityForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const currentPassword = document.getElementById('current-password').value;
            const newPassword = document.getElementById('new-password').value;
            const confirmPassword = document.getElementById('confirm-password').value;

            if (newPassword !== confirmPassword) {
                showNotification('As senhas não coincidem!', 'error');
                return;
            }

            // Aqui você pode adicionar a lógica para alterar a senha
            console.log('Alterando senha...');
            showNotification('Senha alterada com sucesso!', 'success');
            
            // Limpa o formulário
            this.reset();
        });
    }

    // Manipulação do botão de trocar avatar
    const changeAvatarBtn = document.querySelector('.change-avatar-btn');
    if (changeAvatarBtn) {
        changeAvatarBtn.addEventListener('click', function() {
            // Simula a abertura de um seletor de arquivo
            const input = document.createElement('input');
            input.type = 'file';
            input.accept = 'image/*';
            
            input.onchange = function(e) {
                const file = e.target.files[0];
                if (file) {
                    const reader = new FileReader();
                    reader.onload = function(event) {
                        document.getElementById('user-avatar').src = event.target.result;
                        showNotification('Foto de perfil atualizada!', 'success');
                    };
                    reader.readAsDataURL(file);
                }
            };
            
            input.click();
        });
    }

    // Manipulação do botão de logout
    const logoutBtn = document.querySelector('.logout-btn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', function() {
            // Aqui você pode adicionar a lógica de logout
            console.log('Realizando logout...');
            window.location.href = 'index.html';
        });
    }

    // Função para mostrar notificações
    function showNotification(message, type = 'success') {
        // Cria o elemento de notificação
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.textContent = message;

        // Adiciona a notificação ao DOM
        document.body.appendChild(notification);

        // Remove a notificação após 3 segundos
        setTimeout(() => {
            notification.remove();
        }, 3000);
    }

    // Armazena os pedidos no localStorage
    function saveOrders(orders) {
        localStorage.setItem('userOrders', JSON.stringify(orders));
    }

    // Obtém os pedidos do localStorage
    function getOrders() {
        const savedOrders = localStorage.getItem('userOrders');
        if (savedOrders) {
            return JSON.parse(savedOrders);
        }
        
        // Array vazio se não houver nada salvo
        return [];
    }

    // Carrega os pedidos na interface
    function loadOrders() {
        const ordersList = document.querySelector('.orders-list');
        if (!ordersList) return;

        const orders = getOrders();

        if (orders.length === 0) {
            ordersList.innerHTML = `
                <div class="empty-state">
                    <i class="fas fa-shopping-bag"></i>
                    <p>Você ainda não tem pedidos.</p>
                </div>
            `;
            return;
        }

        ordersList.innerHTML = orders.map(order => `
            <div class="order-card" data-id="${order.id}">
                <h3>Pedido ${order.id}</h3>
                <p>Data: ${order.date}</p>
                <p>Status: ${order.status}</p>
                <p>Total: ${order.total}</p>
                <div class="order-actions">
                    <button class="view-order-btn" onclick="viewOrderDetails('${order.id}')">Ver Detalhes</button>
                    <button class="delete-order-btn" onclick="deleteOrder('${order.id}')">Excluir</button>
                </div>
            </div>
        `).join('');
    }

    // Armazena os endereços no localStorage
    function saveAddresses(addresses) {
        localStorage.setItem('userAddresses', JSON.stringify(addresses));
    }

    // Obtém os endereços do localStorage
    function getAddresses() {
        const savedAddresses = localStorage.getItem('userAddresses');
        if (savedAddresses) {
            return JSON.parse(savedAddresses);
        }
        
        // Endereços padrão se não houver nada salvo
        const defaultAddresses = [
            {
                id: 1,
                street: 'Rua Exemplo, 123',
                city: 'São Paulo',
                state: 'SP',
                zip: '01234-567'
            },
            {
                id: 2,
                street: 'Avenida Teste, 456',
                city: 'Rio de Janeiro',
                state: 'RJ',
                zip: '12345-678'
            }
        ];
        
        saveAddresses(defaultAddresses);
        return defaultAddresses;
    }

    // Carrega os endereços na interface
    function loadAddresses() {
        const addressesList = document.querySelector('.addresses-list');
        if (!addressesList) return;

        const addresses = getAddresses();

        addressesList.innerHTML = addresses.map(address => `
            <div class="address-card" data-id="${address.id}">
                <p>${address.street}</p>
                <p>${address.city} - ${address.state}</p>
                <p>CEP: ${address.zip}</p>
                <div class="address-actions">
                    <button class="edit-address-btn" onclick="editAddress(${address.id})">Editar</button>
                    <button class="delete-address-btn" onclick="deleteAddress(${address.id})">Excluir</button>
                </div>
            </div>
        `).join('');
    }

    // Função para editar um endereço
    window.editAddress = function(addressId) {
        const addresses = getAddresses();
        const address = addresses.find(addr => addr.id === addressId);
        
        if (!address) return;
        
        // Cria o modal de edição
        const modal = document.createElement('div');
        modal.className = 'address-modal';
        modal.innerHTML = `
            <div class="address-modal-content">
                <h3>Editar Endereço</h3>
                <form id="edit-address-form">
                    <div class="form-group">
                        <label for="edit-street">Endereço</label>
                        <input type="text" id="edit-street" value="${address.street}" required>
                    </div>
                    <div class="form-group">
                        <label for="edit-city">Cidade</label>
                        <input type="text" id="edit-city" value="${address.city}" required>
                    </div>
                    <div class="form-group">
                        <label for="edit-state">Estado</label>
                        <input type="text" id="edit-state" value="${address.state}" required>
                    </div>
                    <div class="form-group">
                        <label for="edit-zip">CEP</label>
                        <input type="text" id="edit-zip" value="${address.zip}" required>
                    </div>
                    <div class="modal-actions">
                        <button type="button" class="cancel-btn" onclick="closeModal()">Cancelar</button>
                        <button type="submit" class="save-btn">Salvar</button>
                    </div>
                </form>
            </div>
        `;
        
        document.body.appendChild(modal);
        
        // Manipula o envio do formulário
        document.getElementById('edit-address-form').addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Atualiza o endereço
            address.street = document.getElementById('edit-street').value;
            address.city = document.getElementById('edit-city').value;
            address.state = document.getElementById('edit-state').value;
            address.zip = document.getElementById('edit-zip').value;
            
            // Salva as alterações
            saveAddresses(addresses);
            
            // Recarrega a lista de endereços
            loadAddresses();
            
            // Fecha o modal
            closeModal();
            
            // Mostra notificação
            showNotification('Endereço atualizado com sucesso!', 'success');
        });
    };
    
    // Função para excluir um endereço
    window.deleteAddress = function(addressId) {
        if (confirm('Tem certeza que deseja excluir este endereço?')) {
            const addresses = getAddresses();
            const updatedAddresses = addresses.filter(addr => addr.id !== addressId);
            
            // Salva a lista atualizada
            saveAddresses(updatedAddresses);
            
            // Recarrega a lista de endereços
            loadAddresses();
            
            // Mostra notificação
            showNotification('Endereço excluído com sucesso!', 'success');
        }
    };
    
    // Função para fechar o modal
    window.closeModal = function() {
        const modal = document.querySelector('.address-modal');
        if (modal) {
            modal.remove();
        }
    };
    
    // Adiciona manipulador para o botão de adicionar endereço
    const addAddressBtn = document.querySelector('.add-address-btn');
    if (addAddressBtn) {
        addAddressBtn.addEventListener('click', function() {
            // Cria o modal de adição
            const modal = document.createElement('div');
            modal.className = 'address-modal';
            modal.innerHTML = `
                <div class="address-modal-content">
                    <h3>Adicionar Novo Endereço</h3>
                    <form id="add-address-form">
                        <div class="form-group">
                            <label for="add-street">Endereço</label>
                            <input type="text" id="add-street" required>
                        </div>
                        <div class="form-group">
                            <label for="add-city">Cidade</label>
                            <input type="text" id="add-city" required>
                        </div>
                        <div class="form-group">
                            <label for="add-state">Estado</label>
                            <input type="text" id="add-state" required>
                        </div>
                        <div class="form-group">
                            <label for="add-zip">CEP</label>
                            <input type="text" id="add-zip" required>
                        </div>
                        <div class="modal-actions">
                            <button type="button" class="cancel-btn" onclick="closeModal()">Cancelar</button>
                            <button type="submit" class="save-btn">Adicionar</button>
                        </div>
                    </form>
                </div>
            `;
            
            document.body.appendChild(modal);
            
            // Manipula o envio do formulário
            document.getElementById('add-address-form').addEventListener('submit', function(e) {
                e.preventDefault();
                
                // Obtém os endereços existentes
                const addresses = getAddresses();
                
                // Cria um novo endereço
                const newAddress = {
                    id: Date.now(), // Usa timestamp como ID único
                    street: document.getElementById('add-street').value,
                    city: document.getElementById('add-city').value,
                    state: document.getElementById('add-state').value,
                    zip: document.getElementById('add-zip').value
                };
                
                // Adiciona o novo endereço
                addresses.push(newAddress);
                
                // Salva a lista atualizada
                saveAddresses(addresses);
                
                // Recarrega a lista de endereços
                loadAddresses();
                
                // Fecha o modal
                closeModal();
                
                // Mostra notificação
                showNotification('Endereço adicionado com sucesso!', 'success');
            });
        });
    }
    
    // Função para visualizar detalhes do pedido
    window.viewOrderDetails = function(orderId) {
        const orders = getOrders();
        const order = orders.find(order => order.id === orderId);
        
        if (!order) return;
        
        // Cria o modal de detalhes do pedido
        const modal = document.createElement('div');
        modal.className = 'order-details-modal';
        modal.innerHTML = `
            <div class="order-details-content">
                <div class="order-details-header">
                    <h3>Detalhes do Pedido ${order.id}</h3>
                    <button class="close-modal-btn" onclick="closeOrderModal()"><i class="fas fa-times"></i></button>
                </div>
                <div class="order-details-info">
                    <div class="order-info-group">
                        <span>Data do Pedido:</span>
                        <strong>${order.date}</strong>
                    </div>
                    <div class="order-info-group">
                        <span>Status:</span>
                        <strong class="order-status ${order.status.toLowerCase().replace(' ', '-')}">${order.status}</strong>
                    </div>
                    <div class="order-info-group">
                        <span>Valor Total:</span>
                        <strong>${order.total}</strong>
                    </div>
                </div>
                <div class="order-status-timeline">
                    <div class="status-step ${order.status === 'Processando' || order.status === 'Em trânsito' || order.status === 'Entregue' ? 'active' : ''}">
                        <div class="status-icon"><i class="fas fa-check-circle"></i></div>
                        <div class="status-label">Pedido Confirmado</div>
                    </div>
                    <div class="status-step ${order.status === 'Em trânsito' || order.status === 'Entregue' ? 'active' : ''}">
                        <div class="status-icon"><i class="fas fa-truck"></i></div>
                        <div class="status-label">Em Trânsito</div>
                    </div>
                    <div class="status-step ${order.status === 'Entregue' ? 'active' : ''}">
                        <div class="status-icon"><i class="fas fa-home"></i></div>
                        <div class="status-label">Entregue</div>
                    </div>
                </div>
                <div class="order-actions-footer">
                    <button class="close-btn" onclick="closeOrderModal()">Fechar</button>
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
    };
    
    // Função para fechar o modal de detalhes do pedido
    window.closeOrderModal = function() {
        const modal = document.querySelector('.order-details-modal');
        if (modal) {
            modal.remove();
        }
    };
    
    // Função para excluir um pedido
    window.deleteOrder = function(orderId) {
        if (confirm('Tem certeza que deseja excluir este pedido?')) {
            const orders = getOrders();
            const updatedOrders = orders.filter(order => order.id !== orderId);
            
            // Salva a lista atualizada
            saveOrders(updatedOrders);
            
            // Recarrega a lista de pedidos
            loadOrders();
            
            // Mostra notificação
            showNotification('Pedido excluído com sucesso!', 'success');
        }
    };
    
    // Carrega os dados iniciais
    loadOrders();
    loadAddresses();
});
