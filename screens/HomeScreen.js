import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Alert,
  TextInput,
  SafeAreaView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { tarefasService } from '../services/api';
import { useFocusEffect } from '@react-navigation/native';

const HomeScreen = ({ navigation }) => {
  const [tarefas, setTarefas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filtro, setFiltro] = useState('todas'); // todas, pendentes, completas

  // Recarrega as tarefas sempre que a tela recebe foco
  useFocusEffect( 
    React.useCallback(() => {
      carregarTarefas();
    }, [])
  );

  useEffect(() => {
    carregarTarefas();
  }, []);

  const carregarTarefas = async () => {
    try {
      setLoading(true);
      const tarefasData = await tarefasService.listarTarefas();
      setTarefas(tarefasData);
    } catch (error) {
      console.error('Erro ao carregar tarefas:', error);
      Alert.alert('Erro', 'Não foi possível carregar as tarefas');
    } finally {
      setLoading(false);
    }
  };

  const deletarTarefa = async (id) => {
    console.log('🗑️ Tentando excluir tarefa com ID:', id);
    try {
      console.log('🗑️ Executando exclusão da tarefa:', id);
      await tarefasService.excluirTarefa(id);
      console.log('✅ Tarefa excluída com sucesso');
      carregarTarefas();
      Alert.alert('Sucesso', 'Tarefa excluída com sucesso!');
    } catch (error) {
      console.error('❌ Erro ao excluir tarefa:', error);
      Alert.alert('Erro', 'Não foi possível excluir a tarefa');
    }
  };

  const alternarStatus = async (tarefa) => {
    try {
      console.log('🔄 Alternando status da tarefa:', tarefa.id);
      await tarefasService.alternarStatus(tarefa);
      console.log('✅ Status alternado com sucesso');
      carregarTarefas();
    } catch (error) {
      console.error('❌ Erro ao atualizar status:', error);
      Alert.alert('Erro', 'Não foi possível atualizar o status da tarefa');
    }
  };

  const navegarParaEditar = (tarefa) => {
    console.log('✏️ Navegando para editar tarefa:', tarefa);
    navigation.navigate('EditarTarefa', { tarefa: tarefa });
  };

  const tarefasFiltradas = tarefas.filter((tarefa) => {
    if (filtro === 'todas') return true;
    if (filtro === 'pendentes') return tarefa.status === 'pendente';
    if (filtro === 'completas') return tarefa.status === 'completa';
    return true;
  });

  const renderTarefa = ({ item }) => (
    <View style={[styles.tarefaItem, item.status === 'completa' && styles.tarefaCompleta]}>
      <TouchableOpacity
        style={styles.tarefaConteudo}
        onPress={() => alternarStatus(item)}
      >
        <View style={styles.tarefaInfo}>
          <Text style={[
            styles.tarefaDescricao,
            item.status === 'completa' && styles.tarefaDescricaoCompleta
          ]}>
            {item.descricao}
          </Text>
          <Text style={[
            styles.tarefaStatus,
            item.status === 'completa' ? styles.statusCompleta : styles.statusPendente
          ]}>
            {item.status === 'completa' ? '✓ Completa' : '○ Pendente'}
          </Text>
        </View>
      </TouchableOpacity>
      
      <View style={styles.tarefaAcoes}>
        <TouchableOpacity
          style={styles.botaoAcao}
          onPress={() => navegarParaEditar(item)}
        >
          <Ionicons name="pencil" size={20} color="#007AFF" />
        </TouchableOpacity>
        
        <TouchableOpacity
          style={styles.botaoAcao}
          onPress={() => {
            console.log('🗑️ Botão de excluir clicado para tarefa:', item.id);
            deletarTarefa(item.id);
          }}
        >
          <Ionicons name="trash" size={20} color="#FF3B30" />
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.titulo}>Minhas Tarefas</Text>
        <TouchableOpacity
          style={styles.botaoAdicionar}
          onPress={() => navigation.navigate('NovaTarefa')}
        >
          <Ionicons name="add" size={24} color="white" />
        </TouchableOpacity>
      </View>

      <View style={styles.filtros}>
        <TouchableOpacity
          style={[styles.filtroBotao, filtro === 'todas' && styles.filtroAtivo]}
          onPress={() => setFiltro('todas')}
        >
          <Text style={[styles.filtroTexto, filtro === 'todas' && styles.filtroTextoAtivo]}>
            Todas
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[styles.filtroBotao, filtro === 'pendentes' && styles.filtroAtivo]}
          onPress={() => setFiltro('pendentes')}
        >
          <Text style={[styles.filtroTexto, filtro === 'pendentes' && styles.filtroTextoAtivo]}>
            Pendentes
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[styles.filtroBotao, filtro === 'completas' && styles.filtroAtivo]}
          onPress={() => setFiltro('completas')}
        >
          <Text style={[styles.filtroTexto, filtro === 'completas' && styles.filtroTextoAtivo]}>
            Completas
          </Text>
        </TouchableOpacity>
      </View>

      {loading ? (
        <View style={styles.centro}>
          <Text style={styles.textoCarregando}>Carregando tarefas...</Text>
        </View>
      ) : tarefasFiltradas.length === 0 ? (
        <View style={styles.centro}>
          <Ionicons name="list-outline" size={64} color="#C7C7CC" />
          <Text style={styles.textoVazio}>
            {filtro === 'todas' ? 'Nenhuma tarefa encontrada' : `Nenhuma tarefa ${filtro}`}
          </Text>
        </View>
      ) : (
        <FlatList
          data={tarefasFiltradas}
          renderItem={renderTarefa}
          keyExtractor={(item) => item.id.toString()}
          style={styles.lista}
          showsVerticalScrollIndicator={false}
        />
      )}
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
  titulo: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1C1C1E',
  },
  botaoAdicionar: {
    backgroundColor: '#007AFF',
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
  },
  filtros: {
    flexDirection: 'row',
    padding: 16,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5EA',
  },
  filtroBotao: {
    flex: 1,
    paddingVertical: 8,
    paddingHorizontal: 16,
    marginHorizontal: 4,
    borderRadius: 20,
    backgroundColor: '#F2F2F7',
  },
  filtroAtivo: {
    backgroundColor: '#007AFF',
  },
  filtroTexto: {
    textAlign: 'center',
    color: '#8E8E93',
    fontWeight: '500',
  },
  filtroTextoAtivo: {
    color: 'white',
  },
  lista: {
    flex: 1,
  },
  tarefaItem: {
    backgroundColor: 'white',
    marginHorizontal: 16,
    marginVertical: 4,
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  tarefaCompleta: {
    opacity: 0.7,
  },
  tarefaConteudo: {
    flex: 1,
  },
  tarefaInfo: {
    flex: 1,
  },
  tarefaDescricao: {
    fontSize: 16,
    color: '#1C1C1E',
    marginBottom: 4,
  },
  tarefaDescricaoCompleta: {
    textDecorationLine: 'line-through',
    color: '#8E8E93',
  },
  tarefaStatus: {
    fontSize: 14,
    fontWeight: '500',
  },
  statusPendente: {
    color: '#FF9500',
  },
  statusCompleta: {
    color: '#34C759',
  },
  tarefaAcoes: {
    flexDirection: 'row',
    marginLeft: 16,
  },
  botaoAcao: {
    padding: 12,
    marginLeft: 8,
    minWidth: 44,
    minHeight: 44,
    justifyContent: 'center',
    alignItems: 'center',
  },
  centro: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  textoCarregando: {
    fontSize: 16,
    color: '#8E8E93',
  },
  textoVazio: {
    fontSize: 16,
    color: '#8E8E93',
    marginTop: 16,
    textAlign: 'center',
  },
});

export default HomeScreen; 