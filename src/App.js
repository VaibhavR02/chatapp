import { useEffect, useRef, useState } from 'react';
import logo from './animation.gif';
import {
  Box,
  Button,
  Container,
  HStack,
  Image,
  Input,
  VStack,
} from '@chakra-ui/react';
import { AiOutlineLogout, AiOutlineSend } from 'react-icons/ai';
import Message from './Components/Message';
import {
  onAuthStateChanged,
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
} from 'firebase/auth';
import { app } from './firebase';
import {
  getFirestore,
  addDoc,
  collection,
  serverTimestamp,
  onSnapshot,
  query,
  orderBy,
} from 'firebase/firestore';
import { toast, Toaster } from 'react-hot-toast';
import { async } from '@firebase/util';
const auth = getAuth(app);
const db = getFirestore(app);

const loginhandler = () => {
  const provider = new GoogleAuthProvider();
  signInWithPopup(auth, provider);
};

const logOuthandler = () => signOut(auth);

function App() {
  const divforScroll = useRef(null);

  const [user, setUser] = useState(false);
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    const q = query(collection(db, 'messages'), orderBy('createdAt', 'asc'));
    const unsubscribe = onAuthStateChanged(auth, (data) => {
      setUser(data);
    });
    const unsubscribeForMessages = onSnapshot(q, (snap) => {
      setMessages(
        snap.docs.map((item) => {
          const id = item.id;
          return { id, ...item.data() };
        })
      );
    });

    return () => {
      unsubscribe();
      unsubscribeForMessages();
    };
  }, []);

  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      await addDoc(collection(db, 'messages'), {
        text: message,
        uid: user.uid,
        uri: user.photoURL,
        createdAt: serverTimestamp(),
      });
      setMessage('');
      divforScroll.current.scrollIntoView({ behavior: 'smooth' });
      toast.success('Sent');
    } catch (error) {
      // toast.danger(error);
      alert(error);
    }
  };

  return (
    <Box bg={'red.50'}>
      {user ? (
        <Container h={'100vh'} bg={'white'}>
          <VStack h={'full'} paddingY={'4'}>
            <Button onClick={logOuthandler} colorScheme={'red'} w={'full'}>
              <AiOutlineLogout /> &nbsp;Sign Out
            </Button>

            <VStack
              h={'full'}
              overflowY={'auto'}
              w={'full'}
              css={{
                '&::-webkit-scrollbar': {
                  display: 'none',
                },
              }}
            >
              {messages.map((item) => (
                <Message
                  key={item.id}
                  user={item.uid === user.uid ? 'me' : 'other'}
                  text={item.text}
                  uri={item.uri}
                />
              ))}

              <div ref={divforScroll}></div>
            </VStack>

            <form onSubmit={submitHandler} style={{ width: '100%' }}>
              <HStack>
                <Input
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Message.."
                />
                <Button colorScheme={'green'} type="submit">
                  <AiOutlineSend />
                </Button>
              </HStack>
            </form>
          </VStack>
        </Container>
      ) : (
        <VStack bg={'white'} justifyContent={'center'} h={'100vh'}>
          <Image src={logo} />
          <Button
            onClick={loginhandler}
            color={'white'}
            bg={'purple.500'}
            _hover={'purple'}
          >
            Sign In with Google
          </Button>
        </VStack>
      )}
      <Toaster />
    </Box>
  );
}

export default App;
