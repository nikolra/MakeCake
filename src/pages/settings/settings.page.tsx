import React, {useEffect, useState} from 'react'
import SettingsComponent from "../../components/settings/settings.component";
import {useNavigate} from "react-router-dom";
import Cookies from "js-cookie";
import {validateToken} from "../../utils/TokenValidation";
import axios from "axios";
import {toast} from "react-toastify";

export default function Settings() {

    const [isTokenValidated, setIsTokenValidated] = useState(false);
    const [username, setName] = useState("");

    const navigate = useNavigate();

    useEffect(() => {
        const token = Cookies.get('makecake-token');
        const func = async () => {
            validateToken(token, navigate);
            await getUser();
            setIsTokenValidated(true);
        }
        func();
    }, []);

    const getUser = async () => {
        try {
            const body = {
                accessToken: Cookies.get('makecake-accessToken')
            }
            const response =
                await axios.post('https://5wcgnzy0bg.execute-api.us-east-1.amazonaws.com/dev/get_user',
                    body,
                    {
                        headers: {
                            "Content-type": "application/json",
                            Authorization: "Bearer " + Cookies.get('makecake-token')
                        }
                    });
            if(response.data.statusCode !== 200)
                toast.error(`error getting user`);
            const data = response.data.body;
            setName(data.username);

        } catch (e) {
            console.error(`error getting user: ${e}`);
            toast.error(`error getting user`);
        }
    }

    return (
        <div className="data-container">
            {isTokenValidated &&
                <SettingsComponent username={username}/>
            }
        </div>
    )
}
