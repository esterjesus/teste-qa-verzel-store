import { test, expect } from '@playwright/test';
import { Carrinho } from '../support/loja';

test.describe('Cupom de desconto (UI)', () => {
  let carrinho: Carrinho;

  test.beforeEach(async ({ page }) => {
    carrinho = new Carrinho(page);
    // Camiseta Essencial: subtotal R$ 59,90 (abaixo do frete grátis)
    await carrinho.adicionarPelaVitrine('Camiseta Essencial');
    await carrinho.abrir();
  });

  test('CT01 - BEMVINDO10 aplica 10% sobre o subtotal e não sobre o frete', async ({ page }) => {
    await carrinho.aplicarCupom('BEMVINDO10');

    await expect(page.getByText('Cupom BEMVINDO10 aplicado.')).toBeVisible();
    await expect(carrinho.valor('subtotal')).toHaveText('R$ 59,90');
    await expect(carrinho.valor('desconto')).toHaveText('- R$ 5,99');
    await expect(carrinho.valor('frete')).toHaveText('R$ 19,90');
    // total = 59,90 - 5,99 + 19,90 (desconto não incide no frete - CA09)
    await expect(carrinho.valor('total')).toHaveText('R$ 73,81');
  });

  for (const codigo of ['bemvindo10', '  BemVindo10  ']) {
    test(`CT02/CT03 - cupom ignora maiúsculas/minúsculas e espaços: "${codigo}"`, async ({ page }) => {
      await carrinho.aplicarCupom(codigo);
      await expect(page.getByText('Cupom BEMVINDO10 aplicado.')).toBeVisible();
      await expect(carrinho.valor('desconto')).toHaveText('- R$ 5,99');
    });
  }

  for (const [codigo, mensagem] of [['XPTO123', 'Cupom inválido.'], ['VERAO2026', 'Cupom expirado.']]) {
    test(`CT04/CT05 - cupom "${codigo}" exibe "${mensagem}" e não aplica desconto`, async ({ page }) => {
      await carrinho.aplicarCupom(codigo);
      await expect(page.getByText(mensagem)).toBeVisible();
      await expect(carrinho.valor('desconto')).toHaveText('R$ 0,00');
      await expect(carrinho.valor('total')).toHaveText('R$ 79,80');
    });
  }

  test('CT07 - apenas um cupom por vez: é preciso remover o atual para aplicar outro', async ({ page }) => {
    await carrinho.aplicarCupom('BEMVINDO10');
    await expect(page.getByText('Cupom BEMVINDO10 aplicado.')).toBeVisible();
    // Com cupom aplicado, o campo para um segundo cupom não fica disponível
    await expect(carrinho.campoCupom).toBeHidden();

    await page.getByRole('button', { name: 'Remover cupom' }).click();
    await expect(carrinho.valor('desconto')).toHaveText('R$ 0,00');

    await carrinho.aplicarCupom('VERAO2026');
    await expect(page.getByText('Cupom expirado.')).toBeVisible();
  });
});
