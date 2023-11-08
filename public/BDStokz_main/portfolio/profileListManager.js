    async function theFunction(){    
        var list = [];
        let url = 'http://localhost:3000/admin/allUsers';
        const userDataString = sessionStorage.getItem('userData');
        let userDataset;
        if (userDataString) {
            userDataset = JSON.parse(userDataString);
        }
        if(userDataset.userType === 'Customer')
        url = 'http://localhost:3000/broker';
        else if(userDataset.userType === 'Broker')
        url = 'http://localhost:3000/broker/customers?id='+userDataset.userId;
        //async function initTheShit(){
            try{
                console.log("size of list is "+list.size);
            const response = await fetch(url); // Change the URL to your backend API endpoint
            const list2 = await response.json();
            list2.forEach(element => {
                list.push(element);
            });
        }
        catch(error){

        }
       // }
        
        const cards = ["card1", "card2", "card3", "card4", "card5", "card6"]; // Add more if needed
        let currentPosition = 0;
        function updateCards() {
            if(currentPosition < list.length){
                for (let i = 0; i < cards.length; i++) {
                    const name = document.getElementById(cards[i]+'Name');
                    const userType = document.getElementById(cards[i]+'UserType');
                    const viewBtn = document.getElementById(cards[i]+'ViewButton');
                    const crd = document.getElementById(cards[i]+'h');
                    if (currentPosition < list.length) {
                        name.textContent = list[currentPosition].NAME;
                        userType.textContent = list[currentPosition]["TYPE"];
                        const newButton = document.createElement("button");
                        newButton.textContent = viewBtn.textContent;

                        newButton.className = "btn btn-sm btn-de-primary";
                        viewBtn.parentNode.replaceChild(newButton, viewBtn);
                        viewBtn.remove();
                        newButton.id = cards[i]+'ViewButton';
                        let temp_num = currentPosition;
                        newButton.addEventListener('click', async function(){
                            showProfile(list[temp_num].NAME);
                        });
                        crd.style.display = "block";
                    } else {
                        crd.style.display = "none";
                    }
                    currentPosition++;
                }
            }
        }

        document.getElementById("prevButton").addEventListener("click", () => {
            currentPosition = Math.max(0, currentPosition - (cards.length * 2));
            if(currentPosition === 0){
                document.getElementById("prevButtonHolder").style.display = 'none';
            }
            updateCards();
        });

        document.getElementById("nextButton").addEventListener("click", () => {
            document.getElementById("prevButtonHolder").style.display = 'grid';
            updateCards();
        });
        function showProfile(username){
            const queryParams = new URLSearchParams();
            queryParams.append('name', username);
            window.location.href = 'http://localhost:3000/BdStokz_main/position/position.html' + '?' +queryParams.toString();
        }
        //initTheShit();
        console.log("size of list is "+list.size);
        updateCards();
    }

theFunction();