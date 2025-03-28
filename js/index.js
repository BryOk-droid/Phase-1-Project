const petList = document.getElementById("pet-list");
const likedList = document.getElementById("liked-pets");
const loadDogsBtn = document.getElementById("load-dogs");
const addDogForm = document.getElementById("add-dog-form");

const confirmModal = document.getElementById("confirm-modal");
const confirmText = document.getElementById("confirm-text");
const confirmYes = document.getElementById("confirm-yes");
const confirmNo = document.getElementById("confirm-no");

let dogList = [];
let dogToAdopt = null;

window.addEventListener("DOMContentLoaded", () => {
  const savedDogs = localStorage.getItem("dogList");
  if (savedDogs) {
    dogList = JSON.parse(savedDogs);
    renderDogs(dogList);
  }
});

loadDogsBtn.addEventListener("click", fetchDogs);

function fetchDogs() {
  fetch("https://dog.ceo/api/breeds/image/random/10")
    .then((res) => res.json())
    .then((data) => {
      const newDogs = data.message.map((url, index) => ({
        id: Date.now() + index,
        name: getRandomName(),
        age: getRandomAge(),
        image: url,
        liked: false,
      }));
      dogList = [...newDogs, ...dogList];
      updateLocalStorage();
      renderDogs(dogList);
    });
}
