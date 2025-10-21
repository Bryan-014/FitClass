import StyledButton from '@/src/components/StyledButton';
import { Stack, router } from 'expo-router';
import React from 'react';
import { SafeAreaView, ScrollView, StyleSheet, Text } from 'react-native';

const AdminDashboardScreen = () => {
  return (
    <SafeAreaView style={styles.safeArea}>
      <Stack.Screen options={{ title: 'Painel do Administrador' }} />
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>Gerenciamento do Sistema</Text>
        <Text style={styles.subtitle}>
          Selecione uma das opções abaixo para gerenciar os dados do FitClass.
        </Text>

        <StyledButton
          style={styles.menuButton}
          onPress={() => router.push('/aulas')}
        >
          Gerenciar Aulas
        </StyledButton>

        <StyledButton
          style={styles.menuButton}
          onPress={() => router.push('/instrutores')} 
        >
          Gerenciar Instrutores
        </StyledButton>
        
        <StyledButton
          style={styles.menuButton}
          onPress={() => router.push('/alunos')} 
        >
          Gerenciar Alunos
        </StyledButton>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#2B2727' },
  container: { padding: 20 },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFF',
    textAlign: 'center',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: '#DDD',
    textAlign: 'center',
    marginBottom: 40,
  },
  menuButton: {
    marginBottom: 15,
  },
});

export default AdminDashboardScreen;