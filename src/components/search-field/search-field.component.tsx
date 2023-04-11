import React from 'react'
import './search-field.style.css'

const SearchField = ({className, placeholder, onChangeHandler}: any) => {
    return (
        <input
            className={`search-field ${className}`}
            placeholder={placeholder}
            type={'search'}
            onChange={onChangeHandler}
        />
    )
}

export default SearchField