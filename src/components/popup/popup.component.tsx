import React, {useState} from 'react';
import Popup from 'reactjs-popup';
import './popup.style.css'
import ComboBox from "../combo-box/combo-box.component";

interface IProps {
    buttonText: string,
    dropdownValues: string[],
    order: {},
    customerName: string,
    customerPhoneNumber: string,
    customerEmail: string,
    customerAddress: string
}

function PopUp({buttonText, dropdownValues}: IProps) {

    const [template, setTemplate] = useState("");

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
                                onClick={() => {
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