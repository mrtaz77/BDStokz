const parseStringToList = async (inputString) => {
    function parseStringToList(inputString) {
        try {
            const inputArray = JSON.parse(inputString);
            const dataArray = inputArray.map(item => {
                const [timestamp, value] = item; // Destructure the array into timestamp and value
                return [timestamp, value]; 
            });
            return dataArray;
        } catch (error) {
            console.error('Error converting to ApexChart data:', error);
            return [];
        }
    }
}
module.exports = {
    parseStringToList
}