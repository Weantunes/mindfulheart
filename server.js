const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Configurar o Express para servir arquivos estáticos do diretório atual
app.use(express.static(path.join(__dirname)));

// Rota principal para carregar o index_site.html (ou index.html)
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index_site.html'));
});

// Adicione suas rotas da API ou outras funções do backend aqui
app.get('/api/status', (req, res) => {
    res.json({ status: 'ok', message: 'Servidor Node.js está rodando' });
});

app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
    console.log(`Acesse: http://localhost:${PORT}`);
});
