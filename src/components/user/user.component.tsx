import React, {useEffect, useState} from 'react'
import './user.style.css'
import {useNavigate} from "react-router-dom";
import Cookies from "js-cookie";
import axios from "axios/index";

export default function User() {

    const [username, setName] = useState('Ariana Broflowski')
    let userImageUrl = "https://img.freepik.com/free-photo/pretty-smiling-joyfully-female-with-fair-hair-dressed-casually-looking-with-satisfaction_176420-15187.jpg?w=2000&t=st=1673606520~exp=1673607120~hmac=268c1dbbd9a45dc6dffa7fca89c7f020f2be05a55c5b81c132dd27ce5206acd5"

    const navigate = useNavigate();

    useEffect(() => {
        if (!Cookies.get('makecake-token')) {
            navigate("/");
            return;
        }
        getUserData();
    }, []);

    const getUserData = async() => {
        const response =
            await axios.post('https://5wcgnzy0bg.execute-api.us-east-1.amazonaws.com/dev/get_user',
                {accessToken: Cookies.get('makecake-token')});
        const responseBodyJSON = JSON.parse(response.data.body);
        console.log("responseBodyJSON");
        console.log(responseBodyJSON);//TODO: Nikol - fix to use name and not email.
        const user_email = responseBodyJSON.email;
        setName(user_email);
    }

    return (
        <div className="user-container">
            <div className="background">
                <div id="user-image-background" className="user-image-background">
                    <img className="user-image" src={userImageUrl}/>
                </div>
            </div>
            <span className="user-text">{username}</span>
        </div>
    )
}
