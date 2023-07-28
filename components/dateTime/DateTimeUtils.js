function isToday(dateString) {
    if (!dateString) {
      return false;
    }

    const givenDate = new Date(parseInt(dateString, 10))
  
    const currentDate = new Date();
    console.log('\n\n\ngivenDate: ', givenDate);
    console.log('currentDate: ', currentDate);

    const isSameDay =
      givenDate.getDate() === currentDate.getDate() &&
      givenDate.getMonth() === currentDate.getMonth() &&
      givenDate.getFullYear() === currentDate.getFullYear();
  
    return isSameDay;
  }
  

  export { isToday }
  