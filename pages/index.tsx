import type {NextPage} from 'next';
import {Content} from '../components/home/content';
import { useAuthStore } from '../store/authStore';

const Home: NextPage = () => {
   const {isAuthenticated, accessToken} = useAuthStore();
   console.log("isAuthenticated", isAuthenticated);
   console.log("accessToken", accessToken);
   // if (!isAuthenticated) {
   //    return <Login />;
   // }
   return <Content />;
};

export default Home;
