const purchasedList = document.getElementById("purchased-list");
const purchasingList = document.getElementById("purchasing-list");
const resultadoList = document.getElementById("resultado-list");
const confirmButton = document.getElementById("purchase-confirm-button");
const confirmPrizeButton = document.getElementById("confirm-prize-button");
let ticketList = [];
let purchasedTickets = [];
let resultList = [];

function clearTickets() {
  const purchasingListItems = document.querySelectorAll(
    ".purchasing-list-item.selected"
  );
  purchasingListItems.forEach((item) => {
    item.classList.remove("selected");
  });

  ticketList = [];
}

async function compareTickets() {
  if (!purchasedTickets?.length) {
    alert("Você precisa comprar 1 bilhete para comparar resultados.");
    return;
  }

  await loadResultado();

  const hasWon = purchasedTickets.some((tickets) =>
    tickets.every((item) => resultList.includes(item))
  );

  if (hasWon) {
    alert("Você ganhou!");
    return;
  }

  alert("Que pena não foi dessa vez :(");
}

function addClickToPurchasingListItems() {
  const purchasingListItems = document.querySelectorAll(
    ".purchasing-list-item"
  );
  purchasingListItems.forEach((item) => {
    item.addEventListener("click", () => {
      if (item.classList.contains("selected")) {
        item.classList.remove("selected");
        ticketList = ticketList.filter((ticket) => ticket !== item.textContent);
        return;
      }

      if (ticketList.length >= 6) {
        alert(
          "6 numeros já selecionados, por favor desmarque algum para marcar outro!"
        );
        return;
      }

      item.classList.add("selected");
      ticketList.push(item.textContent);
    });
  });
}

function fillTicketNumbers() {
  let items = "";
  for (let i = 0; i < 99; i++) {
    items += `<li class="purchasing-list-item">${i + 1}</li>`;
  }

  purchasingList.innerHTML = items;
}

async function loadResultado() {
  const response = await fetch(
    "https://loteriascaixa-api.herokuapp.com/api/megasena/latest"
  );

  let items = "<li>Não há resultados a exibir!</li>";

  if (response.ok) {
    const obj = await response.json();
    if (obj?.dezenas?.length) {
      items = "";
      obj.dezenas.forEach((item) => {
        items += `<li class="selected">${item}</li>`;
      });
      resultList = obj.dezenas.map((item) => String(item));
      resultadoList.innerHTML = items;
    }
  }
}

function buyTickets() {
  let list = "";

  if (ticketList.length < 6) {
    alert(
      `Você precisa selecionar 6 numeros para confirmar, ${ticketList.length} já foram selecionados!`
    );
    return;
  }
  purchasedTickets.push(ticketList);
  purchasedTickets.forEach((p) => {
    list += `<ul>`;
    p.forEach((ticket) => {
      list += `<li class="selected">${ticket}</li>`;
    });
    list += "</ul>";
  });

  purchasedList.innerHTML = list;
}

function handleConfirmButtonClicked() {
  buyTickets();
  clearTickets();
}

window.addEventListener("load", () => {
  fillTicketNumbers();
  addClickToPurchasingListItems();

  confirmButton.addEventListener("click", handleConfirmButtonClicked);
  confirmPrizeButton.addEventListener("click", compareTickets);
});
