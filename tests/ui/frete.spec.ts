import { test, expect } from '@playwright/test';
import { Carrinho } from '../support/loja';

test.describe('Frete grátis (UI)', () => {
  test('CT09 - abaixo de R$ 200,00 cobra R$ 19,90 e informa quanto falta', async ({ page }) => {
    const carrinho = new Carrinho(page);
    // 139,90 + 59,90 = 199,80
    await carrinho.adicionarPelaVitrine('Calça Jeans Slim');
    await carrinho.adicionarPelaVitrine('Camiseta Essencial');
    await carrinho.abrir();

    await expect(carrinho.valor('subtotal')).toHaveText('R$ 199,80');
    await expect(carrinho.valor('frete')).toHaveText('R$ 19,90');
    await expect(carrinho.avisoFrete).toHaveText('Faltam R$ 0,20 para o frete grátis.');
  });

  test('CT10 - subtotal de exatamente R$ 200,00 tem frete grátis', async ({ page }) => {
    test.fail(true, 'BUG-01: com subtotal = R$ 200,00 a loja cobra R$ 19,90 de frete');
    const carrinho = new Carrinho(page);
    // 4 x 50,00 = 200,00
    await carrinho.adicionarPelaVitrine('Garrafa Térmica 750ml', 4);
    await carrinho.abrir();

    await expect(carrinho.valor('subtotal')).toHaveText('R$ 200,00');
    await expect(carrinho.valor('frete')).toHaveText('Grátis', { timeout: 3_000 });
    await expect(carrinho.valor('total')).toHaveText('R$ 200,00', { timeout: 3_000 });
  });

  test('CT12 - frete grátis considera o subtotal antes do desconto do cupom', async ({ page }) => {
    const carrinho = new Carrinho(page);
    // 5 x 29,90 + 59,90 = 209,40 ; com 10% de desconto os produtos ficam em 188,46 (< 200)
    await carrinho.adicionarPelaVitrine('Kit 3 Pares de Meias', 5);
    await carrinho.adicionarPelaVitrine('Camiseta Essencial');
    await carrinho.abrir();
    await carrinho.aplicarCupom('BEMVINDO10');

    await expect(carrinho.valor('subtotal')).toHaveText('R$ 209,40');
    await expect(carrinho.valor('desconto')).toHaveText('- R$ 20,94');
    await expect(carrinho.valor('frete')).toHaveText('Grátis');
    await expect(carrinho.valor('total')).toHaveText('R$ 188,46');
  });
});
