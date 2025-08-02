import { useEffect } from "react";
import { useAppData } from "../context/AppContext";
import { useNavigate } from "react-router-dom";
import Loading from "../verify/Loading";



const ChatApp = () => {
  const { loading, isAuth } = useAppData();

  const navigateTo = useNavigate();

  useEffect(() => {
    if (!isAuth && !loading) {
      navigateTo("/login");
    }
  }, [isAuth, navigateTo, loading]);
  if(loading) return <Loading/>;  

  return (
    <>
      <p> This is ChatApp ...</p>
    </>
  );
};

export default ChatApp;
