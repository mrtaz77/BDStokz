// Wrap the script inside DOMContentLoaded event listener
document.addEventListener("DOMContentLoaded", function () {
  // Function to create an accordion item
  function createAccordionItem(data) {
    const accordionItem = document.createElement("div");
    accordionItem.classList.add("accordion-item", "border-top-0");

    const accordionHeader = document.createElement("div");
    accordionHeader.classList.add("accordion-header");
    accordionHeader.id = "heading" + data.company;

    const accordionButton = document.createElement("a");
    accordionButton.classList.add("accordion-button", "d-block", "py-2", "px-3", "collapsed");
    accordionButton.setAttribute("data-bs-toggle", "collapse");
    accordionButton.setAttribute("data-bs-target", "#collapse" + data.company);
    accordionButton.setAttribute("aria-expanded", "false");
    accordionButton.setAttribute("aria-controls", "collapse" + data.company);

    // Create the content for the accordion button
    const buttonContent = `
      <div class="d-flex justify-content-between">
        <div class="align-self-center">
          <h6 class="m-0 text-uppercase font-11">${data.company}</h6>
          <p class="text-uppercase font-10 mb-0">${data.exchange}</p>
        </div>
        <div>
          <h6 class="m-0 text-uppercase font-11">${data.stockPrice.toFixed(2)} <i class="ti ti-trending-down text-danger"></i></h6>
          <div class="d-inline-block font-10">
            <span class="text-danger">${data.change}</span>
            <span class="text-danger">(${data.changePercent}%)</span>
          </div>
        </div>
      </div>
    `;
    accordionButton.innerHTML = buttonContent;

    accordionHeader.appendChild(accordionButton);
    accordionItem.appendChild(accordionHeader);

    const accordionCollapse = document.createElement("div");
    accordionCollapse.classList.add("accordion-collapse", "collapse");
    accordionCollapse.id = "collapse" + data.company;
    accordionCollapse.setAttribute("aria-labelledby", "heading" + data.company);
    accordionCollapse.setAttribute("data-bs-parent", "#watchlist_2");

    const accordionBody = document.createElement("div");
    accordionBody.classList.add("accordion-body");

    // Create the content for the accordion body
    const bodyContent = `
      <!-- Your content here -->
    `;
    accordionBody.innerHTML = bodyContent;

    accordionCollapse.appendChild(accordionBody);
    accordionItem.appendChild(accordionCollapse);

    return accordionItem;
  }

  // Fetch data from the server
  fetch("http://localhost:3000/api/data")
    .then(response => response.json())
    .then(data => {
      const accordion = document.getElementById("watchlist_2");

      // Create and append accordion items for each data entry
      data.forEach(item => {
        const accordionItem = createAccordionItem(item);
        accordion.appendChild(accordionItem);
      });
    })
    .catch(error => {
      console.error("Error fetching data:", error);
    });
});
