const handleDateInput = (e) => {
    if (e.target.value.length > 10) {
        e.target.value = e.target.value.slice(0, 10);
    }
    let val = e.target.value;
    val = val.replace(/\D/g, '');
    val = val.replace(/^(\d{2})(\d{2})(\d{4})$/, '$1/$2/$3');
    return val;
};

export default handleDateInput;