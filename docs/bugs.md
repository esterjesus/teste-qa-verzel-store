# Report de bugs — VZS-142 (Cupom de desconto e frete grátis)

Ambiente: https://verzel-store.qa-test-verzel-store.workers.dev (versão 2.3.0)
Navegador: Chromium (Playwright) e chamadas diretas à API
Data da execução: 10/10/2026

| ID | Título | Severidade | Prioridade | Critério |
|----|--------|-----------|------------|----------|
| [BUG-01](#bug-01) | Subtotal de exatamente R$ 200,00 cobra frete de R$ 19,90 | Alta | Alta | CA06 |
| [BUG-02](#bug-02) | API aceita mais de 5 unidades por produto e confirma o pedido | Alta | Alta | CA10 |

---

## BUG-01

**Título:** Subtotal de exatamente R$ 200,00 cobra frete de R$ 19,90 em vez de frete grátis

**Severidade:** Alta. É uma regra de preço da entrega, o cliente paga a mais e o valor fica gravado no pedido confirmado.
**Prioridade:** Alta
**Componente:** API (`/api/carrinho/calcular` e `/api/pedidos`). A interface só repete o que a API devolve.
**Critério de aceite violado:** CA06: "O frete é grátis para compras com subtotal a partir de R$ 200,00, **inclusive**." Também a tabela "Regras de cálculo": "R$ 0,00 quando o subtotal é **igual ou maior** que R$ 200,00".

**Pré-condição:** carrinho vazio.

**Passos para reproduzir (UI):**
1. Na vitrine, adicionar 4x "Garrafa Térmica 750ml" (R$ 50,00 cada).
2. Abrir o carrinho.

**Resultado esperado:**
- Subtotal R$ 200,00, Frete **Grátis**, Total **R$ 200,00**.
- Sem a mensagem de quanto falta para o frete grátis.

**Resultado obtido:**
- Subtotal R$ 200,00, Frete **R$ 19,90**, Total **R$ 219,90**.
- A tela mostra **"Faltam R$ 0,00 para o frete grátis."**, que se contradiz: não falta nada, mas o frete é cobrado.
- Ao finalizar, o pedido é confirmado com o frete cobrado.

**Reprodução pela API:**
```http
POST /api/carrinho/calcular
{ "itens": [ { "produtoId": "P005", "quantidade": 2 } ] }
```
Resposta (HTTP 200):
```json
{ "subtotal": 200, "desconto": 0, "frete": 19.9, "freteGratis": false,
  "valorFaltanteFreteGratis": 0, "total": 219.9, "cupom": null }
```
A resposta é incoerente: `valorFaltanteFreteGratis = 0` (calculado certo) junto com `freteGratis = false` e `frete = 19.9`. O mesmo acontece em `POST /api/pedidos` (HTTP 201, total 219.9) e com cupom (subtotal 200 + BEMVINDO10 → total 199,90 em vez de 180,00).

**Fronteiras verificadas:** R$ 199,80 → frete R$ 19,90 (correto); R$ 200,00 → **frete R$ 19,90 (incorreto)**; R$ 229,90 e R$ 239,90 → grátis (correto).

**Hipótese de causa:** a comparação do frete parece usar `subtotal > 200` em vez de `subtotal >= 200`, enquanto o faltante usa `max(0, 200 - subtotal)`.

**Evidências:**
- [09-BUG-01-subtotal-200-cobra-frete.png](../evidencias/screenshots/09-BUG-01-subtotal-200-cobra-frete.png)
- [10-BUG-01-pedido-200-confirmado-com-frete.png](../evidencias/screenshots/10-BUG-01-pedido-200-confirmado-com-frete.png)
- Log da API: entradas "CT10 / BUG-01" em [log-api.md](../evidencias/api/log-api.md)
- Testes automatizados: `CT10` em `tests/ui/frete.spec.ts` e `tests/api/carrinho-pedidos.spec.ts`

---

## BUG-02

**Título:** API não valida o limite de 5 unidades por produto e confirma pedidos acima do limite

**Severidade:** Alta. O critério diz que a regra vale também para a API. Hoje qualquer cliente que chame a API direto, ou que altere o carrinho no navegador, fecha pedido com quantidade acima do permitido.
**Prioridade:** Alta
**Componente:** API (`/api/carrinho/calcular` e `/api/pedidos`)
**Critério de aceite violado:** CA10: "Cada produto pode ter no máximo 5 unidades por pedido. A regra vale para a interface **e para a API**." A doc também lista o erro `422 QUANTIDADE_MAXIMA_EXCEDIDA`, que nunca é retornado.

**Passos para reproduzir (API):**
1. Enviar:
```http
POST /api/pedidos
{ "cliente": { "nome": "Maria Silva", "email": "maria@exemplo.com", "cep": "01310-100" },
  "itens": [ { "produtoId": "P005", "quantidade": 6 } ] }
```

**Resultado esperado:** HTTP 422 com `erro.codigo = "QUANTIDADE_MAXIMA_EXCEDIDA"` e `campo = "itens[0].quantidade"`.

**Resultado obtido:** HTTP **201**, pedido `VZ-xxxxxx` gerado com 6 unidades (subtotal 600, frete grátis). O mesmo acontece em `/api/carrinho/calcular` (HTTP 200), inclusive com `quantidade: 100`.

**Reprodução pela interface (impacto ponta a ponta):**
1. Adicionar 1 "Camiseta Essencial" ao carrinho.
2. No DevTools (Console), executar:
   `sessionStorage.setItem('verzel-store:itens', '[{"produtoId":"P001","quantidade":7}]')` e recarregar `/carrinho`.
3. O carrinho mostra "Limite de 5 unidades por produto." mas exibe 7 unidades, calcula R$ 419,30 e mantém "Finalizar compra" ativo.
4. Finalizar com dados válidos → **"Pedido confirmado"** com 7x Camiseta Essencial.

**Observação:** a interface bloqueia corretamente pelos botões (o botão "+" e "Adicionar ao carrinho" ficam desabilitados em 5). O problema é a falta da validação no servidor, que é a última barreira. Como ponto secundário, a UI detecta a quantidade acima do limite mas não bloqueia o "Finalizar compra".

**Evidências:**
- [15-BUG-02-carrinho-com-7-unidades.png](../evidencias/screenshots/15-BUG-02-carrinho-com-7-unidades.png)
- [16-BUG-02-pedido-com-7-unidades-confirmado.png](../evidencias/screenshots/16-BUG-02-pedido-com-7-unidades-confirmado.png)
- Log da API: entradas "CT15 / BUG-02" e "CT16 / BUG-02" em [log-api.md](../evidencias/api/log-api.md)
- Testes automatizados: `CT15` e `CT16` em `tests/api/carrinho-pedidos.spec.ts`

---

## Observações (não reportadas como bug)

Pontos que encontrei, mas que a documentação não define. Registro a minha interpretação, como o enunciado pede para ambiguidades:

| # | Observação | Interpretação |
|---|-----------|---------------|
| OBS-01 | O banner diz "na primeira compra, o cupom BEMVINDO10…", mas o cupom pode ser usado em qualquer pedido. | Não há login nem histórico de pedidos (fora de escopo pela seção "Sobre este ambiente"), então não tem como validar "primeira compra". Não considerei bug. Vale alinhar o texto com o PO. |
| OBS-02 | `cupom` com tipo não-texto (`123`, `["BEMVINDO10","VERAO2026"]`) responde 200 com "Cupom inválido." em vez de erro de validação. | A doc só define o campo como opcional. O comportamento é seguro (não aplica desconto). Sugestão de melhoria. |
| OBS-03 | Nome "123 456" e CEP "00000000" são aceitos no pedido. | A regra pede apenas "nome e sobrenome" e "8 dígitos", e isso é atendido. Sugestão de melhoria. |
| OBS-04 | O id do produto diferencia maiúsculas (`p001` → 404). | A doc não diz que deveria ignorar. Considerei correto. |
| OBS-05 | Espaços duplicados no meio do nome ("Maria  Silva") são mantidos, enquanto os das pontas são removidos. | Cosmético. |
