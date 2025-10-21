import StyledButton from '@/src/components/StyledButton';
import { Aluno, getAlunos } from '@/src/services/alunoService';
import { Stack, router, useFocusEffect } from 'expo-router';
import React, { useCallback, useState } from 'react';
import { ActivityIndicator, Alert, FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const ListaAlunosScreen = () => {
  const [alunos, setAlunos] = useState<Aluno[]>([]);
  const [loading, setLoading] = useState(true);

  useFocusEffect(
    useCallback(() => {
      const fetchAlunos = async () => {
        setLoading(true);
        try {
          const data = await getAlunos();
          setAlunos(data);
        } catch (error) {
          Alert.alert("Erro", "Não foi possível carregar a lista de alunos.");
        } finally {
          setLoading(false);
        }
      };
      fetchAlunos();
    }, [])
  );

  const renderItem = ({ item }: { item: Aluno }) => (
    <TouchableOpacity style={styles.listItem} onPress={() => router.push(`./alunos/${ item.id }`)}>
      <Text style={styles.listItemTitle}>{item.nome}</Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <Stack.Screen options={{ title: 'Gerenciar Alunos' }} />
      <View style={styles.container}>
        {loading ? (
          <ActivityIndicator size="large" color="#FFF" style={{ marginTop: 20 }} />
        ) : (
          <FlatList
            data={alunos}
            renderItem={renderItem}
            keyExtractor={(item) => item.id!.toString()}
            ListEmptyComponent={<Text style={styles.emptyText}>Nenhum aluno encontrado.</Text>}
            contentContainerStyle={{ paddingBottom: 100 }}
          />
        )}
        <View style={styles.footer}>
          <StyledButton variant="primary" onPress={() => router.push('./alunos/new')}>
            Adicionar Novo Aluno
          </StyledButton>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#2B2727' },
  container: { flex: 1, padding: 10 },
  listItem: { backgroundColor: '#4A4A4A', padding: 20, borderRadius: 8, marginBottom: 10 },
  listItemTitle: { color: '#FFF', fontSize: 18, fontWeight: 'bold' },
  listItemSubtitle: { color: '#DDD', fontSize: 14, marginTop: 5 },
  emptyText: { color: '#888', textAlign: 'center', marginTop: 50, fontSize: 16 },
  footer: { position: 'absolute', bottom: 20, left: 20, right: 20 },
});

export default ListaAlunosScreen;