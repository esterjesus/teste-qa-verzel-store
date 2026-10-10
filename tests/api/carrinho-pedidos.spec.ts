import { test, expect } from '@playwright/test';

const cliente = { nome: 'Maria Silva', email: 'maria@exemplo.com', cep: '01310-100' };

test.describe('API - /api/carrinho/calcular', () => {
  test('CT01/CT11 - calcula subtotal, desconto, frete e total conforme a fórmula', async ({ request }) => {
    const res = await request.post('/api/carrinho/calcular', {
      data: { itens: [{ produtoId: 'P002', quantidade: 1 }, { produtoId: 'P004', quantidade: 2 }], cupom: 'BEMVINDO10' },
    });
    expect(res.status()).toBe(200);
    const body = await res.json();
    expect(body).toMatchObject({
      subtotal: 239.7, desconto: 23.97, frete: 0, freteGratis: true, valorFaltanteFreteGratis: 0, total: 215.73,
      cupom: { codigo: 'BEMVINDO10', aplicado: true },
    });
  });

  test('CT27 - cupom inválido/expirado não gera erro no cálculo (200 sem desconto)', async ({ request }) => {
    for (const [cupom, mensagem] of [['NAOEXISTE', 'Cupom inválido.'], ['verao2026', 'Cupom expirado.']]) {
      const res = await request.post('/api/carrinho/calcular', {
        data: { itens: [{ produtoId: 'P001', quantidade: 1 }], cupom },
      });
      expect(res.status()).toBe(200);
      const body = await res.json();
      expect(body.desconto).toBe(0);
      expect(body.cupom).toMatchObject({ aplicado: false, mensagem });
    }
  });

  test('CT10 - subtotal de exatamente R$ 200,00 tem frete grátis', async ({ request }) => {
    test.fail(true, 'BUG-01: API retorna frete 19.9 e freteGratis=false para subtotal 200');
    const res = await request.post('/api/carrinho/calcular', {
      data: { itens: [{ produtoId: 'P005', quantidade: 2 }] },
    });
    const body = await res.json();
    expect(body.subtotal).toBe(200);
    expect(body.frete).toBe(0);
    expect(body.freteGratis).toBe(true);
    expect(body.total).toBe(200);
  });

  test('CT15 - quantidade acima de 5 é rejeitada com QUANTIDADE_MAXIMA_EXCEDIDA', async ({ request }) => {
    test.fail(true, 'BUG-02: API aceita quantidade 6 e responde 200');
    const res = await request.post('/api/carrinho/calcular', {
      data: { itens: [{ produtoId: 'P001', quantidade: 6 }] },
    });
    expect(res.status()).toBe(422);
    expect((await res.json()).erro.codigo).toBe('QUANTIDADE_MAXIMA_EXCEDIDA');
  });

  test('CT26 - erros de validação seguem o contrato documentado', async ({ request }) => {
    const casos: Array<[unknown, number, string]> = [
      [{ itens: [] }, 422, 'ITENS_OBRIGATORIOS'],
      [{ itens: ['P001'] }, 422, 'ITEM_INVALIDO'],
      [{ itens: [{ produtoId: 'P999', quantidade: 1 }] }, 422, 'PRODUTO_NAO_ENCONTRADO'],
      [{ itens: [{ produtoId: 'P001', quantidade: 1 }, { produtoId: 'P001', quantidade: 2 }] }, 422, 'ITEM_DUPLICADO'],
      [{ itens: [{ produtoId: 'P001', quantidade: 0 }] }, 422, 'QUANTIDADE_INVALIDA'],
      [{ itens: [{ produtoId: 'P001', quantidade: 1.5 }] }, 422, 'QUANTIDADE_INVALIDA'],
      ['isto não é json', 400, 'JSON_INVALIDO'],
    ];
    for (const [data, status, codigo] of casos) {
      const res = await request.post('/api/carrinho/calcular', { data: data as any });
      expect(res.status(), JSON.stringify(data)).toBe(status);
      expect((await res.json()).erro.codigo, JSON.stringify(data)).toBe(codigo);
    }
    const metodo = await request.get('/api/carrinho/calcular');
    expect(metodo.status()).toBe(405);
    expect((await metodo.json()).erro.codigo).toBe('METODO_NAO_PERMITIDO');
  });
});

test.describe('API - /api/pedidos', () => {
  test('CT20 - pedido válido responde 201 com número VZ-000000', async ({ request }) => {
    const res = await request.post('/api/pedidos', {
      data: { cliente, itens: [{ produtoId: 'P005', quantidade: 1 }], cupom: ' bemvindo10 ' },
    });
    expect(res.status()).toBe(201);
    const body = await res.json();
    expect(body.numero).toMatch(/^VZ-\d{6}$/);
    expect(body).toMatchObject({ subtotal: 100, desconto: 10, frete: 19.9, total: 109.9 });
    expect(body.cliente.cep).toBe('01310100');
  });

  test('CT24 - pedido com cupom inválido ou expirado responde 422', async ({ request }) => {
    for (const [cupom, codigo] of [['XPTO', 'CUPOM_INVALIDO'], ['VERAO2026', 'CUPOM_EXPIRADO']]) {
      const res = await request.post('/api/pedidos', {
        data: { cliente, itens: [{ produtoId: 'P005', quantidade: 1 }], cupom },
      });
      expect(res.status()).toBe(422);
      expect((await res.json()).erro.codigo).toBe(codigo);
    }
  });

  test('CT16 - pedido com mais de 5 unidades de um produto é rejeitado', async ({ request }) => {
    test.fail(true, 'BUG-02: API confirma pedido (201) com 6 unidades');
    const res = await request.post('/api/pedidos', {
      data: { cliente, itens: [{ produtoId: 'P005', quantidade: 6 }] },
    });
    expect(res.status()).toBe(422);
    expect((await res.json()).erro.codigo).toBe('QUANTIDADE_MAXIMA_EXCEDIDA');
  });
});
