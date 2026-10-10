# language: pt
Funcionalidade: Frete grátis
  Como cliente da Verzel Store
  Quero ganhar frete grátis em compras a partir de R$ 200,00
  Para pagar menos nas minhas compras

  Regra: frete = R$ 0,00 se subtotal >= R$ 200,00; senão R$ 19,90.
         faltante = R$ 200,00 - subtotal, nunca menor que zero.

  @CA09 @CT08
  Cenário: CT08 - Desconto do cupom não incide sobre o frete
    Dado que tenho no carrinho 1 "Mochila Urbana 20L" de R$ 100,00
    Quando aplico o cupom "BEMVINDO10"
    Então o desconto é de R$ 10,00
    E o frete é de R$ 19,90
    E o total é R$ 109,90

  @CA07 @CT09 @automatizado
  Cenário: CT09 - Subtotal logo abaixo do limite (R$ 199,80)
    Dado que tenho no carrinho 1 "Calça Jeans Slim" e 1 "Camiseta Essencial"
    Então o subtotal é R$ 199,80
    E o frete é de R$ 19,90
    E vejo "Faltam R$ 0,20 para o frete grátis."

  @CA06 @CT10 @automatizado @bug @BUG-01
  Cenário: CT10 - Subtotal exatamente no limite (R$ 200,00)
    Dado que tenho no carrinho 4 "Garrafa Térmica 750ml" de R$ 50,00
    Então o subtotal é R$ 200,00
    E o frete é "Grátis"
    E o total é R$ 200,00
    E não vejo a mensagem de quanto falta para o frete grátis

  @CA06 @CT11
  Cenário: CT11 - Subtotal acima do limite
    Dado que tenho no carrinho 1 "Jaqueta Corta-Vento" de R$ 229,90
    Então o frete é "Grátis"
    E o total é R$ 229,90

  @CA08 @CT12 @automatizado
  Cenário: CT12 - Frete grátis considera o subtotal antes do desconto
    Dado que tenho no carrinho 5 "Kit 3 Pares de Meias" e 1 "Camiseta Essencial"
    Quando aplico o cupom "BEMVINDO10"
    Então o subtotal é R$ 209,40
    E o desconto é de R$ 20,94
    E o frete é "Grátis"
    E o total é R$ 188,46

  @CT13
  Cenário: CT13 - Alterar a quantidade recalcula frete e faltante
    Dado que tenho no carrinho 1 "Calça Jeans Slim" com o cupom "BEMVINDO10"
    Quando aumento a quantidade para 2
    Então o frete passa a ser "Grátis" e o desconto R$ 27,98
    Quando diminuo a quantidade para 1
    Então o frete volta a R$ 19,90 e vejo "Faltam R$ 60,10 para o frete grátis."

  @CA11 @CT18
  Cenário: CT18 - Arredondamento em 2 casas decimais
    Dado combinações aleatórias de produtos, quantidades (1 a 5) e cupom
    Quando calculo o carrinho pela API
    Então subtotal, desconto, frete, faltante e total batem com a fórmula documentada
    E todos os valores têm no máximo 2 casas decimais
