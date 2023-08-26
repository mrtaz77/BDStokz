const parseStringToList = async (inputString) => {
    try {
        const jsonArray = JSON.parse(inputString);
        // Convert integer keys to strings
        const transformedArray = jsonArray.map(item => {
        const key = Object.keys(item)[0]; // Get the key (integer)
        const value = item[key]; // Get the corresponding value
        return { [key.toString()]: value }; // Convert the key to string and reconstruct the object
        });
        return transformedArray;
    } catch (error) {
        console.error('Error parsing string:', error);
        return [];
    }
}
module.exports = {
    parseStringToList
}