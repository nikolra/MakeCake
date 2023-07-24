import React, {useState} from 'react';
import Popup from 'reactjs-popup';
import './popup.style.css'
import ComboBox from "../combo-box/combo-box.component";
import {toast} from "react-toastify";
import axios from "axios";

interface IProps {
    buttonText: string,
    dropdownValues: string[],
    order: {},
    customerName: string,
    customerPhoneNumber: string,
    customerEmail: string,
    customerAddress: string
}

function PopUp({buttonText, dropdownValues, customerEmail, customerName}: IProps) {

    const [template, setTemplate] = useState("");

    const fetchSendSMS = async () => {
        try {
            //TODO: Amit - should get connected user email
            const payload = {
                customerEmailAddress: customerEmail,
                smsTemplateName: template,
                konditorEmail: "tomer@gmail.com"
            };
            toast.promise(async () => {
                const response = await axios.post('https://5wcgnzy0bg.execute-api.us-east-1.amazonaws.com/dev/send_sms_to_customer', payload);
                const data = response.data;
                console.log(data);
                //setTemplates(data);
            }, {
                // @ts-ignore
                loading: 'Loading',
                success: `SMS send to ${customerName}`,
                error: `Error sending SMS to ${customerName}`
            });

        } catch (error) {
            console.error(JSON.stringify(error));
        }
    }
    return (
        <Popup
            trigger={<button className="expand-button button"> {buttonText} </button>}
            modal
            nested
        >
            {/*// @ts-ignore*/}
            {close => {
                return (
                    <div>
                        <button className="close expand-button" onClick={close}>
                            &times;
                        </button>
                        <div className="header">
                            select sms template to be sent for the selected order
                            <ComboBox setValueDelegate={setTemplate} label={"sms template"} options={dropdownValues}/>
                        </div>
                        <div className="actions align-right">
                            <button
                                className="button popup-send-button"
                                onClick={async () => {
                                    await fetchSendSMS()
                                    // TODO: Eden, should integrate send sms to customer
                                    console.log('modal closed ');
                                    close();
                                }}
                            >
                                send
                            </button>
                        </div>
                    </div>
                );
            }}
        </Popup>
    );
}

export default PopUp;