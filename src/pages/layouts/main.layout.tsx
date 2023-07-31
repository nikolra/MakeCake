import React, {useEffect} from 'react'
import {Outlet, useNavigate} from 'react-router-dom';
import Cookies from "js-cookie";
import {validateToken} from "../../utils/TokenValidation";

export default function MainLayout() {

  const navigate = useNavigate();

  useEffect(() => {
    const token = Cookies.get('makecake-token');
    const func = async () => {
    await validateToken(token, navigate);
    }
    func();
  }, []);

  return (
    <Outlet/>
  )
}
