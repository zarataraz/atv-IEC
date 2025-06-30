import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Alert,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { tarefasService } from '../services/api';

const EditarTarefaScreen = ({ navigation, route }) => {
  const { tarefa } = route.params;
  console.log('📝 Tela de edição carregada com tarefa:', tarefa);
  
  const [descricao, setDescricao] = useState(tarefa.descricao);
  const [status, setStatus] = useState(tarefa.status);
  const [loading, setLoading] = useState(false);

  const salvarAlteracoes = async () => {
    console.log('💾 Tentando salvar alterações para tarefa:', tarefa.id);
    if (!descricao.trim()) {
      Alert.alert('Erro', 'Por favor, insira uma descrição para a tarefa');
      return;
    }

    try {
      setLoading(true);
      console.log('💾 Enviando dados para API:', { descricao: descricao.trim(), status });
      await tarefasService.atualizarTarefa(tarefa.id, {
        descricao: descricao.trim(),
        status: status,
      });
      console.log('✅ Tarefa atualizada com sucesso');

      Alert.alert('Sucesso', 'Tarefa atualizada com sucesso!', [
        {
          text: 'OK',
          onPress: () => {
            navigation.goBack();
          },
        },
      ]);
    } catch (error) {
      console.error('❌ Erro ao atualizar tarefa:', error);
      Alert.alert('Erro', 'Não foi possível atualizar a tarefa');
    } finally {
      setLoading(false);
    }
  };

  const verificarMudancas = () => {
    return descricao !== tarefa.descricao || status !== tarefa.status;
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.botaoVoltar}
            onPress={() => navigation.goBack()}
          >
            <Ionicons name="arrow-back" size={24} color="#007AFF" />
          </TouchableOpacity>
          <Text style={styles.titulo}>Editar Tarefa</Text>
          <View style={styles.placeholder} />
        </View>

        <ScrollView style={styles.conteudo} showsVerticalScrollIndicator={false}>
          <View style={styles.secao}>
            <Text style={styles.label}>Descrição da Tarefa</Text>
            <TextInput
              style={styles.input}
              value={descricao}
              onChangeText={setDescricao}
              placeholder="Digite a descrição da tarefa..."
              multiline
              numberOfLines={4}
              maxLength={200}
              textAlignVertical="top"
            />
            <Text style={styles.contador}>
              {descricao.length}/200 caracteres
            </Text>
          </View>

          <View style={styles.secao}>
            <Text style={styles.label}>Status</Text>
            <View style={styles.opcoesStatus}>
              <TouchableOpacity
                style={[
                  styles.opcaoStatus,
                  status === 'pendente' && styles.opcaoStatusAtiva,
                ]}
                onPress={() => setStatus('pendente')}
              >
                <View style={[
                  styles.radio,
                  status === 'pendente' && styles.radioAtivo
                ]} />
                <Text style={[
                  styles.opcaoTexto,
                  status === 'pendente' && styles.opcaoTextoAtivo
                ]}>
                  Pendente
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.opcaoStatus,
                  status === 'completa' && styles.opcaoStatusAtiva,
                ]}
                onPress={() => setStatus('completa')}
              >
                <View style={[
                  styles.radio,
                  status === 'completa' && styles.radioAtivo
                ]} />
                <Text style={[
                  styles.opcaoTexto,
                  status === 'completa' && styles.opcaoTextoAtivo
                ]}>
                  Completa
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.secao}>
            <TouchableOpacity
              style={[
                styles.botaoSalvar,
                (!descricao.trim() || loading || !verificarMudancas()) && styles.botaoSalvarDesabilitado
              ]}
              onPress={salvarAlteracoes}
              disabled={!descricao.trim() || loading || !verificarMudancas()}
            >
              {loading ? (
                <Text style={styles.botaoSalvarTexto}>Salvando...</Text>
              ) : (
                <Text style={styles.botaoSalvarTexto}>Salvar Alterações</Text>
              )}
            </TouchableOpacity>
          </View>

          <View style={styles.secao}>
            <View style={styles.infoTarefa}>
              <Text style={styles.infoLabel}>ID da Tarefa:</Text>
              <Text style={styles.infoValor}>{tarefa.id}</Text>
            </View>
            <View style={styles.infoTarefa}>
              <Text style={styles.infoLabel}>Criada em:</Text>
              <Text style={styles.infoValor}>
                {new Date().toLocaleDateString('pt-BR')}
              </Text>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F2F2F7',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5EA',
  },
  botaoVoltar: {
    padding: 4,
  },
  titulo: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1C1C1E',
  },
  placeholder: {
    width: 32,
  },
  conteudo: {
    flex: 1,
    padding: 20,
  },
  secao: {
    marginBottom: 24,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1C1C1E',
    marginBottom: 8,
  },
  input: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    color: '#1C1C1E',
    borderWidth: 1,
    borderColor: '#E5E5EA',
    minHeight: 100,
  },
  contador: {
    fontSize: 12,
    color: '#8E8E93',
    textAlign: 'right',
    marginTop: 4,
  },
  opcoesStatus: {
    backgroundColor: 'white',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E5EA',
    overflow: 'hidden',
  },
  opcaoStatus: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5EA',
  },
  opcaoStatusAtiva: {
    backgroundColor: '#F0F8FF',
  },
  radio: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#C7C7CC',
    marginRight: 12,
  },
  radioAtivo: {
    borderColor: '#007AFF',
    backgroundColor: '#007AFF',
  },
  opcaoTexto: {
    fontSize: 16,
    color: '#1C1C1E',
  },
  opcaoTextoAtivo: {
    color: '#007AFF',
    fontWeight: '500',
  },
  botaoSalvar: {
    backgroundColor: '#007AFF',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
  },
  botaoSalvarDesabilitado: {
    backgroundColor: '#C7C7CC',
  },
  botaoSalvarTexto: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  infoTarefa: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 12,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#E5E5EA',
  },
  infoLabel: {
    fontSize: 14,
    color: '#8E8E93',
  },
  infoValor: {
    fontSize: 14,
    color: '#1C1C1E',
    fontWeight: '500',
  },
});

export default EditarTarefaScreen; 