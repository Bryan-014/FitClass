import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Alert,
  TouchableOpacity,
  Image
} from 'react-native';
import { router, Link, Stack } from 'expo-router';
import StyledInput from '@/src/components/StyledInput';
import StyledButton from '@/src/components/StyledButton';

const LoginScreen = () => {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');

  const handleLogin = async () => {
    console.log('Tentativa de Login com:', { email, password });

    try {
      const response = await fetch("http://10.20.14.217/api_login/login.php", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();
      console.log(data);

      if (data.status === "success") {
        //alert("Login feito! ID: " + data.user_id);
        router.replace('/home');
      } else {
        alert(data.message);
      }
    } catch (error) {
      console.error(error);
      alert("Erro na conexão com a API");
    }
    /*if (email.toLowerCase() === 'aluno@fitclass.com' && password === '123456') {
      Alert.alert('Sucesso!', 'Login realizado com sucesso.');
    } else {
      Alert.alert('Erro', 'Email ou senha inválidos.');
    }*/
  };

  return (
    <>
     <Stack.Screen options={{ headerShown: false }} />
    <View style={styles.container}>
      <Text style={styles.title}>FITCLASS</Text>


      <StyledInput placeholder="EMAIL" value={email} onChangeText={setEmail} keyboardType="email-address" autoCapitalize="none" />
      <StyledInput placeholder="SENHA" value={password} onChangeText={setPassword} secureTextEntry />


      <StyledButton variant='primary' onPress={handleLogin}>
        Login
      </StyledButton>

      <StyledButton variant='secondary' onPress={() => router.push('/register')}>
        Registrar-se
      </StyledButton>

      <StyledButton variant='google' onPress={() => Alert.alert('Aviso', 'Funcionalidade ainda não implementada.')}>
        <Image source={require('../src/assets/google.png')} style={styles.googleIcon} />
        <Text style={styles.buttonTextGoogle}>Sign in with Google</Text>
        Login
      </StyledButton>

      <StyledButton variant="secondary" onPress={() => Alert.alert('Aviso', 'Funcionalidade ainda não implementada.')}>
        Recuperar Senha
      </StyledButton>
    </View>
    </>
  );
};

//Estilos
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#2B2727',
    justifyContent: 'center',
    paddingHorizontal: 30,
    paddingVertical: 25,
    gap: 15,
  },
  title: {
    fontSize: 48,
    color: '#FFF',
    textAlign: 'center',
    marginTop: 40,
    marginBottom: 50,
    fontWeight: '300',
  },
  input: {
    backgroundColor: '#4A4A4A',
    color: '#888',
    borderRadius: 8,
    paddingVertical: 15,
    paddingHorizontal: 20,
    marginBottom: 15,
    fontSize: 16,
  },
  buttonPrimary: {
    backgroundColor: '#1E1E1E',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 15,
  },
  buttonTextPrimary: {
    color: '#888',
    fontSize: 16,
    fontWeight: 'bold',
  },
  buttonSecondary: {
    backgroundColor: '#1E1E1E',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 15,
  },
  buttonTextSecondary: {
    color: '#888',
    fontSize: 16,
    fontWeight: 'bold',
  },
  buttonTertiary: {
    backgroundColor: '#4A4A4A',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 15,
  },
  buttonTextTertiary: {
    color: '#FFF',
    fontSize: 16,
  },
  buttonGoogle: {
    backgroundColor: '#FFF',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 50,
  },
  buttonTextGoogle: {
    color: '#000',
    fontSize: 16,
    fontWeight: 'bold',
  },
  googleIcon: {
    width: 20,
    height: 20,
    marginRight: 10,
  }
});

export default LoginScreen;