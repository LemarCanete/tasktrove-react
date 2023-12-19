import React, {useState} from 'react'
import {useFloating} from '@floating-ui/react-dom';

const Notification = () => {
    const {refs, floatingStyles} = useFloating();
    const [isOpen, setIsOpen] = useState(false);
    return (
        <>
        <button ref={refs.setReference}>Button</button>
        <div ref={refs.setFloating} style={floatingStyles}>
            Tooltip
        </div>
        </>
    )
}

export default Notification