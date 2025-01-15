import {useState} from "react";
import {Button} from "react-daisyui";
import classNames from "classnames";


export default function DoubleConfirmButton({
                                                disabled,
                                                text,
                                                confirmText = "Confirm",
                                                color = "normal",
                                                confirmColor,
                                                onConfirmClick,
                                            }) {
    const [isConfirmState, setIsConfirmState] = useState(false)

    return <Button
        className={classNames(
            "transition-transform duration-300",
            isConfirmState && "animate-shake"
        )}
        color={isConfirmState ? confirmColor : color}
        disabled={disabled}
        onClick={() => {
            if (!isConfirmState) {
                setIsConfirmState(true)
                setTimeout(() => setIsConfirmState(false), 3000)
                return
            }
            setIsConfirmState(false)
            onConfirmClick()
        }}>
        {isConfirmState ? confirmText : text}
    </Button>
}
