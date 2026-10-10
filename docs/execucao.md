# Execução dos testes — VZS-142

**Ambiente:** https://verzel-store.qa-test-verzel-store.workers.dev (v2.3.0)
**Data:** 10/10/2026
**Navegador:** Chromium (Playwright), desktop 1280x900 e mobile 375x800
**Tipos de teste:** manual/exploratório na interface, chamadas diretas à API e automação Playwright

## Resumo

| Total de cenários | Passou | Falhou | Bugs abertos |
|---|---|---|---|
| 27 | 24 | 3 (CT10, CT15, CT16) | 2 |

> Os 3 cenários que falharam revelam 2 bugs: [BUG-01](bugs.md#bug-01) (CT10) e [BUG-02](bugs.md#bug-02) (CT15 e CT16).

## Rastreabilidade: critérios de aceite × cenários

| Critério | Cenários | Situação |
|---|---|---|
| CA01: BEMVINDO10 dá 10% sobre o subtotal | CT01, CT20 | ✅ Atendido |
| CA02: Cupom ignora caixa e espaços nas pontas | CT02, CT03 | ✅ Atendido |
| CA03: Cupom inexistente → "Cupom inválido." | CT04, CT24, CT27 | ✅ Atendido |
| CA04: Cupom expirado → "Cupom expirado." | CT05, CT24 | ✅ Atendido |
| CA05: Um cupom por vez | CT07 | ✅ Atendido |
| CA06: Frete grátis a partir de R$ 200,00, inclusive | CT10, CT11 | ❌ **Falhou** (BUG-01) |
| CA07: Abaixo de R$ 200,00 → R$ 19,90 e faltante | CT09, CT13 | ✅ Atendido |
| CA08: Frete grátis considera o subtotal antes do desconto | CT12 | ✅ Atendido |
| CA09: Desconto não incide sobre o frete | CT01, CT08 | ✅ Atendido |
| CA10: Máximo de 5 unidades, na interface e na API | CT14, CT15, CT16 | ❌ **Falhou** na API (BUG-02); interface OK |
| CA11: Arredondamento em 2 casas | CT18 | ✅ Atendido |
| Regras já existentes (nome, e-mail, CEP) | CT21, CT22, CT23 | ✅ Atendido |
| Contrato e códigos de erro da API | CT17, CT25, CT26, CT27 | ✅ Atendido (exceto `QUANTIDADE_MAXIMA_EXCEDIDA`, ver BUG-02) |

## Resultado por cenário

Legenda: **UI** = interface, **API** = chamada direta, **Auto** = coberto pela automação Playwright.

| ID | Cenário | Tipo | Resultado | Evidência |
|---|---|---|---|---|
| CT01 | Aplicar BEMVINDO10 (59,90 → desconto 5,99, total 73,81) | UI, API, Auto | ✅ Passou | [02](../evidencias/screenshots/02-CT01-cupom-bemvindo10-aplicado.png), log API |
| CT02 | Cupom em minúsculas/misto (`bemvindo10`, `BemVindo10`) | UI, API, Auto | ✅ Passou | [03](../evidencias/screenshots/03-CT02-CT03-cupom-minusculo-com-espacos.png) |
| CT03 | Cupom com espaços nas pontas (inclusive tab/quebra de linha na API) | UI, API, Auto | ✅ Passou | [03](../evidencias/screenshots/03-CT02-CT03-cupom-minusculo-com-espacos.png) |
| CT04 | Cupom inexistente → "Cupom inválido." | UI, API, Auto | ✅ Passou | [04](../evidencias/screenshots/04-CT04-cupom-invalido.png) |
| CT05 | Cupom expirado VERAO2026 → "Cupom expirado." | UI, API, Auto | ✅ Passou | [05](../evidencias/screenshots/05-CT05-cupom-expirado.png) |
| CT06 | Aplicar cupom vazio → "Informe um cupom." | UI | ✅ Passou | [06](../evidencias/screenshots/06-CT06-cupom-vazio.png) |
| CT07 | Um cupom por vez; remover e aplicar outro | UI, Auto | ✅ Passou | [07](../evidencias/screenshots/07-CT07-cupom-removido-e-outro-aplicado.png) |
| CT08 | Desconto não incide no frete (100,00 → total 109,90) | UI, API | ✅ Passou | [19](../evidencias/screenshots/19-CT20-pedido-confirmado-com-cupom.png) |
| CT09 | Subtotal 199,80 → frete 19,90 e "Faltam R$ 0,20" | UI, API, Auto | ✅ Passou | [08](../evidencias/screenshots/08-CT09-subtotal-199-80-frete-cobrado.png) |
| CT10 | **Subtotal 200,00 → frete grátis** | UI, API, Auto | ❌ **Falhou: BUG-01** | [09](../evidencias/screenshots/09-BUG-01-subtotal-200-cobra-frete.png), [10](../evidencias/screenshots/10-BUG-01-pedido-200-confirmado-com-frete.png) |
| CT11 | Subtotal 229,90 → frete grátis | UI, API | ✅ Passou | [11](../evidencias/screenshots/11-CT11-subtotal-229-90-frete-gratis.png) |
| CT12 | Subtotal 209,40 com cupom (188,46) mantém frete grátis | UI, API, Auto | ✅ Passou | [12](../evidencias/screenshots/12-CT12-frete-gratis-antes-do-desconto.png) |
| CT13 | Alterar quantidade recalcula frete, desconto e faltante | UI | ✅ Passou | [20](../evidencias/screenshots/20-CT13-quantidade-alterada-recalcula.png) |
| CT14 | Interface limita a 5 unidades (vitrine e carrinho) | UI, Auto | ✅ Passou | [13](../evidencias/screenshots/13-CT14-vitrine-limite-5-unidades.png), [14](../evidencias/screenshots/14-CT14-carrinho-botao-mais-desabilitado.png) |
| CT15 | **API de cálculo rejeita 6 unidades** | API, Auto | ❌ **Falhou: BUG-02** | log API, [15](../evidencias/screenshots/15-BUG-02-carrinho-com-7-unidades.png) |
| CT16 | **API de pedidos rejeita 6 unidades** | API, UI, Auto | ❌ **Falhou: BUG-02** | log API, [16](../evidencias/screenshots/16-BUG-02-pedido-com-7-unidades-confirmado.png) |
| CT17 | Quantidade 0, -1, 1.5, "2", null → QUANTIDADE_INVALIDA | API | ✅ Passou | log API |
| CT18 | Arredondamento: 39 combinações aleatórias batem com a fórmula | API | ✅ Passou | ver nota abaixo |
| CT19 | Remover item e esvaziar carrinho (limpa também o cupom) | UI | ✅ Passou | [21](../evidencias/screenshots/21-CT19-carrinho-esvaziado.png) |
| CT20 | Pedido confirmado com cupom (VZ-000000, valores iguais ao carrinho) | UI, API, Auto | ✅ Passou | [19](../evidencias/screenshots/19-CT20-pedido-confirmado-com-cupom.png) |
| CT21 | Checkout com campos vazios | UI, API, Auto | ✅ Passou | [17](../evidencias/screenshots/17-CT21-checkout-campos-vazios.png) |
| CT22 | Checkout com nome/e-mail/CEP em formato inválido | UI, API, Auto | ✅ Passou | [18](../evidencias/screenshots/18-CT22-checkout-formatos-invalidos.png) |
| CT23 | CEP com e sem hífen é aceito e normalizado | UI, API | ✅ Passou | log API |
| CT24 | Pedido com cupom inválido/expirado → 422 e mensagem no checkout | UI, API, Auto | ✅ Passou | [22](../evidencias/screenshots/22-CT24-checkout-cupom-expirado-422.png), log API |
| CT25 | GET produtos / produto por id / 404 | API | ✅ Passou | log API |
| CT26 | Códigos de erro (400, 404, 405, 422) no formato documentado | API, Auto | ✅ Passou | log API |
| CT27 | Cálculo com cupom inválido responde 200 sem desconto | API, Auto | ✅ Passou | log API |

### Nota sobre o CT18 (arredondamento)
Montei 39 carrinhos aleatórios (produtos, quantidades de 1 a 5, com e sem cupom) e comparei a resposta da API com o cálculo esperado (`subtotal - desconto + frete`, valores com 2 casas). Houve **0 divergências**. A amostra não chegou a ter subtotal exatamente igual a R$ 200,00, caso já coberto pelo CT10.

## Testes exploratórios (sessão livre)

Além dos cenários, fiz uma sessão exploratória com foco em fronteiras e em contornar a interface:

| Área explorada | O que foi feito | Resultado |
|---|---|---|
| Fronteira do frete | 199,80 / 200,00 / 209,40 / 229,90 / 239,90, com e sem cupom | Encontrado BUG-01 |
| Contornar a UI | Alterar `sessionStorage` (`verzel-store:itens`) para 7 unidades e finalizar | Encontrado BUG-02 (impacto ponta a ponta) |
| Cupom com tipos inesperados | número, array, espaço no meio, tab/quebra de linha | Sem bug; ver OBS-02 |
| Cupom expirado "guardado" no carrinho até o checkout | Cupom injetado na sessão e pedido confirmado | API retorna 422 e a tela mostra "Cupom expirado.", correto |
| Carrinho vazio indo direto para `/checkout` | Acesso direto pela URL | Redireciona para o carrinho vazio, correto |
| Rota inexistente na loja | `/nao-existe` | Página "Página não encontrada", correto |
| Responsividade | Carrinho em 375px | Sem rolagem horizontal |
| Contador do cabeçalho | 3 + 2 unidades de produtos diferentes | Mostra 5 (soma de unidades), coerente |
| Dados do cliente | nome com 1 palavra, espaços extras, só números; e-mails e CEPs com variações | Validação conforme a doc; ver OBS-03 e OBS-05 |

## Automação

`npx playwright test` → **20 testes, 20 passando** (10/10/2026):
- 16 testes validam comportamento correto.
- 4 testes documentam os bugs com `test.fail()` (CT10 UI, CT10 API, CT15, CT16). Eles **passam enquanto o bug existir** e passam a acusar falha quando o bug for corrigido. Esse é o aviso para remover a marcação.
