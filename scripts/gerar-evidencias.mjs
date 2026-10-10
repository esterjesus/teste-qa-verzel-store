// Gera as evidências da execução manual/exploratória:
//  - screenshots da interface em evidencias/screenshots
//  - log de requisições e respostas da API em evidencias/api/log-api.md
// Uso: npm run evidencias
import { chromium } from '@playwright/test';
import { mkdirSync, writeFileSync } from 'node:fs';

const URL = 'https://verzel-store.qa-test-verzel-store.workers.dev';
const SHOTS = 'evidencias/screenshots';
mkdirSync(SHOTS, { recursive: true });
mkdirSync('evidencias/api', { recursive: true });

const browser = await chromium.launch();

async function novaAba(itens = [], cupom = null) {
  const page = await (await browser.newContext({ viewport: { width: 1280, height: 900 } })).newPage();
  await page.goto(URL);
  await page.evaluate(([i, c]) => {
    sessionStorage.setItem('verzel-store:itens', JSON.stringify(i));
    sessionStorage.setItem('verzel-store:cupom', JSON.stringify(c));
  }, [itens, cupom]);
  return page;
}
const pronto = (p) => p.waitForSelector('.coluna-resumo[aria-busy="false"], .vazio, main h1', { timeout: 10000 }).then(() => p.waitForTimeout(600));
const shot = async (p, nome) => { await p.screenshot({ path: `${SHOTS}/${nome}.png`, fullPage: true }); console.log('  ok', nome); };
async function carrinho(itens, cupom = null) { const p = await novaAba(itens, cupom); await p.goto(URL + '/carrinho'); await pronto(p); return p; }
async function aplicar(p, codigo) { await p.fill('#campo-cupom', codigo); await p.getByRole('button', { name: 'Aplicar cupom' }).click(); await p.waitForTimeout(1200); }
async function checkout(p, nome, email, cep) {
  await p.goto(URL + '/checkout'); await pronto(p);
  await p.fill('#campo-nome', nome); await p.fill('#campo-email', email); await p.fill('#campo-cep', cep);
  await p.getByRole('button', { name: 'Confirmar pedido' }).click(); await p.waitForTimeout(1800);
}

console.log('Screenshots');
let p = await novaAba(); await p.goto(URL); await p.waitForTimeout(1000); await shot(p, '01-vitrine');
const camiseta = [{ produtoId: 'P001', quantidade: 1 }];
p = await carrinho(camiseta); await aplicar(p, 'BEMVINDO10'); await shot(p, '02-CT01-cupom-bemvindo10-aplicado');
p = await carrinho(camiseta); await aplicar(p, '  bemvindo10  '); await shot(p, '03-CT02-CT03-cupom-minusculo-com-espacos');
p = await carrinho(camiseta); await aplicar(p, 'XPTO123'); await shot(p, '04-CT04-cupom-invalido');
p = await carrinho(camiseta); await aplicar(p, 'VERAO2026'); await shot(p, '05-CT05-cupom-expirado');
p = await carrinho(camiseta); await aplicar(p, ''); await shot(p, '06-CT06-cupom-vazio');
p = await carrinho(camiseta); await aplicar(p, 'BEMVINDO10'); await p.getByRole('button', { name: 'Remover cupom' }).click(); await p.waitForTimeout(1000);
await aplicar(p, 'VERAO2026'); await shot(p, '07-CT07-cupom-removido-e-outro-aplicado');
p = await carrinho([{ produtoId: 'P002', quantidade: 1 }, { produtoId: 'P001', quantidade: 1 }]); await shot(p, '08-CT09-subtotal-199-80-frete-cobrado');
p = await carrinho([{ produtoId: 'P008', quantidade: 4 }]); await shot(p, '09-BUG-01-subtotal-200-cobra-frete');
await checkout(p, 'Maria Silva', 'maria@exemplo.com', '01310-100'); await shot(p, '10-BUG-01-pedido-200-confirmado-com-frete');
p = await carrinho([{ produtoId: 'P007', quantidade: 1 }]); await shot(p, '11-CT11-subtotal-229-90-frete-gratis');
p = await carrinho([{ produtoId: 'P006', quantidade: 5 }, { produtoId: 'P001', quantidade: 1 }]); await aplicar(p, 'BEMVINDO10'); await shot(p, '12-CT12-frete-gratis-antes-do-desconto');
p = await novaAba([{ produtoId: 'P004', quantidade: 5 }]); await p.goto(URL); await p.waitForTimeout(1200); await shot(p, '13-CT14-vitrine-limite-5-unidades');
p = await carrinho([{ produtoId: 'P004', quantidade: 5 }]); await shot(p, '14-CT14-carrinho-botao-mais-desabilitado');
p = await carrinho([{ produtoId: 'P001', quantidade: 7 }]); await shot(p, '15-BUG-02-carrinho-com-7-unidades');
await checkout(p, 'Maria Silva', 'maria@exemplo.com', '01310100'); await shot(p, '16-BUG-02-pedido-com-7-unidades-confirmado');
p = await novaAba(camiseta); await checkout(p, '', '', ''); await shot(p, '17-CT21-checkout-campos-vazios');
p = await novaAba(camiseta); await checkout(p, 'Maria', 'maria@exemplo', '1234'); await shot(p, '18-CT22-checkout-formatos-invalidos');
p = await novaAba([{ produtoId: 'P005', quantidade: 1 }], 'BEMVINDO10'); await checkout(p, 'Maria Silva', 'maria@exemplo.com', '01310-100'); await shot(p, '19-CT20-pedido-confirmado-com-cupom');
p = await carrinho([{ produtoId: 'P002', quantidade: 1 }]); await aplicar(p, 'BEMVINDO10'); await p.getByRole('button', { name: /Aumentar/ }).click(); await p.waitForTimeout(1200); await shot(p, '20-CT13-quantidade-alterada-recalcula');
await p.getByRole('button', { name: 'Esvaziar carrinho' }).click(); await p.waitForTimeout(800); await shot(p, '21-CT19-carrinho-esvaziado');
p = await novaAba([], 'VERAO2026'); await p.evaluate(() => sessionStorage.setItem('verzel-store:itens', JSON.stringify([{ produtoId: 'P001', quantidade: 1 }])));
await checkout(p, 'Maria Silva', 'maria@exemplo.com', '01310100'); await shot(p, '22-CT24-checkout-cupom-expirado-422');
await browser.close();

console.log('Log da API');
const cliente = { nome: 'Maria Silva', email: 'maria@exemplo.com', cep: '01310-100' };
const casos = [
  ['CT25', 'GET', '/api/produtos'],
  ['CT25', 'GET', '/api/produtos/P001'],
  ['CT25', 'GET', '/api/produtos/P999'],
  ['CT01', 'POST', '/api/carrinho/calcular', { itens: [{ produtoId: 'P002', quantidade: 1 }, { produtoId: 'P004', quantidade: 2 }], cupom: 'BEMVINDO10' }],
  ['CT02', 'POST', '/api/carrinho/calcular', { itens: [{ produtoId: 'P001', quantidade: 1 }], cupom: 'bemvindo10' }],
  ['CT03', 'POST', '/api/carrinho/calcular', { itens: [{ produtoId: 'P001', quantidade: 1 }], cupom: '  BEMVINDO10  ' }],
  ['CT04/CT27', 'POST', '/api/carrinho/calcular', { itens: [{ produtoId: 'P001', quantidade: 1 }], cupom: 'XPTO' }],
  ['CT05/CT27', 'POST', '/api/carrinho/calcular', { itens: [{ produtoId: 'P001', quantidade: 1 }], cupom: 'VERAO2026' }],
  ['CT09', 'POST', '/api/carrinho/calcular', { itens: [{ produtoId: 'P002', quantidade: 1 }, { produtoId: 'P001', quantidade: 1 }] }],
  ['CT10 / BUG-01', 'POST', '/api/carrinho/calcular', { itens: [{ produtoId: 'P005', quantidade: 2 }] }],
  ['CT10 / BUG-01', 'POST', '/api/carrinho/calcular', { itens: [{ produtoId: 'P008', quantidade: 4 }], cupom: 'BEMVINDO10' }],
  ['CT11', 'POST', '/api/carrinho/calcular', { itens: [{ produtoId: 'P007', quantidade: 1 }] }],
  ['CT12', 'POST', '/api/carrinho/calcular', { itens: [{ produtoId: 'P006', quantidade: 5 }, { produtoId: 'P001', quantidade: 1 }], cupom: 'BEMVINDO10' }],
  ['CT15 / BUG-02', 'POST', '/api/carrinho/calcular', { itens: [{ produtoId: 'P001', quantidade: 5 }] }],
  ['CT15 / BUG-02', 'POST', '/api/carrinho/calcular', { itens: [{ produtoId: 'P001', quantidade: 6 }] }],
  ['CT15 / BUG-02', 'POST', '/api/carrinho/calcular', { itens: [{ produtoId: 'P001', quantidade: 100 }] }],
  ['CT17', 'POST', '/api/carrinho/calcular', { itens: [{ produtoId: 'P001', quantidade: 0 }] }],
  ['CT17', 'POST', '/api/carrinho/calcular', { itens: [{ produtoId: 'P001', quantidade: 1.5 }] }],
  ['CT17', 'POST', '/api/carrinho/calcular', { itens: [{ produtoId: 'P001', quantidade: '2' }] }],
  ['CT26', 'POST', '/api/carrinho/calcular', { itens: [] }],
  ['CT26', 'POST', '/api/carrinho/calcular', { itens: ['P001'] }],
  ['CT26', 'POST', '/api/carrinho/calcular', { itens: [{ produtoId: 'P999', quantidade: 1 }] }],
  ['CT26', 'POST', '/api/carrinho/calcular', { itens: [{ produtoId: 'P001', quantidade: 1 }, { produtoId: 'P001', quantidade: 2 }] }],
  ['CT26', 'POST', '/api/carrinho/calcular', 'texto que não é JSON'],
  ['CT26', 'GET', '/api/carrinho/calcular'],
  ['CT26', 'GET', '/api/rota-que-nao-existe'],
  ['CT20', 'POST', '/api/pedidos', { cliente, itens: [{ produtoId: 'P005', quantidade: 1 }], cupom: 'BEMVINDO10' }],
  ['CT10 / BUG-01', 'POST', '/api/pedidos', { cliente, itens: [{ produtoId: 'P005', quantidade: 2 }] }],
  ['CT16 / BUG-02', 'POST', '/api/pedidos', { cliente, itens: [{ produtoId: 'P005', quantidade: 6 }] }],
  ['CT24', 'POST', '/api/pedidos', { cliente, itens: [{ produtoId: 'P005', quantidade: 1 }], cupom: 'XPTO' }],
  ['CT24', 'POST', '/api/pedidos', { cliente, itens: [{ produtoId: 'P005', quantidade: 1 }], cupom: 'VERAO2026' }],
  ['CT21', 'POST', '/api/pedidos', { cliente: { nome: '', email: '', cep: '' }, itens: [{ produtoId: 'P005', quantidade: 1 }] }],
  ['CT22', 'POST', '/api/pedidos', { cliente: { nome: 'Maria', email: 'maria@exemplo', cep: '0131010' }, itens: [{ produtoId: 'P005', quantidade: 1 }] }],
  ['CT23', 'POST', '/api/pedidos', { cliente: { ...cliente, cep: '01310100' }, itens: [{ produtoId: 'P005', quantidade: 1 }] }],
];
let md = `# Log de execução da API\n\nGerado em ${new Date().toISOString()} por \`npm run evidencias\`.\n\n`;
for (const [ct, method, path, body] of casos) {
  const res = await fetch(URL + path, {
    method,
    headers: { 'Content-Type': 'application/json' },
    body: body === undefined ? undefined : typeof body === 'string' ? body : JSON.stringify(body),
  });
  const text = await res.text();
  let pretty = text; try { pretty = JSON.stringify(JSON.parse(text), null, 2); } catch {}
  md += `## ${ct} — ${method} ${path} → HTTP ${res.status}\n\n`;
  if (body !== undefined) md += 'Requisição:\n\n```json\n' + (typeof body === 'string' ? body : JSON.stringify(body, null, 2)) + '\n```\n\n';
  md += 'Resposta:\n\n```json\n' + pretty + '\n```\n\n';
  console.log('  ok', ct, method, path, res.status);
}
writeFileSync('evidencias/api/log-api.md', md);
