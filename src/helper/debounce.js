const debounce = (callback, delay) => {
    let timerId;

    return (...args) => {
        clearTimeout(timerId);
        timerId = setTimeout(() => {
            callback(...args);
        }, delay);
    };
};


export default debounce;