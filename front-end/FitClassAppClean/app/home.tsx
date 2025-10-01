import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView } from 'react-native';
import { Stack, router } from 'expo-router';
import StyledButton from '@/src/components/StyledButton'; // Importando seu botão customizado

const HomeScreen = () => {

  const handleLogout = () => {
    // 'replace' remove a tela de home do histórico, impedindo o usuário de "voltar" para ela após o logout
    router.replace('/');
  };

  return (
    // SafeAreaView garante que o conteúdo não fique embaixo da barra de status ou notch do celular
    <SafeAreaView style={styles.safeArea}>
      <Stack.Screen
        options={{
          headerShown: true, // Mostra o cabeçalho
          title: 'Início',
          headerStyle: { backgroundColor: '#2B2727' },
          headerTintColor: '#FFF',
          headerTitleAlign: 'center',
          headerShadowVisible: false, // Remove a sombra do header no iOS
          headerLeft: () => null, // Remove o botão de voltar
        }}
      />
      
      {/* ScrollView permite que a tela role se o conteúdo for maior que o display */}
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.welcomeText}>Bem-vindo(a) de volta!</Text>

        {/* Seção de Próximas Aulas (Dados Falsos) */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Suas Próximas Aulas</Text>
          <View style={styles.classCard}>
            <Text style={styles.cardTitle}>CrossFit</Text>
            <Text style={styles.cardSubtitle}>Hoje, às 18:00 com Instrutor Carlos</Text>
            <Text style={styles.cardStatus}>Status: Confirmado</Text>
          </View>
          <View style={styles.classCard}>
            <Text style={styles.cardTitle}>Yoga</Text>
            <Text style={styles.cardSubtitle}>Amanhã, às 09:00 com Instrutora Ana</Text>
            <Text style={styles.cardStatus}>Status: Confirmado</Text>
          </View>
        </View>

        {/* Seção de Avisos */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Avisos Importantes</Text>
          <Text style={styles.noticeText}>- O aulão de Sábado foi transferido para as 10:00.</Text>
          <Text style={styles.noticeText}>- Lembre-se de trazer sua garrafa de água!</Text>
        </View>

        {/* Botão de Logout */}
        <StyledButton 
          variant="secondary" 
          onPress={handleLogout} 
          style={styles.logoutButton}
        >
          Sair (Logout)
        </StyledButton>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#2B2727', // Mesma cor de fundo das outras telas
  },
  container: {
    padding: 20,
  },
  welcomeText: {
    fontSize: 28,
    fontWeight: '300',
    color: '#FFF',
    textAlign: 'center',
    marginBottom: 30,
  },
  section: {
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#FFF',
    marginBottom: 15,
  },
  classCard: {
    backgroundColor: '#4A4A4A', // Cor de fundo similar aos seus Inputs
    borderRadius: 8,
    padding: 15,
    marginBottom: 10,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFF',
  },
  cardSubtitle: {
    fontSize: 14,
    color: '#DDD',
    marginTop: 5,
  },
  cardStatus: {
    fontSize: 14,
    color: '#A3E635', // Um verde para dar destaque
    fontWeight: 'bold',
    marginTop: 10,
  },
  noticeText: {
    fontSize: 16,
    color: '#DDD',
    marginBottom: 8,
  },
  logoutButton: {
    marginTop: 20, // Espaço acima do botão
    backgroundColor: '#A33E3E' // Um vermelho para indicar ação de saída
  }
});

export default HomeScreen;