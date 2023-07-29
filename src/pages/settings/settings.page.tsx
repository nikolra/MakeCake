import React, {useEffect, useState} from 'react'
import SettingsComponent from "../../components/settings/settings.component";
import {useNavigate} from "react-router-dom";
import Cookies from "js-cookie";
import {validateToken} from "../../utils/TokenValidation";

export default function Settings() {

    const [isTokenValidated, setIsTokenValidated] = useState(false);
    const [username, setName] = useState("false");

    const navigate = useNavigate();

    useEffect(() => {
        const token = Cookies.get('makecake-token');
        const func = async () => {
            const name = await validateToken(token, navigate);
            setName(name? name : "");
            setIsTokenValidated(true);
        }
        func();
    }, []);

    return (
        <div className="data-container">
            {isTokenValidated &&
                <SettingsComponent username={username}/>
            }
        </div>
    )
}
