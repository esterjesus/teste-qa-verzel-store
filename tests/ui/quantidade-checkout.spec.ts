import { test, expect } from '@playwright/test';
import { Carrinho } from '../support/loja';

test.describe('Limite de quantidade e checkout (UI)', () => {
  test('CT14 - interface limita cada produto a 5 unidades', async ({ page }) => {
    const carrinho = new Carrinho(page);
    await carrinho.adicionarPelaVitrine('Boné Aba Curva', 5);

    const card = page.locator('article', { hasText: 'Boné Aba Curva' });
    await expect(card.getByRole('button', { name: 'Adicionar ao carrinho' })).toBeDisabled();
    await expect(card).toContainText('Limite de 5 unidades atingido.');

    await carrinho.abrir();
    await expect(page.getByRole('button', { name: 'Aumentar quantidade de Boné Aba Curva' })).toBeDisabled();
  });

  test('CT20 - pedido confirmado com cupom mostra número VZ-000000 e os mesmos valores do carrinho', async ({ page }) => {
    const carrinho = new Carrinho(page);
    await carrinho.adicionarPelaVitrine('Mochila Urbana 20L');
    await carrinho.abrir();
    await carrinho.aplicarCupom('BEMVINDO10');
    await expect(carrinho.valor('total')).toHaveText('R$ 109,90');

    await page.getByRole('link', { name: 'Finalizar compra' }).click();
    await page.getByLabel('Nome completo').fill('Maria Silva');
    await page.getByLabel('E-mail').fill('maria@exemplo.com');
    await page.getByLabel('CEP').fill('01310-100');
    await page.getByRole('button', { name: 'Confirmar pedido' }).click();

    await expect(page.getByText('Pedido confirmado')).toBeVisible();
    await expect(page.getByRole('heading', { level: 1 })).toHaveText(/^Pedido VZ-\d{6}$/);
    await expect(carrinho.valor('desconto')).toHaveText('- R$ 10,00');
    await expect(carrinho.valor('frete')).toHaveText('R$ 19,90');
    await expect(carrinho.valor('total')).toHaveText('R$ 109,90');
  });

  test('CT21/CT22 - checkout valida campos obrigatórios e formatos', async ({ page }) => {
    const carrinho = new Carrinho(page);
    await carrinho.adicionarPelaVitrine('Camiseta Essencial');
    await page.goto('/checkout');

    await page.getByRole('button', { name: 'Confirmar pedido' }).click();
    await expect(page.getByText('Informe o nome completo.')).toBeVisible();
    await expect(page.getByText('Informe o e-mail.')).toBeVisible();
    await expect(page.getByText('Informe o CEP.')).toBeVisible();

    await page.getByLabel('Nome completo').fill('Maria');
    await page.getByLabel('E-mail').fill('maria@exemplo');
    await page.getByLabel('CEP').fill('1234');
    await page.getByRole('button', { name: 'Confirmar pedido' }).click();
    await expect(page.getByText('Informe nome e sobrenome.')).toBeVisible();
    await expect(page.getByText('Informe um e-mail válido.')).toBeVisible();
    await expect(page.getByText('Informe um CEP com 8 dígitos.')).toBeVisible();
    await expect(page).toHaveURL(/\/checkout$/);
  });
});
