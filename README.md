# Currículo Interativo 2006 — Engenharia Mecânica/UFSC

Aplicação web independente para estudantes acompanharem e planejarem a matriz
curricular 2006.1 de Engenharia Mecânica da UFSC.

A base foi transcrita do relatório curricular emitido pela SeTIC/PROGRAD em
22/08/2026. O CAGR continua sendo a referência oficial para matrícula,
equivalências e integralização.

## Funcionalidades

- disciplinas organizadas por fase e área;
- progresso automático em horas-aula (H/A);
- registro da carga cumprida em optativas;
- pré-requisitos, equivalências e caminhos alternativos;
- regra de `EMC5443` conforme o semestre de ingresso;
- dados salvos somente no navegador, sem conta ou banco de dados.

## Desenvolvimento local

Requer Node.js 22 ou superior.

```bash
npm ci
npm run dev
```

Para verificar a versão de produção:

```bash
npm run build
npm run preview
```

## GitHub Pages

O fluxo em `.github/workflows/deploy-pages.yml` gera e publica o site a cada
alteração enviada à branch `main`.

No repositório do GitHub, abra **Settings → Pages** e selecione
**GitHub Actions** como fonte de publicação. Depois disso, cada novo `push`
atualizará o site automaticamente.

## Aviso

Projeto estudantil e não oficial, desenvolvido para apoio ao planejamento
acadêmico. Antes de tomar decisões de matrícula, confirme os dados no CAGR e
com a coordenação do curso.
