const validateDate = (dateOfBirth) => {
  console.log(dateOfBirth);
    //Check if date has T or Z in it
    if(dateOfBirth !== null && dateOfBirth !== undefined && dateOfBirth !== '') {
        if (dateOfBirth.includes('T') || dateOfBirth.includes('Z')) {
          //If it does, remove it and the proceeding characters
          dateOfBirth = dateOfBirth.split('T')[0];
          dateOfBirth = dateOfBirth.split('Z')[0];
        }
    }


    const dateParts = dateOfBirth.split('-');

    console.log(dateParts);
  
    if (dateParts.length !== 3 ||
        dateParts[0].length !== 4 ||
        dateParts[1].length !== 2 ||
        dateParts[2].length !== 2 ||
        parseInt(dateParts[1]) < 1 ||
        parseInt(dateParts[1]) > 12 ||
        parseInt(dateParts[2]) < 1 ||
        parseInt(dateParts[2]) > 31) {
      return false;
    }
  
    return true;
}

export default validateDate;