import React, { useEffect, useState } from 'react';
import {View, ScrollView,FlatList, Pressable, Linking} from 'react-native'
import styled from 'styled-components';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Pagina = styled.View`
  flex: 1;
  background-color: #d3d3d3;
`;

const Cabecalho = styled.View`
  height: 60px;
  background-color: #1827AC;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
`;

const Busca = styled.TextInput`
  padding: 15px;
  color: #FFF;
  font-size: 20px;
`;

const Botao = styled.TouchableOpacity`
  padding-right: 15px;
`;

const TouchBuscar = styled.Image`
  width: 30px;
  height: 30px;
`;

const ViewImagem = styled.View`
  padding: 10px;
  align-items: center;
`;

const Avatar = styled.Image`
  height: 200px;
  width: 200px;
  border-radius: 200px;
  border: 1px #000; 
`;

const ImageGit = styled.Image`
  margin-top: 25%;
  height: 300px;
  width: 300px;
`


const ViewTexto = styled.View`
  align-items: center;
  padding: 1px;
  padding-bottom: 20px;
`;

const TextoTitulo = styled.Text`
  font-size: 24px;
  color: #000;
  font-weight: bold;
`;

const TextoSubtitulo = styled.Text`
  color: #000;
  font-size: 18px;
  font-style: italic;
  font-weight: bold;
` 

const ViewRepositorios = styled.View`
  padding: 15px;
  border: 3px solid #FFF;
  border-radius: 20px;
  background-color: #c0c0c0;
  align-items: center;
  margin-left: 1%;
  margin-right: 1%;
  flex-direction: column;
`;

const Item = ({ name, description, language, item}) => (
    <Pressable onPress={() => Linking.openURL(`${item}`)}>
      <ViewRepositorios>
        <TextoTitulo>{name}</TextoTitulo>
        <TextoSubtitulo>{description}</TextoSubtitulo>
        <TextoSubtitulo>{language}</TextoSubtitulo>
      </ViewRepositorios>
    </Pressable>
);


const App = () => {
  const salvarStorageUsuario = async (users) => {
    try {
      const jsonUsers = JSON.stringify(users)
      await AsyncStorage.setItem('@users', jsonUsers)
    }catch(ex){
      console.log("Erro");
    }
  }
  
  const getStorageUsuario = async () => {
    try {
      const dadoUsuario = await AsyncStorage.getItem('@users')
      if (dadoUsuario !== null){
        alteraUsuario(JSON.parse(dadoUsuario))
        alteraNome(JSON.parse(dadoUsuario))
      }
    }catch(ex){
      console.log("Erro");
    }
  }

  const salvarStorageRepositorio = async (r) => {
    try {
      const jsonRepositorios = JSON.stringify(r)
      await AsyncStorage.setItem('@repositorios', jsonRepositorios)
    } catch (ex) {
      console.log("erro");
    } 
  }
  
  const getStorageRepositorio = async () => {
    try {
      const r = await AsyncStorage.getItem('@repositorios')
      if (r !== null){
        alteraRepositorio(JSON.parse(r))
      }
    } catch (error) {
      console.log("erro get rep");
    } 
  }

  const salvarStorageNome = async (nome) => {
    try {
      if (nome !== null){
        await AsyncStorage.setItem('@nome', nome)
      }
    } catch (error) {
      console.log("Erro")
    }
    
  }

  const getStorageNome = async () => {
    try {
      const nome = await AsyncStorage.getItem('@nome')
      alteraNome(nome);
    } catch(e) {
      console.log("Erro")
    }
  }

  useEffect(() => {
    getStorageRepositorio();
    getStorageUsuario();
    getStorageNome();
  }, [])
 
  const [nome, alteraNome] = useState("")
  const [usuario, alteraUsuario] = useState({})
  const [repositorios , alteraRepositorio] = useState({})
 
  const renderItem = ({ item }) => (
    <Item name={item.name} description={item.description} language={item.language} item={item.html_url}/>
  ); 

  const buscarUsuario = async () => {
    try {  
      const requisicao = await fetch(
        `https://api.github.com/users/${nome}`, 
      );
      const  res = await requisicao.json();
      alteraUsuario(res);
      buscaRepositorio();
      salvarStorageNome(nome);
      salvarStorageUsuario(res)
    }catch(ex){
      console.log("erro");
    }
  
  }

  const buscaRepositorio = async () => {
      const rep = await fetch(
        `https://api.github.com/users/${nome}/repos`, 
      );
      const  repos = await rep.json();
      alteraRepositorio(repos)
      salvarStorageRepositorio(repos)
  }

  return (
    <Pagina>
      <Cabecalho>
        <Busca placeholder="Digite o nome do usuario..." 
          placeholderTextColor="#FFF" 
          value={nome}
          onChangeText={(nomeusuario) => alteraNome(nomeusuario)}
        />
        <Botao onPress={buscarUsuario}>
          <TouchBuscar source={require("./src/img/buscar.png")}/>
        </Botao>
      </Cabecalho>
      { usuario.name == null &&
        <ViewImagem>
          <ImageGit source={require("./src/img/github3.png")}/>
          <TextoTitulo>GitHub</TextoTitulo>
        </ViewImagem>
        
      }
      { repositorios.length > 0 &&
        <ScrollView>
          <ViewImagem>
            <Avatar source={{uri: usuario.avatar_url}}/>
          </ViewImagem> 
          <ViewTexto>
            <TextoTitulo>{usuario.name}</TextoTitulo>
            <TextoSubtitulo>{usuario.bio}</TextoSubtitulo>
            <TextoSubtitulo>{usuario.location} | {usuario.login}</TextoSubtitulo>
          </ViewTexto>
          <FlatList
            data={repositorios}
            renderItem={renderItem}
            keyExtractor={item => item.id.toString()}
          />
        </ScrollView>
      }
            
    </Pagina>
  )
}

export default App;
