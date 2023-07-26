import React, {useEffect} from 'react'
import {Outlet, useNavigate} from 'react-router-dom';
import Cookies from "js-cookie";

export default function MainLayout() {

  const navigate = useNavigate();

  useEffect(() => {
    if (!Cookies.get('makecake-token'))
      navigate("/");
  }, []);

  return (
    <Outlet/>
  )
}
