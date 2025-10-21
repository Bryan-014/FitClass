import StyledButton from '@/src/components/StyledButton';
import StyledInput from '@/src/components/StyledInput';
import { createAula } from '@/src/services/aulaService';
import DateTimePicker, { DateTimePickerEvent } from '@react-native-community/datetimepicker';
import { Stack, router } from 'expo-router';
import React, { useState } from 'react';
import { ActivityIndicator, Alert, Platform, ScrollView, StyleSheet, Text, View } from 'react-native';

const NovaAulaScreen = () => {
    const [nome, setNome] = useState('');
    const [descricao, setDescricao] = useState('');
    const [duracao, setDuracao] = useState('60');
    const [capacidade, setCapacidade] = useState('20');
    const [limiteCancelamentoHoras, setLimiteCancelamentoHoras] = useState('2');
    const [instrutorId, setInstrutorId] = useState('');
    const [loading, setLoading] = useState(false);

    const [date, setDate] = useState(new Date());
    const [showPicker, setShowPicker] = useState(false);
    const [pickerMode, setPickerMode] = useState<'date' | 'time'>('date');

    const onChange = (event: DateTimePickerEvent, selectedDate?: Date) => {
        setShowPicker(false);
        if (selectedDate) {
            setDate(selectedDate);
        }
    };

    const showDatepicker = () => {
        setPickerMode('date');
        setShowPicker(true);
    };

    const showTimepicker = () => {
        setPickerMode('time');
        setShowPicker(true);
    };

    const handleSave = async () => {
        if (!nome || !instrutorId) {
            Alert.alert('Erro', 'Nome e ID do Instrutor são obrigatórios.');
            return;
        }
        setLoading(true);
        try {
            await createAula({ 
                nome, 
                descricao,
                dataHora: date.toISOString(), 
                duracao: Number(duracao),
                capacidade: capacidade,
                limiteCancelamentoHoras: Number(limiteCancelamentoHoras),
                instrutorId: Number(instrutorId) 
            });
            Alert.alert('Sucesso', 'Aula criada com sucesso!');
            router.back(); 
        } catch (error) {
            console.error('Erro ao criar aula:', error);
            Alert.alert('Erro', 'Não foi possível criar a aula.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <ScrollView style={styles.container}>
            <Stack.Screen options={{ title: 'Nova Aula' }} />
            <Text style={styles.label}>Nome da Aula</Text>
            <StyledInput value={nome} onChangeText={setNome} placeholder="Ex: CrossFit Avançado" />

            <Text style={styles.label}>Descrição</Text>
            <StyledInput value={descricao} onChangeText={setDescricao} placeholder="Descrição curta da aula" multiline />
            
            <Text style={styles.label}>Data e Hora da Aula</Text>
            <View style={styles.datePickerContainer}>
                <StyledButton onPress={showDatepicker} style={styles.datePickerButton}>
                    {`Data: ${date.toLocaleDateString('pt-BR')}`}
                </StyledButton>
                <StyledButton onPress={showTimepicker} style={styles.datePickerButton}>
                    {`Hora: ${date.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}`}
                </StyledButton>
            </View>

            {showPicker && (
                <DateTimePicker
                    testID="dateTimePicker"
                    value={date}
                    mode={pickerMode}
                    is24Hour={true}
                    display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                    onChange={onChange}
                />
            )}

            <Text style={styles.label}>Duração (minutos)</Text>
            <StyledInput value={duracao} onChangeText={setDuracao} keyboardType="numeric" />

            <Text style={styles.label}>Capacidade</Text>
            <StyledInput value={capacidade} onChangeText={setCapacidade} keyboardType="numeric" />

            <Text style={styles.label}>Limite de Cancelamento (horas)</Text>
            <StyledInput value={limiteCancelamentoHoras} onChangeText={setLimiteCancelamentoHoras} keyboardType="numeric" />

            <Text style={styles.label}>ID do Instrutor</Text>
            <StyledInput value={instrutorId} onChangeText={setInstrutorId} keyboardType="numeric" />
            
            <StyledButton onPress={handleSave} disabled={loading} style={{ marginTop: 20 }}>
                {loading ? <ActivityIndicator color="#FFF" /> : 'Salvar Aula'}
            </StyledButton>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#2B2727', padding: 20 },
    label: { color: '#FFF', fontSize: 16, marginBottom: 5, marginTop: 15 },
    datePickerContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    datePickerButton: {
        flex: 1,
        marginHorizontal: 5,
    }
});

export default NovaAulaScreen;