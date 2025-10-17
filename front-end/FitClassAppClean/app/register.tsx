import React, { useState } from 'react';
import { View, Text, StyleSheet, Alert, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Link, Stack, useRouter } from 'expo-router';
import StyledInput from '@/src/components/StyledInput';
import { register } from '@/src/services/authService';

const RegisterScreen = () => {
    const [nome, setNome] = useState('');
    const [email, setEmail] = useState('');
    const [senha, setSenha] = useState('');
    const [confirmaSenha, setConfirmaSenha] = useState('');
    
    const [loading, setLoading] = useState(false);

    const router = useRouter(); 

    const handleRegister = async () => {
        if (!nome || !email || !senha || !confirmaSenha) {
            Alert.alert('Erro', 'Todos os campos são obrigatórios!');
            return;
        }
        if (senha !== confirmaSenha) {
            Alert.alert('Erro', 'As senhas não coincidem!');
            return;
        }

        setLoading(true); 
        try {
            const result = await register({
                nome: nome,
                login: email, 
                senha: senha
            });

            if (result) {
                Alert.alert('Sucesso!', 'Conta criada. Agora você pode fazer o login.');
                router.push('/'); 
            }
            
        } catch (error) {
            console.error("Erro inesperado no registro:", error);
        } finally {
            setLoading(false); 
        }
    };

    return (
        <>
         <Stack.Screen options={{ headerShown: false }} />
         <View style={styles.container}>
             <Text style={styles.title}>FITCLASS</Text>

             <StyledInput placeholder="NOME" value={nome} onChangeText={setNome} editable={!loading} />
             <StyledInput placeholder="EMAIL" value={email} onChangeText={setEmail} keyboardType="email-address" autoCapitalize="none" editable={!loading} />
             <StyledInput placeholder="SENHA" value={senha} onChangeText={setSenha} secureTextEntry editable={!loading} />
             <StyledInput placeholder="CONFIRMAR SENHA" value={confirmaSenha} onChangeText={setConfirmaSenha} secureTextEntry editable={!loading}/>

             
             <TouchableOpacity style={styles.button} onPress={handleRegister} disabled={loading}>
                {loading ? (
                    <ActivityIndicator color="#FFF" />
                ) : (
                    <Text style={styles.buttonText}>Registrar-se</Text>
                )}
             </TouchableOpacity>

             <Link href="/" asChild>
                <TouchableOpacity disabled={loading}>
                    <Text style={styles.link}>Já tenho uma conta</Text>
                </TouchableOpacity>
             </Link>
         </View>
         </>
    );
};


const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#2B2727',
        justifyContent: 'center',
        padding: 35,
    },
    title: {
        fontSize: 48,
        color: '#FFF',
        textAlign: 'center',
        marginBottom: 80,
        fontWeight: '300',
    },
    button: {
        backgroundColor: '#1E1E1E',
        padding: 15,
        borderRadius: 8,
        alignItems: 'center',
        marginTop: 25,
    },
    buttonText: {
        color: '#888',
        fontSize: 16,
        fontWeight: 'bold',
    },
    link: {
        color: '#888',
        textAlign: 'center',
        marginTop: 20,
        fontWeight: 'bold',
    }
});

export default RegisterScreen;