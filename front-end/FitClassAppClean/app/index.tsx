import StyledButton from '@/src/components/StyledButton';
import StyledInput from '@/src/components/StyledInput';
import { login } from '@/src/services/authService';
import { router, Stack } from 'expo-router';
import React, { useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    Image,
    StyleSheet,
    Text,
    View,
    ScrollView,
    TouchableOpacity
} from 'react-native';

const LoginScreen = () => {
    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [loading, setLoading] = useState(false);

    const handleLogin = async () => {
        if (!email || !password) {
            Alert.alert('Erro', 'Por favor, preencha o email e a senha.');
            return;
        }

        setLoading(true);
        try {
            const token = await login({ login: email, senha: password });
            if (token) {
                router.replace('/home');
            } else {
                Alert.alert('Falha no Login', 'Usuário ou senha incorretos.');
            }
        } catch (error) {
            Alert.alert('Erro', 'Ocorreu um problema ao tentar fazer login.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <Stack.Screen options={{ headerShown: false }} />
            <ScrollView contentContainerStyle={styles.container}>
                <View style={styles.headerContainer}>
                    <Text style={styles.title}>FITCLASS</Text>
                    <Text style={styles.subtitle}>Acesse sua conta para continuar</Text>
                </View>

                <View style={styles.formContainer}>
                    <StyledInput
                        placeholder="EMAIL"
                        value={email}
                        onChangeText={setEmail}
                        keyboardType="email-address"
                        autoCapitalize="none"
                        editable={!loading}
                    />
                    <StyledInput
                        placeholder="SENHA"
                        value={password}
                        onChangeText={setPassword}
                        secureTextEntry
                        editable={!loading}
                    />
                </View>

                <View style={styles.actionsContainer}>
                    <StyledButton variant='primary' onPress={handleLogin} disabled={loading} style={styles.loginButton}>
                        {loading ? <ActivityIndicator color="#FFF" /> : 'Entrar'}
                    </StyledButton>
                    <StyledButton variant='secondary' onPress={() => router.push('/register')} disabled={loading}>
                        Criar Conta
                    </StyledButton>
                </View>

                <View style={styles.dividerContainer}>
                    <View style={styles.dividerLine} />
                    <Text style={styles.dividerText}>OU</Text>
                    <View style={styles.dividerLine} />
                </View>

                <StyledButton variant='google' onPress={() => Alert.alert('Aviso', 'Funcionalidade ainda não implementada.')} disabled={loading}>
                    <Image source={require('../src/assets/google.png')} style={styles.googleIcon} />
                    <Text style={styles.buttonTextGoogle}>Entrar com Google</Text>
                </StyledButton>

                <View style={styles.footerContainer}>
                    <TouchableOpacity onPress={() => Alert.alert('Aviso', 'Funcionalidade ainda não implementada.')}>
                        <Text style={styles.forgotPasswordText}>Esqueceu sua senha?</Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </>
    );
};

const styles = StyleSheet.create({
    container: {
        flexGrow: 1,
        backgroundColor: '#1A1A1A',
        justifyContent: 'center',
        paddingHorizontal: 30,
    },
    headerContainer: {
        alignItems: 'center',
        marginBottom: 40,
    },
    title: {
        fontSize: 48,
        color: '#FFF',
        fontWeight: '300',
    },
    subtitle: {
        fontSize: 16,
        color: '#AAA',
        marginTop: 10,
    },
    formContainer: {
        gap: 15,
        marginBottom: 20,
    },
    actionsContainer: {
        gap: 15,
    },
    loginButton: {
        backgroundColor: '#A33E3E',
    },
    dividerContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: 30,
    },
    dividerLine: {
        flex: 1,
        height: 1,
        backgroundColor: '#4A4A4A',
    },
    dividerText: {
        color: '#888',
        marginHorizontal: 10,
        fontWeight: 'bold',
    },
    footerContainer: {
        alignItems: 'center',
        marginTop: 40,
    },
    forgotPasswordText: {
        color: '#AAA',
        fontSize: 14,
        textDecorationLine: 'underline',
    },
    googleIcon: {
        width: 20,
        height: 20,
        marginRight: 10,
    },
    buttonTextGoogle: {
        color: '#000',
        fontSize: 16,
        fontWeight: 'bold',
    },
});

export default LoginScreen;