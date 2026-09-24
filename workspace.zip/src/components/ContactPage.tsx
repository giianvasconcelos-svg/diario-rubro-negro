export default function ContactPage() {
  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      <header className="bg-gradient-to-r from-red-800 via-red-700 to-black text-white shadow-lg">
        <div className="max-w-5xl mx-auto px-4 py-6 flex items-center justify-between gap-4">
          <a href="/" className="flex items-center gap-3 no-underline text-white">
            <div className="w-12 h-12 rounded-full bg-white text-red-700 font-black flex items-center justify-center">DR</div>
            <div>
              <div className="text-xl md:text-2xl font-black">DIÁRIO RUBRO-NEGRO</div>
              <div className="text-red-100 text-sm">Contato e informações</div>
            </div>
          </a>
          <a href="/" className="bg-white/10 hover:bg-white/20 border border-white/20 rounded-full px-4 py-2 text-sm font-bold text-white no-underline">
            ← Voltar ao início
          </a>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 py-10 space-y-8">
        <section className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8">
          <span className="inline-block bg-red-100 text-red-700 text-xs font-black uppercase tracking-wide px-3 py-1 rounded-full mb-4">Contato</span>
          <h1 className="text-3xl md:text-4xl font-black mb-3">Fale com o Diário Rubro-Negro</h1>
          <p className="text-gray-600 leading-relaxed max-w-3xl">
            Este espaço reúne os canais institucionais do portal para contato editorial, parcerias e publicidade. O e-mail oficial está em criação e será publicado aqui assim que estiver disponível.
          </p>
          <div className="mt-5 bg-gray-50 border border-gray-200 rounded-xl p-4">
            <div className="text-xs font-bold text-gray-500 uppercase tracking-wide">E-mail de contato</div>
            <div className="text-lg font-bold text-gray-800 mt-1">Em breve</div>
          </div>
        </section>

        <section id="anuncie" className="bg-gradient-to-br from-red-800 to-black text-white rounded-2xl shadow-lg p-6 md:p-8">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center text-xl flex-shrink-0">
              <i className="fas fa-bullhorn"></i>
            </div>
            <div>
              <h2 className="text-2xl font-black mb-2">Anuncie aqui</h2>
              <p className="text-red-100 leading-relaxed">
                O Diário Rubro-Negro está aberto a propostas comerciais, mídia display, conteúdo patrocinado identificado, ações especiais e parcerias com marcas ligadas a esporte, entretenimento e à torcida rubro-negra.
              </p>
              <p className="text-red-100 leading-relaxed mt-3">
                Quando o e-mail comercial estiver disponível, ele aparecerá nesta página. Conteúdo publicitário será identificado de forma clara e separado do conteúdo editorial.
              </p>
            </div>
          </div>
        </section>

        <section id="informacoes" className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8">
          <h2 className="text-2xl font-black mb-5">Informações</h2>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="border border-gray-200 rounded-xl p-4">
              <h3 className="font-black text-gray-800 mb-2">Redação</h3>
              <p className="text-sm text-gray-600 leading-relaxed">As matérias do portal são publicadas sob a assinatura editorial <strong>Redação DRN</strong>.</p>
              <a href="/redacao" className="inline-block mt-3 text-sm font-bold text-red-700 hover:underline">Conheça a política editorial →</a>
            </div>
            <div className="border border-gray-200 rounded-xl p-4">
              <h3 className="font-black text-gray-800 mb-2">Correções</h3>
              <p className="text-sm text-gray-600 leading-relaxed">Pedidos de correção, direitos de resposta e observações sobre matérias poderão ser enviados pelo e-mail oficial assim que ele for disponibilizado.</p>
            </div>
            <div className="border border-gray-200 rounded-xl p-4">
              <h3 className="font-black text-gray-800 mb-2">Fontes e apuração</h3>
              <p className="text-sm text-gray-600 leading-relaxed">Informações externas podem ser usadas como ponto de partida para apuração e reescrita editorial. Links de origem são preservados internamente para conferência.</p>
            </div>
            <div className="border border-gray-200 rounded-xl p-4">
              <h3 className="font-black text-gray-800 mb-2">Privacidade e transparência</h3>
              <p className="text-sm text-gray-600 leading-relaxed">O portal busca separar conteúdo editorial, opinião de usuários e publicidade, mantendo identificação clara de cada área.</p>
            </div>
          </div>
        </section>
      </main>

      <footer className="bg-black text-gray-400 mt-10">
        <div className="max-w-5xl mx-auto px-4 py-6 text-sm flex flex-col md:flex-row gap-3 justify-between">
          <span>© {new Date().getFullYear()} Diário Rubro-Negro</span>
          <div className="flex gap-4">
            <a href="/redacao" className="text-gray-300 hover:text-white">Redação</a>
            <a href="/news-sitemap.xml" className="text-gray-300 hover:text-white">Sitemap de notícias</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
