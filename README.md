# Akustický Inovativní Simulátor 2.0

Tato verze kompletně předělává původní statický web a přináší několik nových
funkcí. Stále jde o čistě klientskou aplikaci, kterou lze snadno hostovat
například pomocí GitHub Pages.

## Novinky
- Jednotná domovská stránka `index.html` se sekcemi pro syntetizér, krokový
  sekvencer a jednoduchý soundboard s ukázkovými samply.
- Přepínání světlého a tmavého režimu a moderní vzhled.
- PWA podpora – přibyl `manifest.json` a `sw.js` pro základní offline funkce.
- Stávající mini hry (`game.html`, `action_game.html`) zůstávají dostupné z menu.

Aplikaci spustíte otevřením `index.html` v prohlížeči. Není potřeba žádný
backend ani instalace závislostí.

## Lokální vývoj
Pro pohodlné spuštění lokální instance je připraven balíček `http-server`.

1. Nainstalujte závislosti:
   ```bash
   npm install
   ```
2. Spusťte server:
   ```bash
   npm start
   ```
Aplikace bude dostupná na adrese <http://localhost:8080>.

Pro ověření konfigurace je k dispozici jednoduchý test:
```bash
npm test
```

## Nasazení na GitHub Pages

Úložiště obsahuje připravený workflow pro automatické nasazení na GitHub Pages.

1. V nastavení repozitáře na GitHubu otevřete **Settings → Pages**.
2. Jako zdroj zvolte **GitHub Actions** a uložte.
3. Při každém pushi na větev `main` proběhne workflow `.github/workflows/deploy.yml`,
   který web vygeneruje a publikuje.
4. Výsledná stránka bude dostupná na URL uvedené přímo v nastavení Pages.
