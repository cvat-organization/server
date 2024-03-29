// Helper function to find weekStartDate
function getWeekStartDate(date) {
    const weekStart = date.getDate() - date.getDay();
    const weekStartDate = new Date(date);
    weekStartDate.setDate(weekStart);
    return weekStartDate.toISOString();
}

// Helper function to find monthStartDate
function getMonthStartDate(date) {
    const monthStart = new Date(Date.UTC(date.getFullYear(), date.getMonth(), 1,));
    return monthStart.toISOString();
}

// Export the functions
module.exports = { getWeekStartDate, getMonthStartDate };