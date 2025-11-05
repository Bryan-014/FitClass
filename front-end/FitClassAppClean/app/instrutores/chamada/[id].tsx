import React, { useState, useEffect, useCallback } from 'react';
import { Text, View, StyleSheet, TouchableOpacity, FlatList, Alert, ActivityIndicator } from 'react-native';
import { useLocalSearchParams, Stack, router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { getAlunosDaAula, marcarPresenca, Agendamento } from '@/src/services/agendamentoService';

const TelaDeChamada = () => {
  const { id: aulaId } = useLocalSearchParams<{ id: string }>();
  const [listaDeChamada, setListaDeChamada] = useState<Agendamento[]>([]);
  const [loading, setLoading] = useState(true);

  console.log("--- [LOG DA TELA DE CHAMADA] ---");
  console.log("Tela renderizada. ID da aula recebido da URL:", aulaId);

  const fetchAlunosInscritos = useCallback(async () => {
    if (!aulaId) {
      console.log("ID da aula é nulo ou indefinido, a busca não será realizada.");
      setLoading(false);
      return;
    }

    console.log("Iniciando fetchAlunosInscritos para o ID:", aulaId);
    setLoading(true);
    try {
      console.log("Chamando a API 'getAlunosDaAula'...");
      const data = await getAlunosDaAula(Number(aulaId));
      console.log("Dados recebidos com sucesso:", JSON.stringify(data, null, 2));
      setListaDeChamada(data);
    } catch (error: any) {
      console.error("### ERRO no fetchAlunosInscritos ###");
      if (error.response) {
          console.error("Status do Erro:", error.response.status);
          console.error("Dados do Erro:", JSON.stringify(error.response.data, null, 2));
      } else if (error.request) {
          console.error("Não houve resposta do servidor:", error.request);
      } else {
          console.error("Erro que não é da API (ex: tipo, etc.):", error.message);
      }
      Alert.alert("Erro", "Não foi possível carregar a lista de alunos.");
    } finally {
      setLoading(false);
      console.log("Busca de alunos finalizada, loading=false");
    }
  }, [aulaId]);

  useEffect(() => {
    console.log("useEffect da tela foi disparado.");
    fetchAlunosInscritos();
  }, [fetchAlunosInscritos]);

  const handleMarcarPresenca = async (agendamentoId: number, compareceu: boolean) => {
    console.log(`Marcando presença para agendamento ID ${agendamentoId}: ${compareceu}`);
    try {
      await marcarPresenca(agendamentoId, compareceu);
      
      setListaDeChamada(listaAtual => 
        listaAtual.map(agendamento => 
          agendamento.id === agendamentoId 
            ? { ...agendamento, compareceu, status: compareceu ? "COMPARECEU" : "AUSENTE" } 
            : agendamento
        )
      );
    } catch (error) {
      console.error("Erro ao marcar presença:", error);
      Alert.alert("Erro", "Não foi possível registrar a presença.");
    }
  };

  const renderItemChamada = ({ item }: { item: Agendamento }) => (
    <View style={styles.card}>
      <View style={styles.alunoInfo}>
        <Ionicons name="person-circle-outline" size={40} color="#FFF" />
        <Text style={styles.alunoNome}>{item.aluno.nome}</Text>
      </View>
      <View style={styles.botoesContainer}>
        <TouchableOpacity 
          style={[styles.botaoPresenca, item.compareceu ? styles.botaoPresente : styles.botaoAusente]}
          onPress={() => handleMarcarPresenca(item.id, true)}
        >
          <Ionicons name="checkmark" size={24} color={item.compareceu ? "white" : "#A3E635"} />
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.botaoPresenca, !item.compareceu && item.status === 'AUSENTE' ? styles.botaoAusenteMarcado : styles.botaoAusente]}
          onPress={() => handleMarcarPresenca(item.id, false)}
        >
          <Ionicons name="close" size={24} color={!item.compareceu && item.status === 'AUSENTE' ? "white" : "#FF6B6B"} />
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <Stack.Screen options={{ headerShown: false }} />
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <Ionicons name="arrow-back" size={28} color="white" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Lista de Chamada</Text>
        <View style={{ width: 40 }} />
      </View>

      {loading ? (
        <ActivityIndicator size="large" color="#FFF" style={{ flex: 1 }} />
      ) : (
        <FlatList
          data={listaDeChamada}
          renderItem={renderItemChamada}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={{ padding: 20 }}
          ListEmptyComponent={<Text style={styles.emptyText}>Nenhum aluno inscrito nesta aula.</Text>}
        />
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
    safeArea: { flex: 1, backgroundColor: '#1A1A1A' },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 10,
        paddingVertical: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#2B2727'
    },
    backButton: { padding: 8 },
    headerTitle: { color: '#FFF', fontSize: 22, fontWeight: 'bold' },
    emptyText: { color: '#888', fontStyle: 'italic', textAlign: 'center', marginTop: 50 },
    card: {
      backgroundColor: '#2B2727',
      borderRadius: 12,
      padding: 15,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginBottom: 15,
    },
    alunoInfo: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    alunoNome: {
      color: '#FFF',
      fontSize: 18,
      marginLeft: 10,
    },
    botoesContainer: {
      flexDirection: 'row',
    },
    botaoPresenca: {
      padding: 8,
      borderRadius: 20,
      marginLeft: 10,
    },
    botaoPresente: {
      backgroundColor: '#A3E635',
    },
    botaoAusente: {
      backgroundColor: 'transparent',
      borderWidth: 1,
      borderColor: '#FF6B6B',
    },
    botaoAusenteMarcado: {
      backgroundColor: '#FF6B6B',
    }
});

export default TelaDeChamada;