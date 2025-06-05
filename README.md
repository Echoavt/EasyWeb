# Akustický Inovativní Simulátor

Tento repozitář obsahuje ukázkovou implementaci statické aplikace, která využívá GitHub Pages a GitHub REST API jako backend. Veškerý kód běží přímo ve webovém prohlížeči.

## Nastavení GitHub OAuth aplikace
1. V uživatelském nastavení GitHubu vytvořte **OAuth App**.
2. Jako *Authorization callback URL* nastavte `https://<vaše_uživatelské_jméno>.github.io/<repo>/callback.html`.
3. Získané `client_id` (a případně `client_secret`) vložte do souborů `index.html` a `callback.html` místo zástupných hodnot `YOUR_CLIENT_ID` a `YOUR_CLIENT_SECRET`.

## Konfigurace GitHub Pages
1. V nastavení repozitáře zapněte GitHub Pages a zvolte větev `gh-pages` s kořenem `/`.
2. GitHub Actions workflow `deploy.yml` zajišťuje automatické nasazení statických souborů při pushi do `main`.

## GitHub API
Aplikace používá tyto endpointy:
- `GET /repos/:owner/:repo/contents/<path>` pro načtení souborů.
- `PUT /repos/:owner/:repo/contents/<path>` pro vytvoření nebo úpravu souboru.
- `DELETE /repos/:owner/:repo/contents/<path>` pro odstranění souboru.

Data se ukládají do složky `data/` ve větvi `gh-pages`. Podsložky `presets/`, `projects/` a `shared/` drží příslušné JSON soubory.

## Spuštění lokálně
Stačí otevřít `index.html` v prohlížeči. Pro plnou funkčnost OAuth a zapisování dat je nutné nasadit aplikaci na GitHub Pages.
