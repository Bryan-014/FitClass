import React, { useState, useEffect } from 'react';
import {
    StyleSheet,
    Alert,
    ActivityIndicator,
    ScrollView,
    Text,
    View,
    TouchableOpacity
} from 'react-native';
import { Stack, router } from 'expo-router';
import StyledInput from '@/src/components/StyledInput';
import StyledButton from '@/src/components/StyledButton';
import { createAula, AulaCreationData } from '@/src/services/aulaService';
import DateTimePickerModal from "react-native-modal-datetime-picker";
import { Picker } from '@react-native-picker/picker';
import { getInstrutores, Instrutor } from '@/src/services/instrutorService';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

const NovaAulaScreen = () => {
    console.log("Tela NovaAulaScreen renderizou.");

    const [nome, setNome] = useState('');
    const [descricao, setDescricao] = useState('');
    const [duracao, setDuracao] = useState('60');
    const [capacidade, setCapacidade] = useState('20');
    const [limiteCancelamentoHoras, setLimiteCancelamentoHoras] = useState('2');
    const [loading, setLoading] = useState(false);
    const [date, setDate] = useState(new Date());
    const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
    const [instrutorId, setInstrutorId] = useState<number | undefined>();
    const [todosInstrutores, setTodosInstrutores] = useState<Instrutor[]>([]);
    const [loadingInstrutores, setLoadingInstrutores] = useState(true);

    useEffect(() => {
        const carregarInstrutores = async () => {
            console.log("Buscando instrutores...");
            try {
                const data = await getInstrutores();
                setTodosInstrutores(data);
                console.log("Instrutores carregados com sucesso.");
            } catch (error) {
                console.error("Erro ao carregar instrutores:", error);
                Alert.alert("Erro", "Não foi possível carregar a lista de instrutores.");
            } finally {
                setLoadingInstrutores(false);
            }
        };
        carregarInstrutores();
    }, []);

    const showDatePicker = () => setDatePickerVisibility(true);
    const hideDatePicker = () => setDatePickerVisibility(false);

    const handleConfirm = (selectedDate: Date) => {
        console.log("--- handleConfirm chamado ---");
        hideDatePicker();
        const now = new Date();
        const dayOfWeek = selectedDate.getDay();
        const hour = selectedDate.getHours();
        console.log("Data selecionada:", selectedDate.toISOString());
        console.log("Dia da semana (0=Dom):", dayOfWeek);
        console.log("Hora:", hour);

        if (selectedDate < now) {
            console.log("VALIDAÇÃO FALHOU: Tentou agendar no passado.");
            Alert.alert("Data Inválida", "Você não pode agendar uma aula no passado.");
            return;
        }
        if (dayOfWeek === 0) {
            console.log("VALIDAÇÃO FALHOU: Tentou agendar no domingo.");
            Alert.alert("Data Inválida", "A academia não abre aos domingos.");
            return;
        }
        if (hour < 8 || hour >= 18) {
            console.log("VALIDAÇÃO FALHOU: Fora do horário de funcionamento.");
            Alert.alert("Horário Inválido", "As aulas só podem ser agendadas entre 08:00 e 18:00.");
            return;
        }
        console.log("VALIDAÇÃO OK: Atualizando a data.");
        setDate(selectedDate);
    };

    const handleSave = async () => {
        console.log("--- Botão SALVAR clicado! ---");
        if (!nome || !instrutorId) {
            console.log("VALIDAÇÃO FALHOU: Nome ou Instrutor faltando.");
            Alert.alert('Erro', 'Nome da aula e Instrutor são campos obrigatórios.');
            return;
        }
        setLoading(true);
        const dadosParaCriar: AulaCreationData = {
            nome, descricao, dataHora: date.toISOString(), duracao: Number(duracao),
            capacidade: capacidade, limiteCancelamentoHoras: Number(limiteCancelamentoHoras), instrutorId: instrutorId
        };
        console.log("Enviando para a API:", dadosParaCriar);
        try {
            await createAula(dadosParaCriar);
            console.log("SUCESSO: Aula criada.");
            Alert.alert('Sucesso', 'Aula criada com sucesso!');
            router.back();
        } catch (error) {
            console.error('ERRO na API ao criar aula:', error);
            Alert.alert('Erro', 'Não foi possível criar a aula.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <SafeAreaView style={styles.safeArea}>
            <Stack.Screen options={{ headerShown: false }} />
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                    <Ionicons name="arrow-back" size={28} color="white" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Nova Aula</Text>
                <View style={{ width: 40 }} />
            </View>

            <ScrollView contentContainerStyle={styles.container}>
                <Text style={styles.label}>Nome da Aula</Text>
                <StyledInput value={nome} onChangeText={setNome} placeholder="Ex: CrossFit Avançado" editable={!loading} />

                <Text style={styles.label}>Descrição</Text>
                <StyledInput value={descricao} onChangeText={setDescricao} placeholder="Descrição curta da aula" multiline editable={!loading} />

                <Text style={styles.label}>Data e Hora da Aula</Text>
                <StyledButton onPress={showDatePicker} disabled={loading}>
                    {`${date.toLocaleDateString('pt-BR')} às ${date.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}`}
                </StyledButton>

                <DateTimePickerModal
                    isVisible={isDatePickerVisible} mode="datetime" onConfirm={handleConfirm}
                    onCancel={hideDatePicker} date={date} locale="pt_BR" minimumDate={new Date()}
                />

                <Text style={styles.label}>Instrutor</Text>
                <View style={styles.pickerContainer}>
                    {loadingInstrutores ? (
                        <ActivityIndicator color="#FFF" style={{ paddingVertical: 20 }} />
                    ) : (
                        <Picker
                            selectedValue={instrutorId}
                            onValueChange={(itemValue) => setInstrutorId(itemValue)}
                            style={styles.picker}
                            dropdownIconColor={'#FFF'}
                            enabled={!loading}
                        >
                            <Picker.Item label="-- Selecione um instrutor --" value={undefined} />
                            {todosInstrutores.map((instrutor) => (
                                <Picker.Item key={instrutor.id} label={instrutor.nome} value={instrutor.id} />
                            ))}
                        </Picker>
                    )}
                </View>

                <Text style={styles.label}>Duração (minutos)</Text>
                <StyledInput value={duracao} onChangeText={setDuracao} keyboardType="numeric" editable={!loading} />

                <Text style={styles.label}>Capacidade</Text>
                <StyledInput value={capacidade} onChangeText={setCapacidade} keyboardType="numeric" editable={!loading} />

                <Text style={styles.label}>Limite de Cancelamento (horas)</Text>
                <StyledInput value={limiteCancelamentoHoras} onChangeText={setLimiteCancelamentoHoras} keyboardType="numeric" editable={!loading} />

                <StyledButton onPress={handleSave} disabled={loading} style={styles.saveButton}>
                    {loading ? <ActivityIndicator color="#FFF" /> : 'Salvar Aula'}
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
    container: {
        paddingHorizontal: 20,
        paddingBottom: 40,
    },
    label: {
        color: '#FFF',
        fontSize: 16,
        marginBottom: 8,
        marginTop: 20,
        fontWeight: 'bold'
    },
    pickerContainer: {
        backgroundColor: '#2B2727',
        borderRadius: 8,
        justifyContent: 'center',
    },
    picker: {
        color: '#FFF',
    },
    saveButton: {
        marginTop: 40,
        backgroundColor: '#A33E3E',
    }
});

export default NovaAulaScreen;