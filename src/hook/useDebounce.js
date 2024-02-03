import { useEffect, useState } from "react";

export const useDebounce = (value, time) => {
    const [text, setText] = useState("");

    useEffect(() => {
        const id = setTimeout(() => {
            setText(value);
        }, time);
        return () => clearTimeout(id);
    }, [value, time]);
    return text.trim();
};
