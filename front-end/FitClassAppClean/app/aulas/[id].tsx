import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Alert, ActivityIndicator, ScrollView } from 'react-native';
import { Stack, router, useLocalSearchParams } from 'expo-router';
import StyledInput from '@/src/components/StyledInput';
import StyledButton from '@/src/components/StyledButton';
import { getAulaById, updateAula, deleteAula, Aula } from '@/src/services/aulaService';

const DetalheAulaScreen = () => {
    const { id } = useLocalSearchParams<{ id: string }>();
    const [aula, setAula] = useState<Aula | null>(null);
    const [nome, setNome] = useState('');
    const [descricao, setDescricao] = useState('');
    const [loading, setLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        if (!id) return;
        const fetchAula = async () => {
            setLoading(true);
            try {
                const data = await getAulaById(Number(id));
                setAula(data);
                setNome(data.nome);
                setDescricao(data.descricao);
            } catch (error) {
                Alert.alert('Erro', 'Não foi possível carregar os detalhes da aula.');
            } finally {
                setLoading(false);
            }
        };
        fetchAula();
    }, [id]);

    const handleUpdate = async () => {
        if (!nome) { Alert.alert('Erro', 'O nome não pode ser vazio.'); return; }
        setIsSaving(true);
        try {
            await updateAula(Number(id), { id: Number(id), nome, descricao });
            Alert.alert('Sucesso', 'Aula atualizada!');
            router.back();
        } catch (error) {
            Alert.alert('Erro', 'Não foi possível atualizar a aula.');
        } finally {
            setIsSaving(false);
        }
    };
    
    const handleDelete = () => {
        Alert.alert(
            'Confirmar Exclusão',
            'Você tem certeza que deseja excluir esta aula?',
            [
                { text: 'Cancelar', style: 'cancel' },
                { text: 'Excluir', style: 'destructive', onPress: async () => {
                    try {
                        await deleteAula(Number(id));
                        Alert.alert('Sucesso', 'Aula excluída.');
                        router.back();
                    } catch (error) {
                        Alert.alert('Erro', 'Não foi possível excluir a aula.');
                    }
                }}
            ]
        );
    };

    if (loading) {
        return <ActivityIndicator size="large" color="#FFF" style={{ flex: 1, backgroundColor: '#2B2727' }} />;
    }

    return (
        <ScrollView style={styles.container}>
            <Stack.Screen options={{ title: aula?.nome || 'Detalhes da Aula' }} />
            <Text style={styles.label}>Nome da Aula</Text>
            <StyledInput value={nome} onChangeText={setNome} editable={!isSaving} />

            <Text style={styles.label}>Descrição</Text>
            <StyledInput value={descricao} onChangeText={setDescricao} multiline editable={!isSaving} />
            
            <StyledButton onPress={handleUpdate} disabled={isSaving} style={{ marginTop: 20 }}>
                {isSaving ? <ActivityIndicator color="#FFF" /> : 'Salvar Alterações'}
            </StyledButton>
            <StyledButton onPress={handleDelete} variant="secondary" style={styles.deleteButton}>
                Excluir Aula
            </StyledButton>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#2B2727', padding: 20 },
    label: { color: '#FFF', fontSize: 16, marginBottom: 5, marginTop: 15 },
    deleteButton: { backgroundColor: '#A33E3E', marginTop: 10 },
});

export default DetalheAulaScreen;