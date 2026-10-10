# Teste técnico QA Júnior: Verzel Store

Validação da entrega **VZS-142: Cupom de desconto e frete grátis** (v2.3.0) da
[Verzel Store](https://verzel-store.qa-test-verzel-store.workers.dev/), a partir da
[documentação da entrega](https://verzel-store.qa-test-verzel-store.workers.dev/documentacao).

## Resultado em resumo

- **27 cenários** levantados a partir dos 11 critérios de aceite, das regras de cálculo e do contrato da API.
- **24 passaram e 3 falharam.** As falhas revelam **2 bugs de severidade alta**:
  - **[BUG-01](docs/bugs.md#bug-01):** com subtotal de **exatamente R$ 200,00** a loja cobra R$ 19,90 de frete (CA06 diz "a partir de R$ 200,00, inclusive"). A tela ainda mostra "Faltam R$ 0,00 para o frete grátis".
  - **[BUG-02](docs/bugs.md#bug-02):** a **API aceita mais de 5 unidades** por produto e confirma o pedido (CA10 diz que a regra vale também para a API). A interface bloqueia, mas dá para contornar pela sessão do navegador e fechar um pedido com 7 unidades.
- **Automação Playwright:** 20 testes (UI + API), todos passando. Os bugs ficam documentados com `test.fail()`.

## Onde encontrar cada entrega

| Entrega pedida | Onde está |
|---|---|
| Cenários de teste (Gherkin) | [`cenarios/`](cenarios): um `.feature` por funcionalidade (cupom, frete, quantidade/carrinho, checkout, API) |
| Execução dos testes (manuais e exploratórios) com o resultado de cada cenário | [`docs/execucao.md`](docs/execucao.md) |
| Report dos bugs | [`docs/bugs.md`](docs/bugs.md) |
| Evidências da execução | [`docs/evidencias.md`](docs/evidencias.md) (índice), [`evidencias/screenshots/`](evidencias/screenshots), [`evidencias/api/log-api.md`](evidencias/api/log-api.md) |
| Automação com Playwright | [`tests/`](tests): `tests/ui` (interface) e `tests/api` (API) |

## Como rodar a automação

Pré-requisito: **Node.js 18+**.

```bash
npm install
npx playwright install chromium

npm test              # roda tudo (UI + API)
npm run test:ui       # só testes de interface
npm run test:api      # só testes de API
npm run report        # abre o relatório HTML da última execução
npm run evidencias    # gera de novo os screenshots e o log da API em evidencias/
```

Os testes rodam direto contra o ambiente público (configurado em `playwright.config.ts`),
com só 2 workers para não sobrecarregar o ambiente compartilhado.

### Testes que documentam bugs (`test.fail`)

Os testes dos cenários com bug (CT10, CT15, CT16) descrevem o comportamento **esperado pela
documentação** e estão marcados com `test.fail(true, 'BUG-xx ...')`. Com isso:

- enquanto o bug existir, o teste falha como previsto e a suíte fica verde;
- quando o bug for corrigido, o Playwright acusa *"expected to fail, but passed"*. É o aviso para remover a marcação.

### Cenários automatizados

| Arquivo | Cenários |
|---|---|
| `tests/ui/cupom.spec.ts` | CT01, CT02/CT03, CT04/CT05, CT07 |
| `tests/ui/frete.spec.ts` | CT09, **CT10 (BUG-01)**, CT12 |
| `tests/ui/quantidade-checkout.spec.ts` | CT14, CT20, CT21/CT22 |
| `tests/api/carrinho-pedidos.spec.ts` | CT01, CT27, **CT10 (BUG-01)**, **CT15 (BUG-02)**, CT26, CT20, CT24, **CT16 (BUG-02)** |

## Estrutura

```
cenarios/                 cenários em Gherkin (pt-BR)
docs/
  execucao.md             resultado de cada cenário, rastreabilidade com os CAs, sessão exploratória
  bugs.md                 bugs com passos, esperado x obtido, severidade e evidências; observações
  evidencias.md           índice visual das evidências
evidencias/
  screenshots/            prints da interface (nomeados com o ID do cenário/bug)
  api/log-api.md          requisições e respostas da API
scripts/gerar-evidencias.mjs   script que gera as evidências
tests/
  support/loja.ts         ações reutilizáveis (vitrine, carrinho, cupom)
  ui/                     testes de interface
  api/                    testes de API
playwright.config.ts
```

## Estratégia e premissas

- **Base:** cada critério de aceite (CA01 a CA11) virou pelo menos um cenário, com foco em **análise de valor-limite** (R$ 199,80 / R$ 200,00 / acima; 5 / 6 unidades) e **partição de equivalência** (cupom válido, inválido, expirado, vazio, com caixa/espaços variados).
- **Duas camadas:** a doc diz que "os cálculos são feitos pela API e a interface apenas exibe o resultado". Por isso validei as regras na API e conferi na interface o que o cliente vê.
- **Fora do escopo** (conforme o enunciado e a seção "Sobre este ambiente"): carga, estresse, segurança, login, pagamento online, consulta de pedidos, persistência do carrinho entre abas e pedidos não armazenados. Nada disso foi reportado como bug.
- **Ambiguidades:** registradas como observações em [`docs/bugs.md`](docs/bugs.md#observações-não-reportadas-como-bug), com a interpretação adotada. Exemplo: "cupom de primeira compra" num ambiente sem login.
