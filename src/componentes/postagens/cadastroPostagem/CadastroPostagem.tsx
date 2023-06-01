import React, { ChangeEvent, useEffect, useState } from "react";
import { Container, Typography, TextField, Button, Select, InputLabel, MenuItem, FormControl, FormHelperText } from "@material-ui/core";
import "./CadastroPostagem.css";
import { useNavigate, useParams } from "react-router-dom";
import Tema from "../../../models/Tema";
import Postagem from "../../../models/Postagem";
import { busca, buscaId, post, put } from "../../../service/Service";
import { useSelector } from "react-redux";
import { UserState } from "../../../store/token/Reducer";
import { toast } from "react-toastify";
import User from "../../../models/User";

function CadastroPostagem() {
  let navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [temas, setTemas] = useState<Tema[]>([]);


  const token = useSelector<UserState, UserState["tokens"]>(
    (state) => state.tokens
  );

  const userId = useSelector<UserState, UserState['id']>(
    (state) => state.id
  )

  useEffect(() => {
    if (token == "") {
      toast.error('Ops...Você precisa estar logado!!!', {
        position: "top-right",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: false,
        draggable: false,
        theme: "colored",
        progress: undefined,
      });
      navigate("/login");
    }
  }, [token]);

  const [tema, setTema] = useState<Tema>({
    id: 0,
    descricao: "",
    nome: ""
  });

  const [postagem, setPostagem] = useState<Postagem>({
    id: 0,
    titulo: "",
    texto: "",
    link: '',
    tema: null,
    usuario: null
  });

  const [user, setUser] = useState<User>({
    id: +userId,
    nomeUsuario: '',
    usuario: '',
    senha: '',
    tipoUsuario: '',
    foto: '',
  })

  useEffect(() => {
    setPostagem({
      ...postagem,
      tema: tema,
      usuario: user
    });
  }, [tema]);

  useEffect(() => {
    getTemas();
    if (id !== undefined) {
      findByIdPostagem(id);
    }
  }, [id]);

  async function getTemas() {
    await busca("/temas", setTemas, {
      headers: {
        Authorization: token,
      },
    });
  }

  async function findByIdPostagem(id: string) {
    await buscaId(`postagens/${id}`, setPostagem, {
      headers: {
        Authorization: token,
      },
    });
  }

  function updatedPostagem(e: ChangeEvent<HTMLInputElement>) {
    setPostagem({
      ...postagem,
      [e.target.name]: e.target.value,
      tema: tema,
    });
  }

  async function onSubmit(e: ChangeEvent<HTMLFormElement>) {
    e.preventDefault();

    if (id !== undefined) {
      try {
        await put(`/postagens`, postagem, setPostagem, {
          headers: {
            Authorization: token,
          },
        });
        toast.success('Postagem atualizada com sucesso!', {
          position: "top-right",
          autoClose: 2000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: false,
          draggable: false,
          theme: "colored",
          progress: undefined,
        });
      } catch (error) {
        console.log(`Erro: ${error}`);
        alert("Ops...Algo deu errado! Tente novamente!");
      }
    } else {
      try {
        await post(`/postagens`, postagem, setPostagem, {
          headers: {
            Authorization: token,
          },
        });
        toast.success('Postagem cadastrada com sucesso!', {
          position: "top-right",
          autoClose: 2000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: false,
          draggable: false,
          theme: "colored",
          progress: undefined,
        });
      } catch (error) {
        console.log(`Erro: ${error}`);
        alert("Ops... Algo deu errado! Tente novamente!");
      }
    }
    back();
  }

  function back() {
    navigate("/postagens");
  }

  return (
    <Container maxWidth="sm" className="topo cor-fundo box-post-cadastro" >
      <div className="form-wrapper">
        <div className="form-content">
          <form onSubmit={onSubmit}>
            <Typography
              variant="h3"
              style={{ color: "white" }}
              component="h1"
              align="center"
              className="texto-form-post"
            >
              Formulário de cadastro postagem
            </Typography>
            <TextField
              value={postagem.titulo}
              onChange={(e: ChangeEvent<HTMLInputElement>) => updatedPostagem(e)}
              id="titulo"
              label="Título da Postagem"
              variant="outlined"
              name="titulo"
              margin="normal"
              fullWidth
              InputProps={{
                className: 'white-text',
                style: { color: '#ffffff' }
              }}
              InputLabelProps={{
                style: { color: '#ffffff' },
              }}
            />
            <TextField
              value={postagem.texto}
              onChange={(e: ChangeEvent<HTMLInputElement>) => updatedPostagem(e)}
              id="texto"
              label="Digite o Texto"
              name="texto"
              className="formControl"
              variant="outlined"
              margin="normal"
              fullWidth
              InputProps={{
                className: 'white-text',
                style: { color: '#ffffff' }
              }}
              InputLabelProps={{
                style: { color: '#ffffff' },
              }}
            />
            <FormControl>
              <InputLabel id="demo-simple-select-helper-label" style={{ color: '#ffffff' }}>Tema </InputLabel>
              <Select
                labelId="demo-simple-select-helper-label"
                id="demo-simple-select-helper"
                onChange={(e) =>
                  buscaId(`/temas/${e.target.value}`, setTema, {
                    headers: {
                      Authorization: token,
                    },
                  })
                }
              >
                {temas.map((tema) => (
                  <MenuItem value={tema.id}>{tema.descricao}</MenuItem>
                ))}
              </Select>
              <FormHelperText style={{ color: "white" }}>
                Escolha um tema para a postagem
              </FormHelperText>
              <Button type="submit" variant="contained" className="finalizar-post">
                Finalizar
              </Button>
            </FormControl>
          </form>
        </div>
        <div className="image-wrapper">
        </div>
      </div>
    </Container>
  );
}
export default CadastroPostagem;
