import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Alert,
  ActivityIndicator,
  ScrollView,
  Text,
  View,
  TouchableOpacity,
} from "react-native";
import { Stack, router, useLocalSearchParams } from "expo-router";
import StyledButton from "@/src/components/StyledButton";
import {
  getAgendamentoById,
  cancelarAgendamento,
  Agendamento,
} from "@/src/services/agendamentoService";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";

const DetalheAgendamentoScreen = () => {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [agendamento, setAgendamento] = useState<Agendamento | null>(null);
  const [loading, setLoading] = useState(true);
  const [isCanceling, setIsCanceling] = useState(false);

  useEffect(() => {
    if (!id) return;
    const fetchAgendamento = async () => {
      setLoading(true);
      try {
        const data = await getAgendamentoById(Number(id));
        setAgendamento(data);
      } catch (error) {
        Alert.alert(
          "Erro",
          "Não foi possível carregar os detalhes do agendamento."
        );
      } finally {
        setLoading(false);
      }
    };
    fetchAgendamento();
  }, [id]);

  const handleCancel = () => {
    Alert.alert(
      "Cancelar Agendamento",
      "Você tem certeza que deseja cancelar sua vaga nesta aula?",
      [
        { text: "Manter Vaga", style: "cancel" },
        {
          text: "Sim, Cancelar",
          style: "destructive",
          onPress: async () => {
            setIsCanceling(true);
            try {
              await cancelarAgendamento(Number(id));
              Alert.alert("Sucesso", "Seu agendamento foi cancelado.");
              router.back();
            } catch (error) {
              Alert.alert("Erro", "Não foi possível cancelar o agendamento.");
            } finally {
              setIsCanceling(false);
            }
          },
        },
      ]
    );
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <ActivityIndicator size="large" color="#FFF" style={{ flex: 1 }} />
      </SafeAreaView>
    );
  }

  if (!agendamento) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <Text style={styles.label}>Agendamento não encontrado.</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <Stack.Screen options={{ headerShown: false }} />

      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.backButton}
        >
          <Ionicons name="arrow-back" size={28} color="white" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Meu Agendamento</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>{agendamento.aula.nome}</Text>
        <Text style={styles.instrutor}>
          com {agendamento.aula.instrutor.nome}
        </Text>

        <View style={styles.infoBox}>
          <Text style={styles.label}>Data & Hora</Text>
          <Text style={styles.value}>
            {new Date(agendamento.aula.dataHora).toLocaleString("pt-BR", {
              dateStyle: "long",
              timeStyle: "short",
            })}
          </Text>
        </View>

        <View style={styles.infoBox}>
          <Text style={styles.label}>Duração</Text>
          <Text style={styles.value}>{agendamento.aula.duracao} minutos</Text>
        </View>

        <View style={styles.infoBox}>
          <Text style={styles.label}>Status</Text>
          <Text style={[styles.value, { color: "#A3E635" }]}>
            {agendamento.status}
          </Text>
        </View>

        <StyledButton
          onPress={handleCancel}
          disabled={isCanceling}
          style={styles.deleteButton}
        >
          {isCanceling ? (
            <ActivityIndicator color="#FFF" />
          ) : (
            "Cancelar Agendamento"
          )}
        </StyledButton>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: "#1A1A1A" },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 10,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#2B2727",
  },
  backButton: { padding: 8 },
  headerTitle: { color: "#FFF", fontSize: 22, fontWeight: "bold" },
  container: { padding: 20, paddingBottom: 40 },
  title: { color: "#FFF", fontSize: 32, fontWeight: "bold", marginBottom: 5 },
  instrutor: { color: "#AAA", fontSize: 18, marginBottom: 30 },
  infoBox: { marginBottom: 20 },
  label: {
    color: "#AAA",
    fontSize: 14,
    fontWeight: "bold",
    textTransform: "uppercase",
  },
  value: { color: "#FFF", fontSize: 18, marginTop: 5 },
  deleteButton: { backgroundColor: "#A33E3E", marginTop: 30 },
});

export default DetalheAgendamentoScreen;
