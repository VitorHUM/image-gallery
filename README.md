## 📸 [Galeria de Imagens](https://vitorhum.github.io/image-gallery/)

[![Image Gallery Screenshot][app-screenshot]](https://i.imgur.com/dWOjZMo.png)

Galeria de imagens que permite ao usuário visualizar uma coleção de imagens, clicar para ver detalhes e adicionar novas imagens.
<br/>
Você pode acessar a aplicação e testar através do link: https://vitorhum.github.io/image-gallery/

## ⚒️ Stack

Vite + React = DX rápida, HMR estável, configuração simples e leve.
<br/>
TypeScript = Tipagem segura, escalabilidade e refatorações confiáveis.
<br/>
Zustand = Estado global minimalista e direto, com persistência fácil no localStorage.
<br/>
Tailwind CSS = Utilitários concisos, design consistente e fácil de manter.
<br/>
shadcn/ui = Componentes acessíveis, composáveis e sem lock-in de estilo.

- [![Vite][Vite]][Vite-url]
- [![React.js][React.js]][React-url]
- [![TypeScript][TypeScript]][TypeScript-url]
- [![Zustand][Zustand]][Zustand-url]
- [![Tailwindcss][Tailwindcss]][Tailwindcss-url]
- [![shadcn/ui][shadcn/ui]][shadcn/ui-url]

## ‼️ Pré-requisitos

- [![Node.js][Node.js]][Node-url]
- Gerenciador de pacotes como "[npm](https://www.npmjs.com/)".

## ⚙️ Instalação

1. Clonar o repositório
   ```sh
   git clone https://github.com/VitorHUM/image-gallery
   ```
2. Instalar os pacotes
   ```sh
   npm install
   ```
3. Configurar as variáveis de ambiente
   - Como nosso projeto utiliza a API Unsplash é necessário criar uma conta de desenvolvedor em https://unsplash.com/developers;
   - Após isso é necessário criar uma aplicação no site Unsplash para assim conseguir uma "_Access Key_";
   - Criar um arquivo chamado ".env.local" na raiz do projeto;
   - Adicionar a "_Access Key_" da aplicação Unsplash na seguinte variável:
   ```sh
   VITE_UNSPLASH_ACCESS_KEY=sua_access_key
   ```
4. Iniciar a aplicação

   ```sh
   npm run dev
   ```

   Pronto, se tudo deu certo sua aplicação já vai estar executando localmente.

## 🎯 Funcionalidades

<details>
  <summary><b>Imagens</b></summary>
  <ul>
    <li>Listagem de imagens provenientes da API pública do Unsplash.</li>
    <li>Visualização detalhada, com título, autor e data de criação.</li>
    <li>Adição de imagens personalizadas via URL.</li>
  </ul>
</details>

<details>
  <summary><b>Busca e paginação</b></summary>
  <ul>
    <li>Busca por termo.</li>
    <li>Navegação entre páginas de resultados, com carregamento incremental (“Carregar mais”).</li>
    <li>URL sincronizada: as buscas são refletidas na barra de endereço, permitindo compartilhar links diretos.</li>
  </ul>
</details>

<details>
  <summary><b>Validações e UX</b></summary>
  <ul>
    <li>Campos obrigatórios para adição de imagens (título/descrição sempre requerido).</li>
    <li>Mensagens de erro e feedback visual em ações de busca e adição.</li>
    <li>Limpeza automática de campos após salvar uma imagem.</li>
  </ul>
</details>

<details>
  <summary><b>Interface e design</b></summary>
  <ul>
    <li>Componentes consistentes e acessíveis (modais, inputs, botões).</li>
    <li>Layout responsivo, adaptado para desktop e mobile.</li>
    <li>Microinterações e ícones para navegação mais intuitiva.</li>
    <li>Semântica ARIA aplicada a inputs, labels e botões.</li>
  </ul>
</details>

<details>
  <summary><b>Estado e performance</b></summary>
  <ul>
    <li>Gerenciamento de estado global.</li>
    <li>Seletores eficientes para evitar re-renderizações desnecessárias.</li>
    <li>Sincronização de busca e resultados.</li>
  </ul>
</details>

<details>
  <summary><b>Integrações e dados</b></summary>
  <ul>
    <li>Integração com a API do Unsplash para carregamento inicial de imagens.</li>
    <li>Possibilidade de complementar a galeria com imagens adicionadas pelo usuário via URL.</li>
    <li>As imagens personalizadas ficam salvas em memória local da aplicação (não persistem em backend).</li>
  </ul>
</details>

## 👀 Utilização

- Buscar imagens: digite no campo de busca e clique em “Buscar” ou pressione Enter. Use o botão “X” para limpar o campo.

- Navegar entre resultados: use o botão “Carregar mais” para trazer mais imagens.

- Visualizar detalhes: clique em uma imagem para abrir o a página de detalhes, com título, autor e data de criação.

- Adicionar imagem: clique em “+ Adicionar Foto”, insira a URL da imagem, título/descrição (obrigatório) e autor (opcional), e clique em Salvar.

- Onde os dados ficam salvos?
  <br/>
  As imagens da API vêm diretamente do Unsplash. As imagens adicionadas manualmente são mantidas apenas na memória da aplicação.

## 🧭 Roadmap

- [ ] Adicionar Dark Mode
- [ ] Adicionar imagens localmente
- [ ] Adicionar botão para baixar imagens
- [ ] Criar coleção de imagens
- [ ] Implementar login e autenticação
- [ ] Internacionalização

[app-screenshot]: https://i.imgur.com/dWOjZMo.png
[Vite]: https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=Vite&logoColor=white
[Vite-url]: https://vite.dev/
[React.js]: https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB
[React-url]: https://reactjs.org/
[TypeScript]: https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white
[TypeScript-url]: https://www.typescriptlang.org/
[Zustand]: https://img.shields.io/badge/zustand-602c3c?style=for-the-badge&logo=data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAA4AAAAOCAMAAAAolt3jAAAA8FBMVEVHcExXQzpKQDlFV16lpqyGh4tPPTdWT0weHRU7LRZGQzmxYjlaTkZsbmywVyxtXDSFhISXm6WWpcaytb6bm56gprY0LiiXmp2prLamsMa0XS42MSxkTUVDSkuyYzGihXdDV2GprbmedVxaRD1kTUWUdGFGOCN4a2OfpbI0SFFAMSddTkbCc0dWQiGFRypXQyJUQCBcTTWviDVXQyJcUDjlqCWxjkG+hBTiohtURD6lr8lORTtDVVZmPyxwSipaRSJDOzaWpsyYqMyYqM2dq8tPOjBERTs6QUKTcCeKaCJvViZdSDK4iSngoiDvqx7KkRuGEi1hAAAAOXRSTlMApZ78cB8hCAMQO/j/FOH4KlT1wFfJTjaY6SxtVexFn3Tn2sN6d671mVuJ+/PPN9CT6TfpS4C9jJaVLRihAAAAi0lEQVQIHXXBxRKCUAAF0Es/QMDubsVuGrv1///GBQ4bx3PwgwC8gFCRohs8QrQV0ZtKOZ9JcgBmU8MwqFa9kjNTUWB58f2jPOjU9juTBTbPq+vIar972MZjwPr1uDvqCFw2wQpQVm/t7Oo9gAgAFtrtZNtMFQFp7nkWU5IQECfjYbuQFvBFRJHgjw9L0A80UmaGpAAAAABJRU5ErkJggg==
[Zustand-url]: https://zustand-demo.pmnd.rs/
[Tailwindcss]: https://img.shields.io/badge/Tailwind_CSS-grey?style=for-the-badge&logo=tailwind-css&logoColor=38B2AC
[Tailwindcss-url]: https://tailwindcss.com/
[shadcn/ui]: https://img.shields.io/badge/shadcn%2Fui-000?logo=shadcnui&logoColor=fff&style=for-the-badge
[shadcn/ui-url]: https://ui.shadcn.com/
[Node.js]: https://img.shields.io/badge/node.js-339933?style=for-the-badge&logo=Node.js&logoColor=white
[Node-url]: https://nodejs.org/
