type PageKey = 'sobre' | 'privacidade' | 'cookies' | 'termos';

const updatedAt = '24 de setembro de 2026';

function Header({ subtitle }: { subtitle: string }) {
  return (
    <header className="bg-gradient-to-r from-red-800 via-red-700 to-black text-white shadow-lg">
      <div className="max-w-4xl mx-auto px-4 py-6 flex items-center justify-between gap-4">
        <a href="/" className="text-white no-underline">
          <div className="text-xl md:text-2xl font-black">DIÁRIO RUBRO-NEGRO</div>
          <div className="text-red-100 text-sm">{subtitle}</div>
        </a>
        <a href="/" className="bg-white/10 hover:bg-white/20 border border-white/20 rounded-full px-4 py-2 text-sm font-bold text-white no-underline">← Início</a>
      </div>
    </header>
  );
}

function Footer() {
  return (
    <footer className="bg-black text-gray-400 mt-10">
      <div className="max-w-4xl mx-auto px-4 py-7 text-sm">
        <div className="flex flex-wrap gap-x-5 gap-y-2 mb-3">
          <a href="/sobre" className="text-gray-300 hover:text-white">Sobre</a>
          <a href="/contato" className="text-gray-300 hover:text-white">Contato</a>
          <a href="/redacao" className="text-gray-300 hover:text-white">Redação</a>
          <a href="/privacidade" className="text-gray-300 hover:text-white">Privacidade</a>
          <a href="/cookies" className="text-gray-300 hover:text-white">Cookies</a>
          <a href="/termos" className="text-gray-300 hover:text-white">Termos de Uso</a>
        </div>
        <div>© {new Date().getFullYear()} Diário Rubro-Negro · Portal independente e não oficial.</div>
      </div>
    </footer>
  );
}

function Layout({ title, subtitle, children }: { title: string; subtitle: string; children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      <Header subtitle={subtitle} />
      <main className="max-w-4xl mx-auto px-4 py-10">
        <article className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 md:p-9">
          <h1 className="text-3xl md:text-4xl font-black mb-2">{title}</h1>
          <p className="text-sm text-gray-500 mb-8">Última atualização: {updatedAt}</p>
          <div className="space-y-7 text-gray-700 leading-relaxed">{children}</div>
        </article>
      </main>
      <Footer />
    </div>
  );
}

const H2 = ({ children }: { children: React.ReactNode }) => <h2 className="text-xl font-black text-gray-900 mb-2">{children}</h2>;

function AboutPage() {
  return (
    <Layout title="Sobre o Diário Rubro-Negro" subtitle="Quem somos">
      <section><H2>O portal</H2><p>O Diário Rubro-Negro é um portal independente dedicado à cobertura jornalística e editorial do Clube de Regatas do Flamengo, com foco em notícias, jogos, mercado, bastidores, análises e assuntos de interesse da torcida.</p></section>
      <section><H2>Independência</H2><p>O Diário Rubro-Negro não é site oficial do Clube de Regatas do Flamengo e não representa o clube, seus atletas, dirigentes, patrocinadores ou entidades esportivas. Nomes, marcas e escudos pertencem aos respectivos titulares.</p></section>
      <section><H2>Produção editorial</H2><p>As matérias publicadas pelo portal são assinadas por Redação DRN. Informações externas podem servir como ponto de partida para apuração, mas materiais importados entram como rascunho e devem passar por revisão humana e receber contribuição editorial própria antes da publicação.</p></section>
      <section><H2>Publicidade e transparência</H2><p>O portal pode exibir publicidade e conteúdos patrocinados. Materiais comerciais serão identificados e mantidos separados das decisões editoriais. Consulte também nossa <a className="font-bold text-red-700 hover:underline" href="/privacidade">Política de Privacidade</a> e a página de <a className="font-bold text-red-700 hover:underline" href="/contato#anuncie">publicidade</a>.</p></section>
    </Layout>
  );
}

function PrivacyPage() {
  return (
    <Layout title="Política de Privacidade" subtitle="Privacidade e proteção de dados">
      <section><H2>1. Dados tratados</H2><p>O portal pode receber informações técnicas como endereço IP, tipo de dispositivo, navegador, páginas visitadas, data e horário de acesso, além de dados fornecidos voluntariamente em recursos de conta, fórum ou contato. Dados de autenticação são tratados pelos serviços utilizados pelo portal, como o Supabase.</p></section>
      <section><H2>2. Finalidades</H2><p>Esses dados podem ser usados para operar e proteger o site, manter sessões de usuário, prevenir abuso, medir desempenho, entender a utilização do portal, melhorar conteúdo e funcionalidades e, quando habilitado, viabilizar publicidade.</p></section>
      <section><H2>3. Google AdSense e publicidade</H2><p>O portal poderá utilizar o Google AdSense e outros parceiros de publicidade. Quando os anúncios do Google estiverem habilitados, terceiros, incluindo o Google, poderão usar cookies para veicular anúncios com base em visitas anteriores a este ou a outros sites. O uso de cookies de publicidade permite ao Google e a seus parceiros oferecer anúncios personalizados quando permitido.</p><p className="mt-2">O usuário pode gerenciar a personalização de anúncios nas <a className="font-bold text-red-700 hover:underline" href="https://adssettings.google.com/" target="_blank" rel="noreferrer">Configurações de anúncios do Google</a>. Dependendo da localização do visitante, mecanismos adicionais de consentimento poderão ser exibidos antes do uso de tecnologias de publicidade.</p></section>
      <section><H2>4. Cookies e armazenamento local</H2><p>O portal usa ou pode usar cookies e tecnologias semelhantes, incluindo armazenamento local do navegador, para manter preferências, autenticação, configurações do painel e funcionamento do site. Mais detalhes estão na <a className="font-bold text-red-700 hover:underline" href="/cookies">Política de Cookies</a>.</p></section>
      <section><H2>5. Compartilhamento</H2><p>Dados podem ser processados por fornecedores indispensáveis à operação do portal, como hospedagem, banco de dados, autenticação, segurança, análise e publicidade. Não vendemos dados pessoais. O tratamento segue as finalidades descritas nesta política e as obrigações legais aplicáveis.</p></section>
      <section><H2>6. Direitos do titular</H2><p>Visitantes podem solicitar informações, correção ou exclusão de dados pessoais quando aplicável. O canal oficial de contato será publicado na página <a className="font-bold text-red-700 hover:underline" href="/contato">Contato</a> assim que o e-mail institucional estiver disponível.</p></section>
      <section><H2>7. Alterações</H2><p>Esta política poderá ser atualizada quando houver mudanças nos serviços, fornecedores, legislação ou práticas do portal. A data da versão vigente será mantida no topo desta página.</p></section>
    </Layout>
  );
}

function CookiesPage() {
  return (
    <Layout title="Política de Cookies" subtitle="Cookies e tecnologias semelhantes">
      <section><H2>O que são cookies</H2><p>Cookies são pequenos arquivos gravados no navegador para reconhecer uma sessão, manter preferências e permitir recursos técnicos, de medição ou de publicidade.</p></section>
      <section><H2>Cookies essenciais</H2><p>Podem ser usados para autenticação, segurança, sessão e preferências necessárias ao funcionamento do portal. Algumas configurações também podem ser guardadas no armazenamento local do navegador.</p></section>
      <section><H2>Medição e desempenho</H2><p>Se ferramentas de análise forem ativadas, elas poderão medir acessos e interações para ajudar a compreender o uso do site e melhorar conteúdo e desempenho.</p></section>
      <section><H2>Publicidade</H2><p>Quando o Google AdSense ou outro serviço de publicidade estiver habilitado, cookies e identificadores poderão ser usados para veicular, limitar, medir e personalizar anúncios, conforme a legislação e as escolhas de consentimento aplicáveis.</p></section>
      <section><H2>Consentimento regional</H2><p>Para visitantes de regiões em que o consentimento é exigido, inclusive Espaço Econômico Europeu, Reino Unido e Suíça, o portal utilizará uma solução de gestão de consentimento compatível com os requisitos do Google antes de ativar publicidade personalizada.</p></section>
      <section><H2>Como controlar</H2><p>O usuário pode apagar ou bloquear cookies nas configurações do navegador. Algumas funções essenciais podem deixar de operar corretamente. Preferências de publicidade do Google podem ser gerenciadas em <a className="font-bold text-red-700 hover:underline" href="https://adssettings.google.com/" target="_blank" rel="noreferrer">adssettings.google.com</a>.</p></section>
    </Layout>
  );
}

function TermsPage() {
  return (
    <Layout title="Termos de Uso" subtitle="Regras de utilização do portal">
      <section><H2>1. Natureza do conteúdo</H2><p>O Diário Rubro-Negro é um portal independente e não oficial. O conteúdo tem finalidade informativa e editorial. Informações esportivas podem mudar rapidamente e, apesar do esforço de revisão, erros podem ocorrer e serão corrigidos quando identificados.</p></section>
      <section><H2>2. Propriedade intelectual</H2><p>Textos editoriais produzidos pelo portal são protegidos pela legislação aplicável. Marcas, nomes, imagens e materiais de terceiros permanecem pertencentes aos respectivos titulares e devem ser utilizados de acordo com autorizações, licenças ou hipóteses legais aplicáveis.</p></section>
      <section><H2>3. Conteúdo de usuários</H2><p>Em áreas de fórum ou comentários, o usuário é responsável pelo que publica. Não são permitidos conteúdo ilegal, ameaças, assédio, discriminação, spam, violações de direitos autorais ou outras condutas incompatíveis com a legislação e com a segurança da comunidade.</p></section>
      <section><H2>4. Publicidade</H2><p>O portal pode exibir anúncios e conteúdo patrocinado. Anúncios de terceiros não representam endosso editorial. Conteúdo comercial produzido para parceiros será identificado de forma clara.</p></section>
      <section><H2>5. Links externos</H2><p>O site pode conter links para páginas de terceiros. Esses sites têm políticas e práticas próprias, e o Diário Rubro-Negro não controla seu conteúdo, disponibilidade ou tratamento de dados.</p></section>
      <section><H2>6. Alterações</H2><p>Estes termos podem ser atualizados para refletir mudanças no portal ou em requisitos legais. A versão vigente é identificada pela data indicada no topo.</p></section>
    </Layout>
  );
}

export default function InstitutionalPage({ page }: { page: PageKey }) {
  if (page === 'sobre') return <AboutPage />;
  if (page === 'privacidade') return <PrivacyPage />;
  if (page === 'cookies') return <CookiesPage />;
  return <TermsPage />;
}
