const prepareData = (data) => {
    for (let key in data) {
        if (typeof data[key] === 'object') {
            prepareData(data[key]);
        } else if (data[key] === '') {
            data[key] = null;
        }
    }
};

export default prepareData;