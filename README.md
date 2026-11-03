# Clima

Aplicação web para consultar o clima atual de qualquer cidade do mundo. Basta digitar o nome da cidade para ver temperatura, umidade, sensação térmica, probabilidade de precipitação, vento e a condição do tempo.

Os dados vêm da API pública [Open-Meteo](https://open-meteo.com/), que não exige chave de acesso.

🔗 **Demo:** https://augustofragg.github.io/climate-project/

## Funcionalidades

- Busca por nome da cidade (Enter ou botão "Buscar")
- Temperatura atual, cidade e país
- Data atual em português, no fuso horário da cidade
- Indicação de dia ou noite com ícone de sol/lua
- Condição do tempo em português (códigos WMO)
- Umidade relativa, sensação térmica e probabilidade de precipitação
- Vento com velocidade, direção em graus e ponto cardeal (ex.: `5.8 km/h · 277° (O)`)
- Estados de interface: vazio, carregando e resultado

## Tecnologias

- [TypeScript](https://www.typescriptlang.org/)
- [Vite](https://vite.dev/)
- HTML e CSS puros, sem frameworks
- [Open-Meteo](https://open-meteo.com/) — APIs de Geocoding e Forecast
- GitHub Actions + GitHub Pages para deploy

## Como rodar localmente

Pré-requisito: [Node.js](https://nodejs.org/) (o CI usa a versão 24).

```bash
# Instalar dependências
npm install

# Servidor de desenvolvimento
npm run dev

# Checagem de tipos + build de produção (gera a pasta dist/)
npm run build

# Pré-visualizar o build
npm run preview
```

## Estrutura do projeto

```
├── index.html               # Marcação da página
├── public/                  # Arquivos estáticos (favicon)
├── src/
│   ├── main.ts              # Estados da UI, eventos e renderização
│   ├── style.css            # Estilos
│   ├── assets/              # Ícones de sol e lua
│   ├── services/
│   │   └── openMeteo.ts     # Chamadas às APIs de geocoding e forecast
│   ├── types/
│   │   └── weather.ts       # Tipos das respostas da API e do domínio
│   └── utils/
│       ├── formatDate.ts    # Data em pt-BR no fuso da cidade
│       ├── weatherCode.ts   # Códigos WMO → descrição em português
│       └── windDirection.ts # Graus → ponto cardeal
├── docs/                    # PRD e planejamento das tarefas
└── .github/workflows/
    └── deploy.yml           # Deploy automático no GitHub Pages
```

## Como funciona

1. O usuário digita uma cidade; o texto passa por `trim` e buscas vazias são ignoradas.
2. A [Geocoding API](https://open-meteo.com/en/docs/geocoding-api) devolve nome, coordenadas, país e fuso horário da cidade.
3. Com as coordenadas, a [Forecast API](https://open-meteo.com/en/docs) devolve as condições atuais.
4. As respostas são validadas. Se a cidade não for encontrada ou o clima falhar, a interface volta ao estado vazio.

## Deploy

Cada push na branch `main` dispara o workflow [deploy.yml](.github/workflows/deploy.yml), que faz o build e publica a pasta `dist/` no GitHub Pages. O `base` em [vite.config.ts](vite.config.ts) está configurado como `/climate-project/` para corresponder ao caminho do site.

## Documentação

- [PRD](docs/prd.md) — requisitos do produto
- [Tarefas](docs/tasks.md) — planejamento da implementação
