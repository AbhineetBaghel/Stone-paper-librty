import * as C from './style'
import { Input } from './components/input';
import { Button } from './components/button';
import { Score } from './components/score';
import { ActionsGame } from './components/action-game';
import { Modal } from './components/modal';
import { useEffect, useState } from 'react';
import './App.css';
import { LibrtyDevKit, NETWORK } from 'librty-dev-kit';

const messages = {
  rules: {
    title: 'Rules',
    message:
      ' In this people play with their hands, choosing between rock (closed hand), paper (open hand) and scissors (two fingers in front). The game is similar to "odd or even", but with one more variable. And it works like this: Each player chooses an option. Scissors cut paper, but break with rock; the paper wraps around the rock but is cut by the scissors and the rock breaks the scissors and is wrapped by the paper. The challenge here is to beat the computer 10 times! Make your choice and good luck!'
  },
  user: {
    title: 'User',
    message: 'Fill the user'
  },
  computerWin: {
    title: 'Awwww ',
    message: 'It wasnt this time, but dont be discouraged. Try again!!'
  },
  playerWin: {
    title: 'Congratulations!!',
    message: 'You were Incredible, you played a good game!!'
  }
}

const valueTypeEnum = {
  ROCK: 1,
  PAPER: 2,
  SCISSORS: 3
}


const actions = [{
  value: 1,
  label: '👊🏾',
  description: 'Rock'
},
{
  value: 2,
  label: '🖐🏾',
  description: 'Paper'
},
{
  value: 3,
  label: '✌🏾',
  description: 'Scissors'
}]


function App() {
  const [titleModal, setTitleModal] = useState('')
  const [messageModal, setmessageModal] = useState('')
  const [open, setOpen] = useState(false)
  const [scorePlayerValue, setScorePlayerValue] = useState(0)
  const [scoreComputerValue, setScoreComputerValue] = useState(0)
  const [userAction, setUserAction] = useState('❓')
  const [computerAction, setComputerAction] = useState('❓')
  const [userName, setUserName] = useState('USER')
  const [playGame, setPlayGame] = useState(false)
  const [textGame, setTextGame] = useState('Start Game!!')
  const [connected, setConnected] = useState(false);
  const [balance, setBalance] = useState({ status: null, data: null }); // initialize balance state variable
  const [address, setAddress] = useState('');
  

  const SCORE_TO_WIN = 10

  const connectWallet = async () => {
    try {
      const ldk = new LibrtyDevKit('LDKhack', NETWORK.POLYGON, false, {
        rpc: window.ethereum,
      });
      const connection = ldk.wallet.metamask;
      await connection.connect();
      console.log(await connection.getChainId());
  
      // get connected wallet address and set state
      const accounts = await ldk.wallet.address;
      setAddress(accounts);
      console.log(address)
  
      // get token balance and set state
      const tokenBalance = await ldk.indexer.token.getTokenBalance("0x0000000000000000000000000000000000001010", address);
      setBalance({ status: 'success', data: tokenBalance }); // set balance state variable
      console.log(tokenBalance)
      setConnected(true); // set connected state variable to true
    } catch (err) {
      console.error(err);
    }
  }
  const handleConnectWallet = async () => {
  await connectWallet();
}


  const handleOpenModal = (type) => {
    if (!type) {
      setOpen(false)
      setTitleModal('')
      setmessageModal('')
      return
    }

    setTitleModal(messages?.[type]?.title)
    setmessageModal(messages?.[type]?.message)
    setOpen(true)
  }

  const randomActionComputer = () => {
    const number = Math.floor(Math.random() * actions.length)
    return actions[number]
  }


  const handleClick = (value) => {

    if (!connected) {
      // If wallet is not connected, show an error message
      setTextGame('Please connect your wallet to play the game!');
      return;
    }


    setUserAction(value.label)
    const actionComputer = randomActionComputer()
    setComputerAction(actionComputer.label)
    checkWinner(value.value, actionComputer.value)
  }

  const checkWinner = (playerValue, computerValue) => {
    const playerRockWin = playerValue === valueTypeEnum.ROCK && computerValue === valueTypeEnum.SCISSORS
    const playerPaperWin = playerValue === valueTypeEnum.PAPER && computerValue === valueTypeEnum.ROCK
    const playerScissorsWin = playerValue === valueTypeEnum.SCISSORS && computerValue === valueTypeEnum.PAPER

    const drawerResult = playerValue === computerValue

    const playerWin = playerPaperWin || playerRockWin || playerScissorsWin

    if (drawerResult) return (setTextGame('Tie play again! '))
    if (playerWin) {
      setScorePlayerValue((state) => state + 1)
      return setTextGame('Victory play again!')
    }
    setScoreComputerValue((state) => state + 1)
    return setTextGame('Defeat play again')
  }

  const handleUserName = (value) => {

    if (!connected) {
      // If wallet is not connected, show an error message
      alert('Please connect your wallet to restart the game!');
      return;
    }

    if (!value) return setUserName('USER')
    setUserName(value)

  }
  const startGame = () => {
    if (userName === 'USER') {
      handleOpenModal('user')
      return
    }
    if(playGame) return resetValue()
    setPlayGame(true)
  }

  const resetValue = () => {
    setTextGame('Start the game! ')
    setPlayGame(false)
    setScorePlayerValue(0)
    setScoreComputerValue(0)
    setUserAction('❓')
    setComputerAction('❓')
  }

  useEffect(() => {
    const checkVitory = () => {
      const playerWin = scorePlayerValue === SCORE_TO_WIN
      const computerWin = scoreComputerValue === SCORE_TO_WIN
      if (playerWin) return handleOpenModal('playerWin')
      if (computerWin) return handleOpenModal('computerWin')
    }

    checkVitory()
  }, [scorePlayerValue, scoreComputerValue])

  

  return (

    
    <C.Container>
      
      <C.Flex direction='column'>

        <C.Typography fontWeight='400' size='32px' lineHeight='48px'>Stone Paper</C.Typography>

        <C.Flex>
        <Button onClick={startGame} disabled={!connected || playGame}>
  {playGame ? 'Restart' : 'Start'}
</Button>
        {connected ? (
       <div className='button-main'>
       <p>Wallet connected!</p>
       {/* <p>ChainID: {JSON.stringify(balance.status)}</p> */}
       {/* <p>Token Balance: {JSON.stringify(balance.data)}</p> */}
       {/* <p>Address: {JSON.stringify(address)}</p> */}
     </div>
      ) : (
        <button onClick={handleConnectWallet}>Connect Wallet</button>
      )}
        </C.Flex>
        <Input placeholder={'Enter player name'} onChange={(value) => handleUserName(value)} />

        {/* <Button onClick={startGame}>{playGame ? 'Restart' : 'Start'}</Button> */}

        {/* <button onClick={handleConnectWallet}>Connect Wallet</button> */}
        
        <Score userName={userName} scorePlayer={scorePlayerValue} scoreComputer={scoreComputerValue} />

        <C.Spacer margin='10px' />
        <C.Flex justify='space-around'>
          <C.Typography size='32px' > {userAction}</C.Typography>

          <C.Typography size='32px' > {computerAction}</C.Typography>

        </C.Flex>

        <C.Flex direction='column' gap='0px'>
          <C.Typography > {textGame}</C.Typography>

          <C.Rules onClick={() => handleOpenModal('rules')} > Rules</C.Rules>

        </C.Flex>



        <ActionsGame actions={actions} onClick={(value) => handleClick(value)} disabled={!playGame} />

        <Modal
          open={open}
          titleModal={titleModal}
          messageModal={messageModal}
          handleOpenModal={() => handleOpenModal(null)}
        />
      </C.Flex>


    </C.Container>

    
  );

  
}

export default App
