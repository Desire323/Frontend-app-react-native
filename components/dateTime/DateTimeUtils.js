function isToday(timestamp) {
    if (!timestamp) {
      return false;
    }

    const givenDate = new Date(timestamp)
  
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
  