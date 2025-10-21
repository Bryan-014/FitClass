import StyledButton from '@/src/components/StyledButton';
import StyledInput from '@/src/components/StyledInput';
import { deleteInstrutor, getInstrutorById, updateInstrutor } from '@/src/services/instrutorService';
import { Stack, router, useLocalSearchParams } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, ScrollView, StyleSheet, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const DetalheInstrutorScreen = () => {
    const { id } = useLocalSearchParams<{ id: string }>();

    const [nome, setNome] = useState('');
    const [especialidade, setEspecialidade] = useState('');
    const [loading, setLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => { 
        if (!id) return;
        
        const fetchInstrutor = async () => {
            setLoading(true);
            try {
                const data = await getInstrutorById(Number(id));
                setNome(data.nome);
                setEspecialidade(data.especialidade); 
            } catch (error) {
                Alert.alert('Erro', 'Não foi possível carregar os detalhes do instrutor.');
            } finally {
                setLoading(false);
            }
        };

        fetchInstrutor();
    }, [id]);

    const handleUpdate = async () => {
        if (!nome || !especialidade) { 
            Alert.alert('Erro', 'Todos os campos são obrigatórios.'); 
            return; 
        }

        setIsSaving(true);
        try {
            await updateInstrutor(Number(id), { id: Number(id), nome, especialidade });
            Alert.alert('Sucesso', 'Instrutor atualizado com sucesso!');
            router.back();
        } catch (error) {
            Alert.alert('Erro', 'Não foi possível atualizar o instrutor.');
        } finally {
            setIsSaving(false);
        }
    };
    
    const handleDelete = () => {
        Alert.alert(
            'Confirmar Exclusão',
            `Você tem certeza que deseja excluir o instrutor "${nome}"?`,
            [
                { text: 'Cancelar', style: 'cancel' },
                { text: 'Excluir', style: 'destructive', onPress: async () => {
                    setIsSaving(true);
                    try {
                        await deleteInstrutor(Number(id));
                        Alert.alert('Sucesso', 'Instrutor excluído.');
                        router.back();
                    } catch (error) {
                        Alert.alert('Erro', 'Não foi possível excluir o instrutor.');
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
            <Stack.Screen options={{ title: 'Editar Instrutor' }} />
            <ScrollView style={styles.container}>
                <Text style={styles.label}>Nome do Instrutor</Text>
                <StyledInput value={nome} onChangeText={setNome} editable={!isSaving} />

                <Text style={styles.label}>Especialidade</Text>
                <StyledInput value={especialidade} onChangeText={setEspecialidade} editable={!isSaving} />
                
                <StyledButton onPress={handleUpdate} disabled={isSaving} style={styles.actionButton}>
                    {isSaving ? <ActivityIndicator color="#FFF" /> : 'Salvar Alterações'}
                </StyledButton>
                <StyledButton onPress={handleDelete} variant="secondary" disabled={isSaving} style={styles.deleteButton}>
                    {isSaving ? <ActivityIndicator color="#FFF" /> : 'Excluir Instrutor'}
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
});

export default DetalheInstrutorScreen;