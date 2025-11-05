import React, { useState, useEffect } from 'react';
import { StyleSheet, Alert, ActivityIndicator, ScrollView, Text, View, TouchableOpacity } from 'react-native';
import { Stack, router, useLocalSearchParams } from 'expo-router';
import StyledButton from '@/src/components/StyledButton';
import { getAulaById, Aula } from '@/src/services/aulaService';
import { agendarAula } from '@/src/services/agendamentoService';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

const DetalheAulaAlunoScreen = () => {
    const { id } = useLocalSearchParams<{ id: string }>();
    const [aula, setAula] = useState<Aula | null>(null);
    const [loading, setLoading] = useState(true);
    const [isAgendando, setIsAgendando] = useState(false);

    useEffect(() => {
        if (!id) return;
        const fetchAula = async () => {
            setLoading(true);
            try {
                const data = await getAulaById(Number(id));
                setAula(data);
            } catch (error) {
                Alert.alert('Erro', 'Não foi possível carregar os detalhes da aula.');
            } finally {
                setLoading(false);
            }
        };
        fetchAula();
    }, [id]);

    const handleAgendar = async () => {
        setIsAgendando(true);
        try {
            await agendarAula(Number(id));
            Alert.alert('Sucesso!', 'Sua vaga está confirmada.');
            router.push('/home');
        } catch (error: any) {
            Alert.alert('Erro no Agendamento', error.message || 'Não foi possível garantir sua vaga.');
        } finally {
            setIsAgendando(false);
        }
    };

    if (loading) {
        return <SafeAreaView style={styles.safeArea}><ActivityIndicator size="large" color="#FFF" /></SafeAreaView>;
    }

    if (!aula) {
        return <SafeAreaView style={styles.safeArea}><Text style={styles.label}>Aula não encontrada.</Text></SafeAreaView>;
    }

    return (
        <SafeAreaView style={styles.safeArea}>
            <Stack.Screen options={{ headerShown: false }} />
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                    <Ionicons name="arrow-back" size={28} color="white" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Detalhes da Aula</Text>
                <View style={{ width: 40 }} />
            </View>

            <ScrollView contentContainerStyle={styles.container}>
                <Text style={styles.title}>{aula.nome}</Text>
                <Text style={styles.instrutor}>com {aula.instrutor.nome}</Text>
                
                <View style={styles.infoBox}>
                    <Text style={styles.label}>Data & Hora</Text>
                    <Text style={styles.value}>{new Date(aula.dataHora).toLocaleString('pt-BR', { dateStyle: 'long', timeStyle: 'short' })}</Text>
                </View>
                <View style={styles.infoBox}>
                    <Text style={styles.label}>Duração</Text>
                    <Text style={styles.value}>{aula.duracao} minutos</Text>
                </View>
                <View style={styles.infoBox}>
                    <Text style={styles.label}>Capacidade</Text>
                    <Text style={styles.value}>{aula.capacidade} vagas</Text>
                </View>
                <View style={styles.infoBox}>
                    <Text style={styles.label}>Descrição</Text>
                    <Text style={styles.value}>{aula.descricao || "Sem descrição."}</Text>
                </View>

                <StyledButton onPress={handleAgendar} disabled={isAgendando} style={styles.actionButton}>
                    {isAgendando ? <ActivityIndicator color="#FFF" /> : 'Confirmar Agendamento'}
                </StyledButton>
            </ScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    safeArea: { flex: 1, backgroundColor: '#1A1A1A' },
    header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 10, paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: '#2B2727' },
    backButton: { padding: 8 },
    headerTitle: { color: '#FFF', fontSize: 22, fontWeight: 'bold' },
    container: { padding: 20 },
    title: { color: '#FFF', fontSize: 32, fontWeight: 'bold', marginBottom: 5 },
    instrutor: { color: '#AAA', fontSize: 18, marginBottom: 30 },
    infoBox: { marginBottom: 20 },
    label: { color: '#AAA', fontSize: 14, fontWeight: 'bold', textTransform: 'uppercase' },
    value: { color: '#FFF', fontSize: 18, marginTop: 5 },
    actionButton: { backgroundColor: '#A3E635', marginTop: 30 },
});

export default DetalheAulaAlunoScreen;