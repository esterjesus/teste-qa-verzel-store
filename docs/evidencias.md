# Evidências da execução

As evidências ficam em [`evidencias/`](../evidencias) e podem ser geradas de novo com `npm run evidencias`.

- **Screenshots da interface:** [`evidencias/screenshots/`](../evidencias/screenshots)
- **Log completo da API (requisição + resposta + status):** [`evidencias/api/log-api.md`](../evidencias/api/log-api.md)
- **Relatório da automação (HTML, com screenshot de cada teste):** gerado em `playwright-report/` ao rodar `npm test` (abrir com `npm run report`)

## Bugs

### BUG-01: subtotal R$ 200,00 cobra frete
Carrinho com 4 garrafas (R$ 200,00): frete R$ 19,90, total R$ 219,90 e a mensagem "Faltam R$ 0,00 para o frete grátis".

![BUG-01 carrinho](../evidencias/screenshots/09-BUG-01-subtotal-200-cobra-frete.png)

Pedido confirmado com o frete cobrado:

![BUG-01 pedido](../evidencias/screenshots/10-BUG-01-pedido-200-confirmado-com-frete.png)

### BUG-02: mais de 5 unidades aceitas pela API
Carrinho com 7 unidades (sessão alterada): a tela avisa sobre o limite, mas calcula e libera "Finalizar compra".

![BUG-02 carrinho](../evidencias/screenshots/15-BUG-02-carrinho-com-7-unidades.png)

Pedido confirmado com 7 unidades:

![BUG-02 pedido](../evidencias/screenshots/16-BUG-02-pedido-com-7-unidades-confirmado.png)

## Cenários que passaram

| Cenário | Screenshot |
|---|---|
| Vitrine | ![](../evidencias/screenshots/01-vitrine.png) |
| CT01: BEMVINDO10 aplicado | ![](../evidencias/screenshots/02-CT01-cupom-bemvindo10-aplicado.png) |
| CT02/CT03: "  bemvindo10  " | ![](../evidencias/screenshots/03-CT02-CT03-cupom-minusculo-com-espacos.png) |
| CT04: cupom inválido | ![](../evidencias/screenshots/04-CT04-cupom-invalido.png) |
| CT05: cupom expirado | ![](../evidencias/screenshots/05-CT05-cupom-expirado.png) |
| CT06: cupom vazio | ![](../evidencias/screenshots/06-CT06-cupom-vazio.png) |
| CT07: remover cupom e aplicar outro | ![](../evidencias/screenshots/07-CT07-cupom-removido-e-outro-aplicado.png) |
| CT09: subtotal 199,80 | ![](../evidencias/screenshots/08-CT09-subtotal-199-80-frete-cobrado.png) |
| CT11: subtotal 229,90, frete grátis | ![](../evidencias/screenshots/11-CT11-subtotal-229-90-frete-gratis.png) |
| CT12: frete grátis antes do desconto | ![](../evidencias/screenshots/12-CT12-frete-gratis-antes-do-desconto.png) |
| CT13: quantidade alterada recalcula | ![](../evidencias/screenshots/20-CT13-quantidade-alterada-recalcula.png) |
| CT14: limite de 5 na vitrine | ![](../evidencias/screenshots/13-CT14-vitrine-limite-5-unidades.png) |
| CT14: "+" desabilitado no carrinho | ![](../evidencias/screenshots/14-CT14-carrinho-botao-mais-desabilitado.png) |
| CT19: carrinho esvaziado | ![](../evidencias/screenshots/21-CT19-carrinho-esvaziado.png) |
| CT20: pedido confirmado com cupom | ![](../evidencias/screenshots/19-CT20-pedido-confirmado-com-cupom.png) |
| CT21: checkout com campos vazios | ![](../evidencias/screenshots/17-CT21-checkout-campos-vazios.png) |
| CT22: checkout com formatos inválidos | ![](../evidencias/screenshots/18-CT22-checkout-formatos-invalidos.png) |
| CT24: checkout com cupom expirado | ![](../evidencias/screenshots/22-CT24-checkout-cupom-expirado-422.png) |
