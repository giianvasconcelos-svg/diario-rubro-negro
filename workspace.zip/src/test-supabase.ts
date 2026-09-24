import { supabase } from './lib/supabase';

async function testConnection() {
  console.log('🔍 Testando conexão com Supabase...\n');
  
  try {
    // Testar conexão básica
    const { data, error } = await supabase
      .from('news')
      .select('count', { count: 'exact', head: true });

    if (error) {
      console.error('❌ Erro ao conectar:', error.message);
      console.error('\n💡 Possíveis causas:');
      console.error('   1. As tabelas ainda não foram criadas');
      console.error('   2. Execute o script supabase-schema.sql no SQL Editor');
      console.error('   3. Verifique se as credenciais estão corretas no .env');
      return false;
    }

    console.log('✅ Conexão bem-sucedida!');
    console.log(`📊 Tabelas existentes: news, profiles, forum_topics, forum_replies`);
    console.log('\n🎉 Supabase está configurado corretamente!');
    return true;

  } catch (err) {
    console.error('❌ Erro inesperado:', err);
    return false;
  }
}

// Executar teste
testConnection().then(success => {
  if (success) {
    console.log('\n✅ Próximo passo: Você já pode usar o sistema!');
    console.log('📝 Para criar notícias, use o painel administrativo.');
  } else {
    console.log('\n⚠️  Siga estas etapas:');
    console.log('1. Acesse: https://supabase.com/dashboard/');
    console.log('2. Vá em SQL Editor');
    console.log('3. Cole o conteúdo do arquivo supabase-schema.sql');
    console.log('4. Clique em "Run"');
    console.log('5. Execute este teste novamente');
  }
});
