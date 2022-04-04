// refer to https://github.com/koreanbots/core/blob/master/utils/useOutsideClick.ts

import { useEffect } from 'react'

const useOutsideClick = (ref, callback) => {
    const handleClick = e => {
        if (ref.current && !ref.current.contains(e.target)) {
            callback()
        }
    }

    useEffect(() => {
        document.addEventListener('click', handleClick)

        return () => {
            document.removeEventListener('click', handleClick)
        }
    })
}

export default useOutsideClick
