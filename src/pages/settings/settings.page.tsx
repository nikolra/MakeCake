import React, {useEffect} from 'react'
import SettingsComponent from "../../components/settings/settings.component";
import {useNavigate} from "react-router-dom";
import Cookies from "js-cookie";

export default function Settings() {

    const navigate = useNavigate();

    useEffect(() => {
        if (!Cookies.get('makecake-token'))
            navigate("/");
    }, []);

  return (
    <div className="data-container">
      <SettingsComponent/>
    </div>
  )
}
