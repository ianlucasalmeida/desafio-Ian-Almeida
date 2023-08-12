const readline = require('readline');

const produtos = {
    "cafe": { nome: "Café", preco: 3.00 },
    "chantily": { nome: "Chantily (extra do Café)", preco: 1.50 },
    "suco": { nome: "Suco Natural", preco: 6.20 },
    "sanduiche": { nome: "Sanduíche", preco: 6.50 },
    "queijo": { nome: "Queijo (extra do Sanduíche)", preco: 2.00 },
    "salgado": { nome: "Salgado", preco: 7.20 },
    "combo1": { nome: "1 Suco e 1 Sanduíche", preco: 9.50 },
    "combo2": { nome: "1 Café e 1 Sanduíche", preco: 7.50 },
};

class CaixaDaLanchonete {
    calcularValorDaCompra(metodoDePagamento, itens) {
        const produtosComprados = {};
        const extrasComprados = {}; 
        let produtoAtual = null; 

        for (let i = 0; i < itens.length; i += 2) {
            const produto = itens[i];
            const quantidadeProduto = parseInt(itens[i + 1]);

            if (!produtos[produto]) {
                return "Erro: Produto não encontrado";
            }

            if (produtoAtual && produtoAtual.extra) {
                const extra = produtoAtual.extra;
                if (produto !== extra) {
                    return `Erro: ${extra} não pode ser comprado separado do seu extra`;
                }
                extrasComprados[extra] = quantidadeProduto;
            } else {
                produtosComprados[produto] = (produtosComprados[produto] || 0) + quantidadeProduto;
            }

            produtoAtual = produtos[produto];
        }

        let valorTotal = 0;

        for (const produto in produtosComprados) {
            valorTotal += produtos[produto].preco * produtosComprados[produto];
        }

        for (const extra in extrasComprados) {
            valorTotal += produtos[extra].preco * extrasComprados[extra];
        }

        if (metodoDePagamento.toLowerCase() === 'dinheiro') {
            valorTotal *= 0.95; 
        } else if (metodoDePagamento.toLowerCase() === 'credito') {
            valorTotal *= 1.03; 
        }

        return `R$ ${valorTotal.toFixed(2).replace('.', ',')}`;
    }
}

const caixa = new CaixaDaLanchonete();

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

rl.question('Digite os itens da compra separados por vírgula (produto,quantidade): ', (entradaItens) => {
    const itens = entradaItens.split(',').map(item => item.trim());

    rl.question('Forma de pagamento (dinheiro / debito / credito): ', (formaPagamento) => {
        const valorTotalOuErro = caixa.calcularValorDaCompra(formaPagamento, itens);

        console.log(`Valor total: ${valorTotalOuErro}`);
        rl.close();
    });
});
