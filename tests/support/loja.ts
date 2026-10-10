import { Page, Locator, expect } from '@playwright/test';

/** Ações e elementos da vitrine e do carrinho da Verzel Store. */
export class Carrinho {
  readonly campoCupom: Locator;
  readonly botaoAplicar: Locator;
  readonly avisoFrete: Locator;
  readonly contadorCabecalho: Locator;

  constructor(private page: Page) {
    this.campoCupom = page.locator('#campo-cupom');
    this.botaoAplicar = page.getByRole('button', { name: 'Aplicar cupom' });
    this.avisoFrete = page.locator('.aviso-frete');
    // Badge do cabeçalho: soma das unidades de todos os produtos ("N itens no carrinho")
    this.contadorCabecalho = page.getByLabel(/itens? no carrinho/);
  }

  /** Adiciona um produto pela vitrine, clicando "Adicionar ao carrinho" N vezes. */
  async adicionarPelaVitrine(nomeProduto: string, vezes = 1) {
    await this.page.goto('/');
    const card = this.page.locator('article', { hasText: nomeProduto });
    const inicial = Number(await this.contadorCabecalho.innerText());
    for (let i = 1; i <= vezes; i++) {
      await card.getByRole('button', { name: 'Adicionar ao carrinho' }).click();
      await expect(this.contadorCabecalho).toHaveText(String(inicial + i));
    }
  }

  async abrir() {
    await this.page.goto('/carrinho');
    await expect(this.page.locator('.coluna-resumo')).toHaveAttribute('aria-busy', 'false');
  }

  async aplicarCupom(codigo: string) {
    await this.campoCupom.fill(codigo);
    await this.botaoAplicar.click();
  }

  valor(campo: 'subtotal' | 'desconto' | 'frete' | 'total') {
    return this.page.locator(`dd[data-valor="${campo}"]`);
  }
}
