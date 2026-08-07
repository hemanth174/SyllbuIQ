const clients = new Map();

export const addClient = (userId, socket) => {
    const userClients = clients.get(String(userId)) || new Set();
    userClients.add(socket);
    clients.set(String(userId), userClients);
};

export const removeClient = (userId, socket) => {
    const userClients = clients.get(String(userId));
    if (!userClients) return;
    userClients.delete(socket);
    if (userClients.size === 0) clients.delete(String(userId));
};

export const broadcastToUser = (userId, message) => {
    const userClients = clients.get(String(userId));
    if (!userClients) return;
    const payload = JSON.stringify(message);
    userClients.forEach((socket) => {
        if (socket.readyState === 1) socket.send(payload);
    });
};
