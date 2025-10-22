import React, { useState, useEffect } from 'react';
import { StyleSheet, Alert, ActivityIndicator, ScrollView, Text, View, TouchableOpacity } from 'react-native';
import { Stack, router, useLocalSearchParams } from 'expo-router';
import StyledInput from '@/src/components/StyledInput';
import StyledButton from '@/src/components/StyledButton';
import { getAulaById, updateAula, deleteAula, AulaCreationData } from '@/src/services/aulaService';
import { SafeAreaView } from 'react-native-safe-area-context';
import DateTimePickerModal from "react-native-modal-datetime-picker";
import { Picker } from '@react-native-picker/picker';
import { getInstrutores, Instrutor } from '@/src/services/instrutorService';
import { Ionicons } from '@expo/vector-icons';

const DetalheAulaScreen = () => {
    const { id } = useLocalSearchParams<{ id: string }>();

    const [nome, setNome] = useState('');
    const [descricao, setDescricao] = useState('');
    const [duracao, setDuracao] = useState('');
    const [capacidade, setCapacidade] = useState('');
    const [limiteCancelamentoHoras, setLimiteCancelamentoHoras] = useState('');
    const [date, setDate] = useState(new Date());
    const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
    const [instrutorId, setInstrutorId] = useState<number | undefined>();
    const [todosInstrutores, setTodosInstrutores] = useState<Instrutor[]>([]);

    const [loading, setLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        if (!id) return;
        const fetchData = async () => {
            setLoading(true);
            try {
                const [dataAula, dataInstrutores] = await Promise.all([
                    getAulaById(Number(id)),
                    getInstrutores()
                ]);
                setNome(dataAula.nome);
                setDescricao(dataAula.descricao || '');
                setDuracao(dataAula.duracao.toString());
                setCapacidade(dataAula.capacidade);
                setLimiteCancelamentoHoras(dataAula.limiteCancelamentoHoras.toString());
                setInstrutorId(dataAula.instrutor.id);
                if (dataAula.dataHora) {
                    setDate(new Date(dataAula.dataHora));
                }
                setTodosInstrutores(dataInstrutores);
            } catch (error) {
                Alert.alert('Erro', 'Não foi possível carregar os dados.');
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [id]);

    const showDatePicker = () => setDatePickerVisibility(true);
    const hideDatePicker = () => setDatePickerVisibility(false);
    
    const handleConfirm = (selectedDate: Date) => {
        hideDatePicker();
        const dayOfWeek = selectedDate.getDay();
        const hour = selectedDate.getHours();

        if (dayOfWeek === 0) {
            Alert.alert("Data Inválida", "A academia não abre aos domingos.");
            return;
        }
        if (hour < 8 || hour >= 18) {
            Alert.alert("Horário Inválido", "As aulas só podem ser agendadas entre 08:00 e 18:00.");
            return;
        }
        setDate(selectedDate);
    };

    const handleUpdate = async () => {
        if (!nome || !instrutorId) {
            Alert.alert('Erro', 'Nome e Instrutor são obrigatórios.');
            return;
        }
        setIsSaving(true);
        try {
            const aulaAtualizada: AulaCreationData = {
                nome,
                descricao,
                dataHora: date.toISOString(),
                duracao: Number(duracao),
                capacidade: capacidade,
                limiteCancelamentoHoras: Number(limiteCancelamentoHoras),
                instrutorId: instrutorId
            };
            await updateAula(Number(id), aulaAtualizada);
            Alert.alert('Sucesso', 'Aula atualizada com sucesso!');
            router.back();
        } catch (error) {
            console.error("Erro ao atualizar aula:", error);
            Alert.alert('Erro', 'Não foi possível atualizar a aula.');
        } finally {
            setIsSaving(false);
        }
    };
    
    const handleDelete = () => {
        Alert.alert( 'Confirmar Exclusão', `Você tem certeza que deseja excluir a aula "${nome}"?`,
            [
                { text: 'Cancelar', style: 'cancel' },
                { text: 'Excluir', style: 'destructive', onPress: async () => {
                    setIsSaving(true);
                    try {
                        await deleteAula(Number(id));
                        Alert.alert('Sucesso', 'Aula excluída.');
                        router.back();
                    } catch (error) {
                        Alert.alert('Erro', 'Não foi possível excluir a aula.');
                    } finally {
                        setIsSaving(false);
                    }
                }}
            ]
        );
    };

    if (loading) { }

    return (
        <SafeAreaView style={styles.safeArea}>
            <Stack.Screen options={{ headerShown: false }} />
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                    <Ionicons name="arrow-back" size={28} color="white" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Editar Aula</Text>
                <View style={{ width: 40 }} />
            </View>
            <ScrollView contentContainerStyle={styles.container}>
                <Text style={styles.label}>Nome da Aula</Text>
                <StyledInput value={nome} onChangeText={setNome} editable={!isSaving} />

                <Text style={styles.label}>Descrição</Text>
                <StyledInput value={descricao} onChangeText={setDescricao} multiline editable={!isSaving} />

                <Text style={styles.label}>Data e Hora da Aula</Text>
                <StyledButton onPress={showDatePicker} disabled={isSaving}>
                    {`${date.toLocaleDateString('pt-BR')} às ${date.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}`}
                </StyledButton>

                <DateTimePickerModal
                    isVisible={isDatePickerVisible}
                    mode="datetime"
                    onConfirm={handleConfirm}
                    onCancel={hideDatePicker}
                    date={date}
                    locale="pt_BR"
                />

                <Text style={styles.label}>Instrutor</Text>
                <View style={styles.pickerContainer}>
                    <Picker
                        selectedValue={instrutorId}
                        onValueChange={(itemValue) => setInstrutorId(itemValue)}
                        style={styles.picker}
                        dropdownIconColor={'#FFF'}
                        enabled={!isSaving}
                    >
                        <Picker.Item label="-- Selecione um instrutor --" value={undefined} />
                        {todosInstrutores.map((instrutor) => (
                            <Picker.Item key={instrutor.id} label={instrutor.nome} value={instrutor.id} />
                        ))}
                    </Picker>
                </View>

                <Text style={styles.label}>Duração (minutos)</Text>
                <StyledInput value={duracao} onChangeText={setDuracao} keyboardType="numeric" editable={!isSaving} />

                <Text style={styles.label}>Capacidade</Text>
                <StyledInput value={capacidade} onChangeText={setCapacidade} editable={!isSaving} />

                <Text style={styles.label}>Limite de Cancelamento (horas)</Text>
                <StyledInput value={limiteCancelamentoHoras} onChangeText={setLimiteCancelamentoHoras} keyboardType="numeric" editable={!isSaving} />
                
                <StyledButton onPress={handleUpdate} disabled={isSaving} style={styles.actionButton}>
                    {isSaving ? <ActivityIndicator color="#FFF" /> : 'Salvar Alterações'}
                </StyledButton>
                <StyledButton onPress={handleDelete} variant="secondary" disabled={isSaving} style={styles.deleteButton}>
                    {isSaving ? <ActivityIndicator color="#FFF" /> : 'Excluir Aula'}
                </StyledButton>
            </ScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    safeArea: { flex: 1, backgroundColor: '#1A1A1A' },
    header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 10, paddingVertical: 10, },
    backButton: { padding: 8 },
    headerTitle: { color: '#FFF', fontSize: 22, fontWeight: 'bold' },
    container: { paddingHorizontal: 20, paddingBottom: 40, },
    label: { color: '#FFF', fontSize: 16, marginBottom: 8, marginTop: 20, fontWeight: 'bold' },
    pickerContainer: { backgroundColor: '#2B2727', borderRadius: 8, justifyContent: 'center', },
    picker: { color: '#FFF', },
    actionButton: { marginTop: 40, backgroundColor: '#A33E3E', },
    deleteButton: { marginTop: 15, backgroundColor: '#555', }
});

export default DetalheAulaScreen;