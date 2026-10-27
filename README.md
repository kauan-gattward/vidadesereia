# Vida de Sereia Itacaré · site de vendas (pt-BR)

Site estático (HTML/CSS/JS puro), pronto para GitHub Pages (`.nojekyll`). Abra `index.html` ou publique a pasta.
URL prevista: https://kauan-gattward.github.io/vidadesereia/

## Identidade visual
- **Conceito:** “Mais que bronze, um estilo de vida” (bio oficial). Pôr do sol de Itacaré encontrando o mar.
- **Paleta:** Coral Pôr do Sol `#FF6B4A` · Urucum `#B5461B` (tom do logo real) · Areia `#F7EAD6` · Dourado `#F2B544` · Mar Teal `#0B6E6C` · Abismo `#06262A` · Tinta `#1D120D`.
- **Tipografia (Google Fonts):** *Fraunces* (display, itálico solar) + *Outfit* (texto).
- **Marca:** `logo-wordmark.svg` / `favicon.svg`: a bolacha-do-mar do logo oficial + onda e cauda de sereia, com o nome em Fraunces itálico.
- **Linguagem de movimento (tendências Awwwards 2025-26):** tipografia cinética, storytelling com scroll (seções em 3D com rotateX/scale), galeria horizontal fixa (sticky), marquee, cards com tilt 3D, glassmorphism, grão, botões magnéticos, cursor customizado e um oceano em WebGL com brilho de sol (shader próprio, sem dependências).

## Funcionalidades
Loader, hero WebGL com fallback em gradiente, scroll-reveal, tilt 3D, transições 3D, marquee, botões magnéticos, cursor (só desktop), galeria horizontal + lightbox (focus trap, Esc, setas, swipe, o botão voltar fecha), menu acessível, toast. CSP em meta, `rel="noopener noreferrer"`, só `textContent`, `prefers-reduced-motion`, fallback sem JS, animações pausadas fora da tela ou com a aba oculta, DPR limitado a 2, trava de scroll no iOS, SEO/OG/JSON-LD.

## Pedidos / WhatsApp
Nenhum WhatsApp público foi encontrado. A bio diz “📩 Pedidos no direct”, então os botões abrem `https://ig.me/m/vidadesereiaitacare` e copiam uma mensagem pronta com o nome do produto.
**Para ativar o WhatsApp:** em `js/main.js`, preencha `var WHATSAPP = '55DDDNUMERO';`. Os botões passam a abrir `wa.me` com a mensagem pré-preenchida (“Comprar no WhatsApp”).

## Fontes dos dados
- Bio, nome e logo: perfil TikTok oficial @vidadesereiaitacare (mesmo @ do Instagram). O Instagram bloqueou o acesso sem login (rate limit).
- Instagram (og tags): 1.311 seguidores, 48 posts.
- Preço R$ 25 do bronzeador e benefícios (óleos naturais e urucum, hidrata, pele dourada, fácil de aplicar): post “Combo perfeito pro feriado” da marca.
- “Marquinha de fita”: hashtag #maquinhadefita usada pela marca. Preço não divulgado (“Consulte”).
- Fotos: capas dos posts oficiais da marca (autorizadas pela dona).

## Imagens
`img/pN.webp` (largura original, até 1600 px) e `img/pN-640.webp` (thumb), qualidade ~80, com width/height e lazy loading.
