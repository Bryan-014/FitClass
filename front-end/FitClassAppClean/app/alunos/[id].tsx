import StyledButton from '@/src/components/StyledButton';
import StyledInput from '@/src/components/StyledInput';
import { deleteAluno, getAlunoById, updateAluno } from '@/src/services/alunoService';
import { Stack, router, useLocalSearchParams } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

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
            <Stack.Screen options={{ title: 'Editar Aluno' }} />
            <ScrollView style={styles.container}>
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
    safeArea: { flex: 1, backgroundColor: '#2B2727' },
    container: { flex: 1, padding: 20 },
    label: { color: '#FFF', fontSize: 16, marginBottom: 8, marginTop: 15, fontWeight: 'bold' },
    actionButton: { marginTop: 30 },
    deleteButton: { backgroundColor: '#A33E3E', marginTop: 10 },
    penalidadeContainer: {
        backgroundColor: '#4A4A4A',
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