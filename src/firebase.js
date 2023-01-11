import { initializeApp } from 'firebase/app';

const firebaseConfig = {
  apiKey: 'AIzaSyBzMud-BGdO3cT4jSmVGcJIA8CCzndwoEE',
  authDomain: 'chatapp-vaibhav.firebaseapp.com',
  projectId: 'chatapp-vaibhav',
  storageBucket: 'chatapp-vaibhav.appspot.com',
  messagingSenderId: '277797575866',
  appId: '1:277797575866:web:efc39910a1a810a16b3683',
};

export const app = initializeApp(firebaseConfig);
