'use client'
import React from 'react';
import { useRef, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '../../utils/supabase/client';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import MaskedInput from 'react-text-mask';
import { PersonCircle, Camera, PencilSquare } from 'react-bootstrap-icons';
import Sidebar from '../components/Sidebar';
import { v4 as uuidv4 } from 'uuid';

const Perfil: React.FC = () => {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [user, setUser] = useState<any>(null);
  const [nome, setNome] = useState<string>('');
  const [sexo, setSexo] = useState<string>('');
  const [perfil, setPerfil] = useState<string>('');
  const [telefone, setTelefone] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [administrador, setAdministrador] = useState<boolean>(false);
  const [estabelecimentoId, setEstabelecimentoId] = useState<string>('');
  const [perfilOpcoes, setPerfilOpcoes] = useState<string[]>([]);
  const [profileImage, setProfileImage] = useState<string>('');
  const [newImageFile, setNewImageFile] = useState<File | null>(null);
  const [newImageUrl, setNewImageUrl] = useState<string>('');

  useEffect(() => {
    const fetchData = async () => {
      const { data: { user }, error } = await supabase.auth.getUser();
      if (error) {
        router.push('/');
        return;
      }

      setUser(user);

      const isStep1 = localStorage.getItem('step1') === 'true';
      if (isStep1) {
        router.push('/step1');
        return;
      }

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

      const { data: perfilOpcoesData, error: perfilOpcoesError } = await supabase
        .from('perfis_opcoes')
        .select('opcao')
        .eq('estabelecimento_id', estabelecimentoData.estabelecimento_id);

      if (perfilOpcoesError) {
        console.error('Erro ao buscar opções de perfil:', perfilOpcoesError.message);
        return;
      }

      const perfilOpcoes = perfilOpcoesData.map(opcao => opcao.opcao);
      setPerfilOpcoes(perfilOpcoes);

      const { data: profileData, error: profileError } = await supabase
        .from('profissionais')
        .select('nome, sexo, perfil, telefone, administrador, imagem')
        .eq('estabelecimento_id', estabelecimentoData.estabelecimento_id)
        .single();

      if (profileError) {
        console.error('Erro ao buscar dados do perfil:', profileError.message);
        return;
      }

      setNome(profileData.nome || '');
      setSexo(profileData.sexo || '');
      setPerfil(profileData.perfil || '');
      setTelefone(profileData.telefone || '');
      setAdministrador(profileData.administrador || false);
      setEmail(user?.email || '');
      setProfileImage(profileData.imagem || '');
    };

    fetchData();
  }, []);

  const handleUpdate = async () => {
    if (!user) {
      router.push('/');
      return;
    }
    try {
      let imageUrlToUpdate = profileImage;

      if (newImageFile) {
        const uniqueFileName = `${uuidv4()}-${newImageFile.name}`;

        const { error: uploadError } = await supabase.storage
          .from('profiles')
          .upload(`public/${uniqueFileName}`, newImageFile);

        if (uploadError) {
          console.error('Erro ao fazer upload da imagem:', uploadError.message);
          toast.error('Erro ao fazer upload da imagem');
          return;
        }

        const { data: publicUrlData } = supabase.storage
          .from('profiles')
          .getPublicUrl(`public/${uniqueFileName}`);

        imageUrlToUpdate = publicUrlData.publicUrl;

        if (profileImage) {
          const previousImagePath = profileImage.replace(`${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/profiles/`, '');
          const { error: deleteError } = await supabase.storage
            .from('profiles')
            .remove([previousImagePath]);

          if (deleteError) {
            console.error('Erro ao remover a imagem anterior:', deleteError.message);
          }
        }
      }

      const updates = {
        nome,
        sexo,
        perfil,
        telefone,
        email,
        administrador,
        imagem: imageUrlToUpdate,
      };

      const { error } = await supabase
        .from('profissionais')
        .update(updates)
        .eq('email', user.email);

      if (error) throw error;

      setProfileImage(imageUrlToUpdate); // Atualiza a imagem de perfil no estado
      setNewImageFile(null); // Reseta o arquivo de imagem selecionado

      toast.success('Perfil atualizado com sucesso!', {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
      });
    } catch (error) {
      console.error('Erro ao atualizar perfil:', error.message);
      toast.error('Erro ao atualizar perfil. Tente novamente.', {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
      });
    }
  };

  const handleDelete = async () => {
    if (!user) {
      router.push('/');
      return;
    }
    try {
      if (!confirm('Tem certeza de que deseja deletar sua conta? Esta ação não pode ser desfeita.')) {
        return;
      }

      await supabase
        .from('perfis_opcoes')
        .delete()
        .eq('estabelecimento_id', estabelecimentoId);

      await supabase
        .from('categorias_opcoes')
        .delete()
        .eq('estabelecimento_id', estabelecimentoId);

      await supabase
        .from('servicos_opcoes')
        .delete()
        .eq('estabelecimento_id', estabelecimentoId);

      await supabase
        .from('agendamentos')
        .delete()
        .eq('estabelecimento_id', estabelecimentoId);

      await supabase
        .from('clientes')
        .delete()
        .eq('estabelecimento_id', estabelecimentoId);

      await supabase
        .from('servicos')
        .delete()
        .eq('estabelecimento_id', estabelecimentoId);

      const { data: profissionais } = await supabase
        .from('profissionais')
        .select('imagem')
        .eq('estabelecimento_id', estabelecimentoId);

      const imageUrl = profissionais.map((profissional: { imagem: string }) => profissional.imagem).filter(Boolean);

      const deletePromises = imageUrl.map(url => {
        const path = url.replace(`${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/profiles/`, '');
        return supabase.storage.from('profiles').remove([path]);
      });

      const results = await Promise.all(deletePromises);
      const errors = results.filter(result => result.error);

      if (errors.length > 0) {
        throw new Error('Failed to delete some images');
      }

      await supabase
        .from('profissionais')
        .delete()
        .eq('estabelecimento_id', estabelecimentoId);

      await supabase
        .from('estabelecimentos')
        .delete()
        .eq('id', estabelecimentoId);

      const response = await fetch('/api/deleteUser', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId: user.id }),
      });

      if (!response.ok) {
        throw new Error('Failed to delete user');
      }

      await supabase.auth.signOut();

      toast.success('Conta deletada com sucesso!', {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
      });

      router.push('/');
    } catch (error) {
      console.error('Erro ao deletar conta:', error.message);
      toast.error('Erro ao deletar conta. Tente novamente.', {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
      });
    }
  };

  const handleCameraClick = () => {
    if (!user) {
      router.push('/');
      return;
    }
    fileInputRef.current.click();
  };

  const handleFileChange = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    if (profileImage) {
      const previousImagePath = profileImage.replace(`${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/profiles/`, '');
      const { error: deleteError } = await supabase.storage
        .from('profiles')
        .remove([previousImagePath]);

      if (deleteError) {
        console.error('Erro ao remover a imagem anterior:', deleteError.message);
        toast.error('Erro ao remover a imagem anterior', {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
        });
        return;
      }
    }

    setNewImageFile(file);
    const imageUrl = URL.createObjectURL(file);
    setNewImageUrl(imageUrl);

    toast.success('Imagem carregada com sucesso!', {
      position: "top-right",
      autoClose: 5000,
      hideProgressBar: false,
    });
  };

  const handlePerfilOpcoes = () => {
    sessionStorage.setItem('returnTo', 'perfil');
    router.push('/perfil_opcoes');
  };

  return (
    <div className="profile-container">
      <Sidebar />
      <div className="profile-body">
        <h2 className="profile-align-left">Perfil</h2>
        <div className="profile-image-container">
          {newImageUrl ? (
            <img src={newImageUrl} alt="Profile" className="profile-image" />
          ) : (
            profileImage ? (
              <img src={profileImage} alt="Profile" className="profile-image" />
            ) : (
              <PersonCircle className="profile-image" />
            )
          )}
          <button className="profile-upload-icon-button" onClick={handleCameraClick}>
            <Camera className="profile-upload-icon-svg" />
          </button>
          <input
            type="file"
            ref={fileInputRef}
            style={{ display: 'none' }}
            onChange={handleFileChange}
          />
        </div>
        <form onSubmit={(e) => { e.preventDefault(); handleUpdate(); }}>
          <div className="profile-mb-3">
            <label htmlFor="nome" className="profile-form-label">Nome</label>
            <input
              type="text"
              className="profile-form-control profile-common-style w-100"
              id="nome"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              required
            />
          </div>
          <div className="profile-mb-3">
            <label htmlFor="sexo" className="profile-form-label">Sexo</label>
            <select
              className="profile-form-control profile-common-style w-100"
              id="sexo"
              value={sexo}
              onChange={(e) => setSexo(e.target.value)}
              required
            >
              <option value="" disabled>Selecione o sexo</option>
              <option value="Masculino">Masculino</option>
              <option value="Feminino">Feminino</option>
              <option value="Prefiro não informar">Prefiro não informar</option>
            </select>
          </div>





          <div className="profile-mb-3">
            <label htmlFor="perfil" className="profile-form-label">Perfil</label>
            <div className="d-flex align-items-center position-relative">
              <select
                className="profile-form-control profile-common-style"
                id="perfil"
                value={perfil}
                onChange={(e) => setPerfil(e.target.value)}
                required
              >
                <option value="" disabled>Selecione um perfil</option>
                {perfilOpcoes.map((opcao, index) => (
                  <option key={index} value={opcao}>{opcao}</option>
                ))}
              </select>
              <button
                type="button"
                className="btn btn-link p-0 d-flex align-items-center justify-content-center profile-edit-btn position-absolute"
                onClick={handlePerfilOpcoes}
                style={{
                  right: '-35px', // Ajuste conforme necessário
                  top: '50%',
                  transform: 'translateY(-50%)',
                }}
              >
                <PencilSquare size={18} style={{ fill: 'white', transform: 'scale(0.8)' }} />
              </button>
            </div>
          </div>

          <div className="profile-mb-3">
            <label htmlFor="telefone" className="profile-form-label">Telefone</label>
            <MaskedInput
              mask={['(', /[1-9]/, /\d/, ')', ' ', /\d/, /\d/, /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/]}
              className="profile-form-control profile-common-style w-100 telefone-input"
              id="telefone"
              value={telefone}
              onChange={(e) => setTelefone(e.target.value)}
              required
            />
          </div>
          <div className="profile-mb-3">
            <label htmlFor="email" className="profile-form-label">Email</label>
            <input
              type="email"
              className="profile-form-control profile-common-style w-100 profile-readonly"
              id="email"
              value={email}
              disabled
              readOnly
            />
          </div>
          <div className="profile-mb-3">
            <label htmlFor="administrador" className="profile-form-label">Administrador</label>
            <input
              type="text"
              className="profile-form-control profile-common-style w-100 profile-readonly"
              id="administrador"
              value={administrador ? 'Sim' : 'Não'}
              disabled
              readOnly
            />
          </div>
          <button
            type="submit"
            className="profile-btn-primary w-100"
          >
            Atualizar
          </button>
        </form>
        <h3 className="profile-align-left mt-4">Deletar conta</h3>
        <button className="profile-delete-btn w-100" onClick={handleDelete}>Deletar</button>
      </div>
      <ToastContainer />
    </div>
  );


};
export default Perfil;
