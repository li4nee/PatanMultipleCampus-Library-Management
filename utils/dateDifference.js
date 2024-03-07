const dateDifference=async (a,b)=>{

    const issuedDateReturned = new Date(a);
    const issuedDateBorrowed = new Date(a);
    const timeDifferenceInMilliseconds = issuedDateReturned - issuedDateBorrowed;
    const numberOfDaysBorrowed = Math.ceil( timeDifferenceInMilliseconds / (24 * 60 * 60 * 1000));
    return numberOfDaysBorrowed
}

 export  default dateDifference;