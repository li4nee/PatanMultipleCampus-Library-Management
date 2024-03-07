const calculateFine = async (days, limit, finePerDay) => {
    if (isNaN(days) || isNaN(limit) || isNaN(finePerDay)) {
        throw new Error('Invalid input. Please provide numeric values for days, limit, and finePerDay.');
    }

    if (days < limit) {
        return 0;
    } else if (days <= 2 * limit) {
        return (days - limit) * (finePerDay / 2);
    } else {
        return (days - limit) * finePerDay;
    }
};
export default calculateFine;