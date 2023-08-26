const parseStringToList = async (inputString) => {
    try {
        const jsonString = inputString.replace(/'/g, '"'); // Replace single quotes with double quotes
        const jsonArray = JSON.parse(jsonString);
        return jsonArray;
    } catch (error) {
        console.error('Error parsing string:', error);
        return [];
    }
}
module.exports = {
    parseStringToList
}