import React, { useState, useEffect } from 'react';
import { StyleSheet, Alert, ActivityIndicator, ScrollView, Text, View, TouchableOpacity } from 'react-native';
import { Stack, router, useLocalSearchParams } from 'expo-router';
import StyledInput from '@/src/components/StyledInput';
import StyledButton from '@/src/components/StyledButton';
import { getAlunoById, updateAluno, deleteAluno } from '@/src/services/alunoService';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

const DetalheAlunoScreen = () => {
    const { id } = useLocalSearchParams<{ id: string }>();
    const [nome, setNome] = useState('');
    const [penalidade, setPenalidade] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        if (!id) return;
        const fetchAluno = async () => {
            setLoading(true);
            try {
                const data = await getAlunoById(Number(id));
                setNome(data.nome);
                if (data.penalidade) {
                    const dataFormatada = new Date(data.penalidade).toLocaleDateString('pt-BR', {
                        day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit'
                    });
                    setPenalidade(`Penalizado até: ${dataFormatada}`);
                } else {
                    setPenalidade("Sem penalidades.");
                }
            } catch (error) {
                Alert.alert('Erro', 'Não foi possível carregar os detalhes do aluno.');
            } finally {
                setLoading(false);
            }
        };
        fetchAluno();
    }, [id]);

    const handleUpdate = async () => {
        if (!nome) {
            Alert.alert('Erro', 'O nome é obrigatório.');
            return;
        }
        setIsSaving(true);
        try {
            await updateAluno(Number(id), { id: Number(id), nome });
            Alert.alert('Sucesso', 'Aluno atualizado!');
            router.back();
        } catch (error) {
            Alert.alert('Erro', 'Não foi possível atualizar o aluno.');
        } finally {
            setIsSaving(false);
        }
    };
    
    const handleDelete = () => {
        Alert.alert('Confirmar Exclusão', `Deseja excluir o aluno "${nome}"?`,
            [
                { text: 'Cancelar', style: 'cancel' },
                { text: 'Excluir', style: 'destructive', onPress: async () => {
                    setIsSaving(true);
                    try {
                        await deleteAluno(Number(id));
                        Alert.alert('Sucesso', 'Aluno excluído.');
                        router.back();
                    } catch (error) {
                        Alert.alert('Erro', 'Não foi possível excluir o aluno.');
                    } finally {
                        setIsSaving(false);
                    }
                }}
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

    return (
        <SafeAreaView style={styles.safeArea}>
            <Stack.Screen options={{ headerShown: false }} />
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                    <Ionicons name="arrow-back" size={28} color="white" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Editar Aluno</Text>
                <View style={{ width: 40 }} />
            </View>

            <ScrollView contentContainerStyle={styles.container}>
                <Text style={styles.label}>Nome do Aluno</Text>
                <StyledInput value={nome} onChangeText={setNome} editable={!isSaving} />

                <Text style={styles.label}>Status da Penalidade</Text>
                <View style={styles.penalidadeContainer}>
                    <Text style={styles.penalidadeText}>{penalidade}</Text>
                </View>
                
                <StyledButton onPress={handleUpdate} disabled={isSaving} style={styles.actionButton}>
                    {isSaving ? <ActivityIndicator color="#FFF" /> : 'Salvar Alterações'}
                </StyledButton>
                <StyledButton onPress={handleDelete} variant="secondary" disabled={isSaving} style={styles.deleteButton}>
                    {isSaving ? <ActivityIndicator color="#FFF" /> : 'Excluir Aluno'}
                </StyledButton>
            </ScrollView>
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
    },
    backButton: { padding: 8 },
    headerTitle: { color: '#FFF', fontSize: 22, fontWeight: 'bold' },
    container: { padding: 20 },
    label: { color: '#FFF', fontSize: 16, marginBottom: 8, marginTop: 15, fontWeight: 'bold' },
    actionButton: { marginTop: 30, backgroundColor: '#A33E3E' },
    deleteButton: { backgroundColor: '#555', marginTop: 10 },
    penalidadeContainer: {
        backgroundColor: '#2B2727',
        borderRadius: 8,
        paddingVertical: 15,
        paddingHorizontal: 20,
    },
    penalidadeText: {
        color: '#DDD',
        fontSize: 16,
    }
});

export default DetalheAlunoScreen;