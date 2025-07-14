function getPrice() {
    let price = 0;

    const inputs = document.querySelectorAll("*[data-price]");
    inputs.forEach(input => {
        if(input.checked || input.selected) {
            price += Number(input.getAttribute("data-price"));
        }
     });
        

    document.querySelectorAll(".totalPrice").forEach(element => {
        element.textContent = `${price}€`;
    });
  }

  document.getElementById("type").addEventListener("change", getPrice);
  document.querySelectorAll("input").forEach(input => input.addEventListener("input", getPrice));

  document.getElementById("seeOrder").addEventListener("click", () => {
    const customerNameInput = document.getElementById("customerName");
    const customerName = customerNameInput ? customerNameInput.value.trim() : "";

    const textInputsArray = [];
    const selectedInputsArray = [];
    const selectedOptionsArray = [];

    // Collect text inputs and textareas (excluding customer name, already handled)
    const textInputs = document.querySelectorAll("input[type='text']:not(#customerName), textarea");
    textInputs.forEach(input => {
        const label = document.querySelector(`label[for='${input.id}']`);
        const labelText = label ? label.textContent : input.name || "Field";
        textInputsArray.push(`${labelText}: ${input.value}`);
    });

    // Collect selected checkboxes and radio buttons
    const checkedInputs = document.querySelectorAll("input[type='checkbox']:checked, input[type='radio']:checked");
    checkedInputs.forEach(input => {
        let text = "";

        const label = document.querySelector(`label[for='${input.id}']`);
        if (label) {
            text = label.textContent;
        } else if (input.nextSibling && input.nextSibling.nodeType === Node.TEXT_NODE) {
            text = input.nextSibling.textContent.trim();
        } else {
            text = input.value || "Selected option";
        }

        selectedInputsArray.push(text);
    });

    // Collect selected options from <select>
    const selectedOptions = document.querySelectorAll("select option:checked");
    selectedOptions.forEach(option => {
        const select = option.closest("select");
        const label = document.querySelector(`label[for='${select.id}']`);
        const labelText = label ? label.textContent : select.name || "Selection";
        selectedOptionsArray.push(`${labelText}: ${option.textContent}`);
    });

    // Get the total price
    const totalPriceElement = document.querySelector(".totalPrice");
    const totalPrice = totalPriceElement ? totalPriceElement.textContent : "0€";

    // Print everything to the page
    const orderSummary = document.getElementById("orderSummary");
    orderSummary.innerHTML = `
        <h2">Order Summary</h2>
        ${customerName ? `<h3>Customer Name: ${customerName}</h3>` : ""}
        <h3>Details:</h3>
        <ul>${textInputsArray.map(item => `<li>${item}</li>`).join("")}</ul>
        <h3>Selected Items:</h3>
        <ul>${selectedInputsArray.map(item => `<li>${item}</li>`).join("")}</ul>
        <h3>Selected Options:</h3>
        <ul>${selectedOptionsArray.map(item => `<li>${item}</li>`).join("")}</ul>
        <h3>Total Price: ${totalPrice}</h3>
    `;
});

function getOrderObject() {
  const customerName = document.getElementById("customerName").value.trim();
  const selectedPancake = document.querySelector("#type option:checked").textContent;
  const toppings = Array.from(document.querySelectorAll(".topping:checked")).map(input =>
    input.nextSibling.textContent.trim()
  );
  const extras = Array.from(document.querySelectorAll(".extra:checked")).map(input =>
    input.nextSibling.textContent.trim()
  );
  const deliveryMethod = document.querySelector("input[name='delivery']:checked").parentNode.textContent.trim();
  const totalPrice = parseFloat(document.querySelector(".totalPrice").textContent); // Number

  return {
    id: Date.now(),
    customerName: customerName || "Anonymous",
    selectedPancake,
    toppings,
    extras,
    deliveryMethod,
    totalPrice,
    status: "waiting"
  };
}


document.getElementById("seeOrder").addEventListener("click", () => {
  const order = createOrderObject();
  saveOrder(order);
  showOrderSummary(order);
});

function createOrderObject() {
  const name = document.getElementById("customerName").value.trim() || "Anonymous";

  const pancakeType = document.querySelector("#type option:checked").textContent;
  const basePrice = parseFloat(document.querySelector("#type option:checked").dataset.price);

  const toppings = Array.from(document.querySelectorAll(".topping:checked")).map(el => el.parentElement.textContent.trim());
  const extras = Array.from(document.querySelectorAll(".extra:checked")).map(el => el.parentElement.textContent.trim());

  const toppingsPrice = toppings.length * 1;
  const extrasPrice = Array.from(document.querySelectorAll(".extra:checked"))
    .reduce((sum, el) => sum + parseFloat(el.dataset.price), 0);

  const delivery = document.querySelector("input[name='delivery']:checked").parentElement.textContent.trim();
  const deliveryPrice = parseFloat(document.querySelector("input[name='delivery']:checked").dataset.price || 0);

  const totalPrice = basePrice + toppingsPrice + extrasPrice + deliveryPrice;

  return {
    id: Date.now(),
    customerName: name,
    selectedPancake: pancakeType,
    toppings: toppings,
    extras: extras,
    deliveryMethod: delivery,
    totalPrice: totalPrice,
    status: "waiting"
  };
}

function saveOrder(order) {
  let orders = JSON.parse(localStorage.getItem("orders")) || [];
  orders.push(order);
  localStorage.setItem("orders", JSON.stringify(orders));
}



