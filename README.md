# 🥋 BJJ Timer - Cronômetro Oficial para Tatame de Jiu-Jitsu

Aplicativo moderno e ultrarrápido desenvolvido especialmente para academias de Jiu-Jitsu (BJJ), projetado para visualização em **Smart TVs**, controle em **Celulares/Tablets** e operação em **Computadores**.

---

## 🚀 Como Executar o Projeto

### Pré-requisitos:
- [Node.js](https://nodejs.org/) instalado (versão 18 ou superior).

### 1. Iniciar o Servidor de Desenvolvimento:
No terminal, dentro da pasta do projeto, execute:

```bash
npm run dev
```

O Vite iniciará o servidor e exibirá os endereços locais e de rede, por exemplo:
- **Local (no próprio computador):** `http://localhost:3000`
- **Network (para abrir na Smart TV ou Celular):** `http://192.168.x.x:3000`

---

## 📺 Como Usar na Smart TV

1. Certifique-se de que a Smart TV e o seu computador/celular estão conectados na **mesma rede Wi-Fi**.
2. Abra o **Navegador de Internet** da sua Smart TV (Samsung Internet na TV Samsung, Web Browser na LG webOS, Chrome ou Silk na Android TV/Fire TV).
3. Digite o endereço de rede informado pelo terminal (ex: `http://192.168.x.x:3000`).
4. Clique no botão de **Tela Cheia** (ou aperte a tecla `F` no controle/teclado).
5. **Pronto!** O app ativa automaticamente a tecnologia **Wake Lock**, impedindo que a tela da TV apague durante o rola.

---

## 📱 Como Usar no Celular (Instalar como App PWA)

1. Acesse o endereço pelo navegador do celular (Safari no iPhone ou Chrome no Android).
2. **No Android**: Toque nos 3 pontinhos e selecione **"Instalar aplicativo"** ou **"Adicionar à tela inicial"**.
3. **No iPhone (iOS)**: Toque no botão de compartilhar (quadrado com seta para cima) e escolha **"Adicionar à Tela de Início"**.
4. O ícone do **BJJ Timer** aparecerá na sua tela inicial e abrirá em tela cheia como um app nativo, funcionando inclusive **100% offline**.

---

## 🎮 Atalhos de Controle Remoto e Teclado

O aplicativo responde a comandos rápidos no teclado do computador e nos botões do controle remoto da TV:

| Tecla / Botão | Ação no Tatame |
| :--- | :--- |
| **Barra de Espaço** ou **Botão OK** | Iniciar / Pausar o cronômetro |
| **F** | Ativar / Desativar Modo Tela Cheia (*Fullscreen*) |
| **N** ou **Seta Direita (➡️)** | Avançar para o próximo round ou pular descanso |
| **P** ou **Seta Esquerda (⬅️)** | Reiniciar o round atual ou voltar |
| **R** | Resetar o treino completo para o início |
| **+** | Adicionar 1 minuto extra ao rola em andamento |
| **-** | Subtrair 1 minuto do rola em andamento |
| **M** | Mutar / Desmutar alertas sonoros |

---

## 🔊 Sinais Sonoros Nativos de Tatame

O app usa sintetizadores acústicos de alta fidelidade via **Web Audio API** (não precisa baixar arquivos de áudio externos nem depende de internet):

- **Triplo Toque de Ringue & Gongo de Dojo**: Sequência rítmica e potente de 3 toques de sino de combate (*Ding! Ding! Diiing!*) com reverberação profunda e compressão dinâmica que corta qualquer barulho de conversa ou música no tatame.
- **Bips Penetrantes de Contagem (3, 2, 1)**: Frequências duplas agudas e nítidas durante a preparação pré-rola.
- **Batedor de Madeira Duplo (*Clapper*)**: Toca aos **10 segundos finais** do rola, avisando a academia sobre o minuto final.
- **Buzina Estridente de Arena**: Toca ao encerrar o tempo de luta, chamando para o descanso.
- **Sino de Retorno**: Toca no final do descanso para os atletas voltarem ao tatame.
- **Fanfarra de Encerramento**: Toca quando todos os rounds programados são finalizados com honra (*Oss!*).

---

## 🥋 Modalidades e Presets Integrados

- **Rola Livre (Adulto)**: 6 min de rola / 1 min de descanso (5 rounds).
- **Competição IBJJF (Azul e Roxa)**: 7 min de luta / 1:30 min de descanso.
- **Competição IBJJF (Marrom e Preta)**: 10 min de combate oficial / 2 min de descanso.
- **Treino Kids / Infantil**: 3 min de rola adaptado / 1 min de descanso.
- **Drills / Treino Específico**: 2 min de passagem x guarda / 30 seg de troca rápida.
- **Tabata / Preparatório Físico**: 20 seg de explosão máxima / 10 seg de descanso (8 rounds).
- **Rola Contínuo (Sem Limite)**: Rounds de 5 min ininterruptos até parada manual.
- **Modo Personalizado**: Defina minutos, segundos, descansos e rounds customizados.

