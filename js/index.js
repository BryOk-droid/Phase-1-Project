const petList = document.getElementById("pet-list");
const likedList = document.getElementById("liked-pets");
const likeCount = document.getElementById("like-count");
const loadDogsBtn = document.getElementById("load-dogs");
const addDogForm = document.getElementById("add-dog-form");

const confirmModal = document.getElementById("confirm-modal");
const confirmText = document.getElementById("confirm-text");
const confirmYes = document.getElementById("confirm-yes");
const confirmNo = document.getElementById("confirm-no");

let dogList = [];
let dogToAdopt = null;

// Load dogs from localStorage on page load
window.addEventListener("DOMContentLoaded", () => {
  const savedDogs = localStorage.getItem("dogList");
  if (savedDogs) {
    dogList = JSON.parse(savedDogs);
    renderDogs(dogList);
  }
});

// Load more dogs from public API
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

function renderDogs(dogs) {
  petList.innerHTML = "";
  dogs.forEach((dog) => {
    const card = document.createElement("div");
    card.className = "pet-card";

    card.innerHTML = `
      <img src="${dog.image}" alt="${dog.name}" class="pet-img">
      <h3>${dog.name}</h3>
      <p><strong>Age:</strong> ${dog.age}</p>
      <button class="like-btn">${dog.liked ? "♥ Liked" : "♡ Like"}</button>
      <button class="adopt-btn">Adopt</button>
    `;

    card
      .querySelector(".like-btn")
      .addEventListener("click", () => toggleLike(dog.id));
    card
      .querySelector(".adopt-btn")
      .addEventListener("click", () => confirmAdopt(dog.id));

    petList.appendChild(card);
  });

  renderLikedDogs();
}

function renderLikedDogs() {
  likedList.innerHTML = "";
  const likedDogs = dogList.filter((d) => d.liked);
  likeCount.textContent = likedDogs.length;

  likedDogs.forEach((dog) => {
    const li = document.createElement("li");
    li.textContent = `${dog.name} (${dog.age})`;
    likedList.appendChild(li);
  });
}

function toggleLike(id) {
  const dog = dogList.find((d) => d.id === id);
  dog.liked = !dog.liked;
  updateLocalStorage();
  renderDogs(dogList);
}

function confirmAdopt(id) {
  const dog = dogList.find((d) => d.id === id);
  dogToAdopt = id;
  confirmText.textContent = `Are you sure you want to adopt ${dog.name}?`;
  confirmModal.classList.remove("hidden");
}

confirmYes.addEventListener("click", () => {
  dogList = dogList.filter((d) => d.id !== dogToAdopt);
  dogToAdopt = null;
  confirmModal.classList.add("hidden");
  updateLocalStorage();
  renderDogs(dogList);
});

confirmNo.addEventListener("click", () => {
  confirmModal.classList.add("hidden");
  dogToAdopt = null;
});

// Add new dog manually
addDogForm.addEventListener("submit", (e) => {
  e.preventDefault();

  const newDog = {
    id: Date.now(),
    name: document.getElementById("dog-name").value,
    age: document.getElementById("dog-age").value,
    image: document.getElementById("dog-image").value,
    liked: false,
  };

  dogList.unshift(newDog);
  updateLocalStorage();
  renderDogs(dogList);
  addDogForm.reset();
});

// Save to localStorage
function updateLocalStorage() {
  localStorage.setItem("dogList", JSON.stringify(dogList));
}

// Random Name + Age Generator
function getRandomName() {
  const adjectives = [
    "Happy",
    "Fluffy",
    "Brave",
    "Tiny",
    "Sunny",
    "Snappy",
    "Cuddly",
    "Bouncy",
  ];
  const nouns = [
    "Biscuit",
    "Pumpkin",
    "Mango",
    "Noodle",
    "Pebble",
    "Waffle",
    "Ziggy",
  ];
  const adj = adjectives[Math.floor(Math.random() * adjectives.length)];
  const noun = nouns[Math.floor(Math.random() * nouns.length)];
  return `${adj} ${noun}`;
}

function getRandomAge() {
  if (Math.random() < 0.3) {
    const months = Math.floor(Math.random() * 10) + 1;
    return `${months} month${months > 1 ? "s" : ""}`;
  } else {
    const years = Math.floor(Math.random() * 15) + 1;
    return `${years} year${years > 1 ? "s" : ""}`;
  }
}
