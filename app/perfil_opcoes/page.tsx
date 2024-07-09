'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { PencilSquare, Trash, Eye, EyeSlash } from 'react-bootstrap-icons';
import { supabase } from '../../utils/supabase/client';

type PerfilOpcao = {
  id: string;
  opcao: string;
  visivel: boolean;
};

const PerfilOpcoesPage = () => {
  const [perfilOpcoes, setPerfilOpcoes] = useState<PerfilOpcao[]>([]);
  const [newOption, setNewOption] = useState('');
  const [editingOption, setEditingOption] = useState<PerfilOpcao | null>(null);
  const [user, setUser] = useState<any>(null);
  const [estabelecimentoId, setEstabelecimentoId] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchUserData = async () => {
      const { data: { user }, error } = await supabase.auth.getUser();
      if (error) {
        router.push('/');
        return;
      }

      setUser(user);

      const { data: estabelecimentoData, error: estabelecimentoError } = await supabase
        .from('profissionais')
        .select('estabelecimento_id')
        .eq('email', user.email)
        .single();

      if (estabelecimentoError) {
        console.error('Erro ao buscar dados do estabelecimento:', estabelecimentoError.message);
        return;
      }

      setEstabelecimentoId(estabelecimentoData.estabelecimento_id);
    };

    fetchUserData();
  }, [router]);

  useEffect(() => {
    const fetchPerfilOpcoes = async () => {
      if (!estabelecimentoId) return;

      const { data, error } = await supabase
        .from('perfis_opcoes')
        .select('*')
        .eq('estabelecimento_id', estabelecimentoId)
        .order('opcao', { ascending: true });

      if (error) {
        console.error('Erro ao buscar opções de perfil:', error.message);
        return;
      }

      if (data) {
        setPerfilOpcoes(data as PerfilOpcao[]);
      }
    };

    fetchPerfilOpcoes();
  }, [estabelecimentoId]);

  const handleAddOption = async () => {
    if (newOption.trim() === '') return;
  
    // Verificar se já existe uma opção com o mesmo nome
    const { data: existingOptions, error: existingOptionsError } = await supabase
      .from('perfis_opcoes')
      .select('id')
      .eq('opcao', newOption)
      .eq('estabelecimento_id', estabelecimentoId);
  
    if (existingOptionsError) {
      setNewOption('');  
      toast.error('Erro ao verificar opções existentes');
      return;
    }
  
    if (existingOptions.length > 0) {
      setNewOption('');  
      toast.error('Já existe uma opção com este nome');
      return;
    }
  
    // Se não existir, inserir a nova opção
    const { data, error } = await supabase
      .from('perfis_opcoes')
      .insert([{ opcao: newOption, visivel: true, estabelecimento_id: estabelecimentoId }])
      .select();
  
    if (error) {
      setNewOption('');  
      toast.error('Erro ao adicionar opção de perfil');
      return;
    }
  
    if (data) {
      const updatedOpcoes = [...perfilOpcoes, data[0] as PerfilOpcao].sort((a, b) => a.opcao.localeCompare(b.opcao));
      setPerfilOpcoes(updatedOpcoes);
      setNewOption('');  // Limpar o input após adicionar a nova opção
      toast.success('Opção de perfil adicionada com sucesso');
    } else {
    }
  };
    
      
  const handleEditOption = (opcao: PerfilOpcao) => {
    setNewOption(opcao.opcao);
    setEditingOption(opcao);
  };

  const handleUpdateOption = async () => {
    if (newOption.trim() === '' || !editingOption) return;

    const { error } = await supabase
      .from('perfis_opcoes')
      .update({ opcao: newOption })
      .eq('id', editingOption.id)
      .eq('estabelecimento_id', estabelecimentoId);

    if (error) {
      toast.error('Erro ao atualizar opção de perfil');
      return;
    }

    const updatedOpcoes = perfilOpcoes.map((item) =>
      item.id === editingOption.id ? { ...item, opcao: newOption } : item
    ).sort((a, b) => a.opcao.localeCompare(b.opcao));

    setPerfilOpcoes(updatedOpcoes);
    setNewOption('');
    setEditingOption(null);
    toast.success('Opção de perfil atualizada com sucesso');

    // Atualizar a tabela profissionais
    await supabase
      .from('profissionais')
      .update({ perfil: newOption })
      .eq('perfil', editingOption.opcao)
      .eq('estabelecimento_id', estabelecimentoId);
  };

  const handleDeleteOption = async (id: string, nome: string) => {
    const { data: profissionaisData, error: profissionaisError } = await supabase
      .from('profissionais')
      .select('id')
      .eq('perfil', nome)
      .eq('estabelecimento_id', estabelecimentoId);

    if (profissionaisError) {
      toast.error('Erro ao verificar profissionais');
      return;
    }

    if (profissionaisData.length > 0) {
      toast.error('Não é possível deletar. Existem profissionais utilizando este perfil.');
      return;
    }

    const { error: deleteError } = await supabase
      .from('perfis_opcoes')
      .delete()
      .eq('opcao', nome)
      .eq('estabelecimento_id', estabelecimentoId);

    if (deleteError) {
      toast.error('Erro ao deletar opção de perfil');
      return;
    }

    const updatedOpcoes = perfilOpcoes.filter((item) => item.id !== id);
    setPerfilOpcoes(updatedOpcoes);
    toast.success('Opção de perfil deletada com sucesso');
  };

  const handleToggleVisibility = async (opcao: PerfilOpcao) => {
    const { error } = await supabase
      .from('perfis_opcoes')
      .update({ visivel: !opcao.visivel })
      .eq('id', opcao.id)
      .eq('estabelecimento_id', estabelecimentoId);

    if (error) {
      toast.error('Erro ao atualizar visibilidade');
      return;
    }

    const updatedOpcoes = perfilOpcoes.map((item) =>
      item.id === opcao.id ? { ...item, visivel: !opcao.visivel } : item
    );
    setPerfilOpcoes(updatedOpcoes);
  };

  return (
    <div className="perfil-opcoes-container">
      <button className="perfil-opcoes-btn-back" onClick={() => router.back()}>Voltar</button>
      <div className="perfil-opcoes-body">
        <ToastContainer />
        <h2>Gerenciar Opções de Perfil</h2>
        <div className="perfil-opcoes-form">
          <input
            type="text"
            className="perfil-opcoes-input"
            id="newOption"
            value={newOption}
            onChange={(e) => setNewOption(e.target.value)}
            placeholder="Nova Opção de Perfil"
          />
          <button
            className="perfil-opcoes-button"
            onClick={editingOption ? handleUpdateOption : handleAddOption}
          >
            {editingOption ? 'Atualizar' : 'Adicionar'}
          </button>
        </div>
        <ul className="perfil-opcoes-list">
          {perfilOpcoes.map((opcao) => (
            <li key={opcao.id} className="perfil-opcoes-list-item">
              <span className={`perfil-opcoes-text ${!opcao.visivel ? 'perfil-opcoes-text-hidden' : ''}`}>
                {opcao.opcao}
              </span>
              <div className="perfil-opcoes-buttons">
                <button
                  className={`perfil-opcoes-visibility-btn ${opcao.visivel ? 'perfil-opcoes-btn-green' : 'perfil-opcoes-btn-gray'}`}
                  onClick={() => handleToggleVisibility(opcao)}
                  style={{
                    backgroundColor: opcao.visivel ? '#28a745' : '#6c757d', // Verde para visível, cinza para não visível
                    borderRadius: '4px',
                    padding: '4px',
                    width: '30px',
                    height: '30px'
                  }}
                >
                  {opcao.visivel ? <Eye size={18} style={{ fill: 'white', transform: 'scale(0.8)' }} /> : <EyeSlash size={18} style={{ fill: 'white', transform: 'scale(0.8)' }} />}
                </button>
                <button
                  className="perfil-opcoes-edit-btn"
                  onClick={() => handleEditOption(opcao)}
                  style={{
                    backgroundColor: '#007bff', // Azul
                    borderRadius: '4px',
                    padding: '4px',
                    width: '30px',
                    height: '30px'
                  }}
                >
                  <PencilSquare size={18} style={{ fill: 'white', transform: 'scale(0.8)' }} />
                </button>
                <button
                  className="perfil-opcoes-delete-btn"
                  onClick={() => handleDeleteOption(opcao.id, opcao.opcao)}
                  style={{
                    backgroundColor: '#dc3545', // Vermelho
                    borderRadius: '4px',
                    padding: '4px',
                    width: '30px',
                    height: '30px'
                  }}
                >
                  <Trash size={18} style={{ fill: 'white', transform: 'scale(0.8)' }} />
                </button>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
  };

export default PerfilOpcoesPage;
