import { initializeApp } from "firebase/app";
import { getAuth, RecaptchaVerifier } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyChmx_oxD5S4dq-7sTOAN7kYYbamG-n0U8",
  authDomain: "daugiastu-97ae5.firebaseapp.com",
  projectId: "daugiastu-97ae5",
  appId: "1:885321610536:web:cdee23ddff84ba8ec08c1d",
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

export { auth, RecaptchaVerifier };
