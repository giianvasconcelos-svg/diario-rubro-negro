export default function handler(request, response) {
  const html = `<!doctype html>
<html lang="pt-BR">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width,initial-scale=1" />
  <title>Redação DRN | Diário Rubro-Negro</title>
  <meta name="description" content="Conheça a Redação DRN, assinatura editorial do Diário Rubro-Negro." />
  <meta name="robots" content="index,follow" />
  <style>
    :root{font-family:Inter,system-ui,-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif;color:#171717;background:#f5f5f5}body{margin:0}.wrap{max-width:820px;margin:0 auto;padding:24px}header{background:#991b1b;color:#fff}header a{color:#fff;text-decoration:none;font-weight:800}.card{background:#fff;margin-top:28px;padding:28px;border-radius:14px;box-shadow:0 8px 30px rgba(0,0,0,.08)}h1{margin-top:0}h2{margin-top:28px}p,li{line-height:1.7}.note{background:#fef2f2;border-left:4px solid #b91c1c;padding:14px;border-radius:8px}.links{display:flex;flex-wrap:wrap;gap:12px;margin-top:26px}.links a{color:#991b1b;font-weight:700}</style>
</head>
<body>
<header><div class="wrap"><a href="/">DIÁRIO RUBRO-NEGRO</a></div></header>
<main class="wrap">
  <section class="card">
    <h1>Redação DRN</h1>
    <p><strong>Redação DRN</strong> é a assinatura coletiva usada nas matérias produzidas e revisadas pelo Diário Rubro-Negro.</p>
    <h2>Como trabalhamos</h2>
    <p>Fontes externas podem servir como ponto de partida para apuração, mas o portal não trata simples cópia, troca de sinônimos ou reformulação automática como matéria pronta. Conteúdos importados entram como rascunho e precisam de revisão humana antes de serem aprovados.</p>
    <ul>
      <li>conferência de fatos e contexto;</li>
      <li>edição humana antes da publicação;</li>
      <li>acréscimo de contexto, explicação ou análise útil da Redação DRN;</li>
      <li>separação entre conteúdo editorial e publicidade;</li>
      <li>correção de erros quando identificados.</li>
    </ul>
    <p>A redação assume responsabilidade editorial pelo texto final publicado no site.</p>
    <div class="note">O Diário Rubro-Negro é um portal independente e não possui vínculo oficial com o Clube de Regatas do Flamengo.</div>
    <div class="links">
      <a href="/sobre">Sobre</a>
      <a href="/contato">Contato</a>
      <a href="/privacidade">Privacidade</a>
      <a href="/cookies">Cookies</a>
      <a href="/termos">Termos de Uso</a>
    </div>
  </section>
</main>
</body>
</html>`;
  response.setHeader('Content-Type', 'text/html; charset=utf-8');
  response.setHeader('Cache-Control', 's-maxage=3600, stale-while-revalidate=86400');
  return response.status(200).send(html);
}
