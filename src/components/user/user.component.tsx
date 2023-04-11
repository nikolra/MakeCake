import React, {useState} from 'react'
import './user.style.css'

export default function User() {
    const [username, setName] = useState('Ariana Broflowski')
    let userImageUrl = "https://img.freepik.com/free-photo/pretty-smiling-joyfully-female-with-fair-hair-dressed-casually-looking-with-satisfaction_176420-15187.jpg?w=2000&t=st=1673606520~exp=1673607120~hmac=268c1dbbd9a45dc6dffa7fca89c7f020f2be05a55c5b81c132dd27ce5206acd5"
  return (
    <div className="user-container">
        <div className="background">
            <div id="user-image-background"className="user-image-background">
                <img className="user-image" src={userImageUrl}/>
            </div>
        </div>
        <span className="user-text">{username}</span>
    </div>
  )
}
