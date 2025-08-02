import { Suspense } from "react";
import VerifyOtp from "../component/VerifyOtp";
import Loading from "./Loading";

const VerifyPage = () => {
  return (
     <Suspense fallback={<Loading/>}>
       <VerifyOtp/>
     </Suspense>
  );
};

export default VerifyPage;
