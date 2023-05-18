const root = document.querySelector(":root");
const input = document.querySelector(".input");

const moviesContainer = document.querySelector(".movies-container");
const btnLeft = document.querySelector(".btn-prev");
const btnRight = document.querySelector(".btn-next");
const moviesToDelete = document.querySelector(".movies");
const modal = document.querySelector(".modal");
const imgModal = document.querySelector(".modal .modal__img");
const titleModal = document.querySelector(".modal__title");
const descriptionModal = document.querySelector(".modal__description");
const modalGenres = document.querySelector(".modal__genres");
const averageModal = document.querySelector(".modal__average");
const modalClose = document.querySelector(".modal__close");
const headerContainer = document.querySelector(".header__container-logo");

const highlight = document.querySelector(".highlight");
const highlightTitle = document.querySelector(".highlight__title");
const highlightRating = document.querySelector(".highlight__rating");
const highlightGenres = document.querySelector(".highlight__genres");
const highlightLaunch = document.querySelector(".highlight__launch");
const highlightDescription = document.querySelector(".highlight__description");
const highlightVideoLink = document.querySelector(".highlight__video-link");
const highlightVideo = document.querySelector(".highlight__video");
const playIcon = document.querySelector(".highlight__video img");

const btnTheme = document.querySelector(".btn-theme");

let carouselPage1 = [];
let carouselPage2 = [];
let carouselPage3 = [];

let pages = [carouselPage1, carouselPage2, carouselPage3];

let currentIndexPages = 0;
let indexRatingTitle = 0;

headerContainer.addEventListener("click", () => {
  document.location.reload(true);
});

function separateImg(arrFilms) {
  for (let i = 0; i < 18; i++) {
    if (arrFilms[i]) {
      if (i < 6) {
        carouselPage1.push(arrFilms[i].poster_path);
      } else if (i < 12) {
        carouselPage2.push(arrFilms[i].poster_path);
      } else {
        carouselPage3.push(arrFilms[i].poster_path);
      }
    } else {
      if (i < 6) {
        carouselPage1.splice(i, 1);
      } else if (i < 12) {
        carouselPage2.splice(i - 6, 1);
      } else {
        carouselPage3.splice(i - 12, 1);
      }
    }
  }
  pages = pages.filter((page) => page.length > 0);
}

function createMovieElements(arrFilms) {
  moviesToDelete.innerHTML = "";

  for (let i = 0; i < pages[currentIndexPages].length; i++) {
    const divMovie = document.createElement("div");
    divMovie.classList.add("movie");
    divMovie.style.backgroundImage = `url(${pages[currentIndexPages][i]})`;
    divMovie.setAttribute("id", indexRatingTitle);

    const infoMovie = document.createElement("div");
    infoMovie.classList.add("movie__info");

    const movieTitle = document.createElement("span");
    movieTitle.classList.add("movie__title");
    movieTitle.textContent = arrFilms[indexRatingTitle].title;
    movieTitle.style.color = "white";

    const movieRating = document.createElement("span");
    movieRating.classList.add("movie__rating");
    movieRating.textContent =
      arrFilms[indexRatingTitle].vote_average.toFixed(1);
    movieRating.style.color = "#fff";

    const movieRatingImg = document.createElement("img");
    movieRatingImg.src = "./assets/estrela.svg";
    movieRatingImg.alt = "Estrela";

    moviesToDelete.appendChild(divMovie);
    divMovie.appendChild(infoMovie);
    infoMovie.appendChild(movieTitle);
    infoMovie.appendChild(movieRating);
    movieRating.appendChild(movieRatingImg);

    if (indexRatingTitle < 17) {
      indexRatingTitle++;
    } else {
      indexRatingTitle = 0;
    }

    divMovie.addEventListener("click", (e) => {
      loadDataModal(arrFilms[divMovie.id].id);

      modal.classList.remove("hidden");
      titleModal.textContent = arrFilms[divMovie.id].title;
      imgModal.src = arrFilms[divMovie.id].backdrop_path;
      descriptionModal.textContent = arrFilms[divMovie.id].overview;
      averageModal.textContent = arrFilms[divMovie.id].vote_average;
    });
  }
}

async function loadDataModal(IdFilm) {
  const response = await api.get(`movie/${IdFilm}?language=pt-BR`);
  const genres = response.data.genres;

  for (let i = 0; i < genres.length; i++) {
    const genreModal = document.createElement("span");
    genreModal.classList.add("modal__genre");
    genreModal.textContent = genres[i].name;
    modalGenres.appendChild(genreModal);
  }
}

modalClose.addEventListener("click", () => {
  modal.classList.add("hidden");
  modalGenres.innerHTML = "";
});
modal.addEventListener("click", () => {
  modal.classList.add("hidden");
  modalGenres.innerHTML = "";
});

let allMovies = [];

async function getFilm() {
  try {
    const response = await api.get(
      "/discover/movie?primary_release_date.gte=2014-09-15&primary_release_date.lte=2014-10-22"
    );
    const arrFilms = response.data.results;

    separateImg(arrFilms);
    createMovieElements(arrFilms);

    allMovies = arrFilms;
  } catch (error) {}
}

getFilm();

async function searchFilm() {
  try {
    const query = encodeURI(input.value);
    const response = await api.get(
      `/search/movie?${apiKey}language=pt-BR&include_adult=false&query=${query}`
    );
    const arrFilms = response.data.results;

    separateImg(arrFilms);
    createMovieElements(arrFilms);

    allMovies = arrFilms;
  } catch (error) {}
}

btnLeft.addEventListener("click", () => {
  currentIndexPages--;

  if (currentIndexPages < 0) {
    currentIndexPages = pages.length - 1;
  }

  if (currentIndexPages <= 0) {
    indexRatingTitle = 0;
  } else if (currentIndexPages === 2) {
    indexRatingTitle = 12;
  } else if (currentIndexPages === 1) {
    indexRatingTitle = 6;
  }

  createMovieElements(allMovies);
});

btnRight.addEventListener("click", () => {
  currentIndexPages++;

  if (currentIndexPages >= pages.length) {
    currentIndexPages = 0;
  }

  if (currentIndexPages === 0) {
    indexRatingTitle = 0;
  } else if (currentIndexPages === 1) {
    indexRatingTitle = 6;
  } else if (currentIndexPages === 2) {
    indexRatingTitle = 12;
  }

  createMovieElements(allMovies);
});

input.addEventListener("keydown", (event) => {
  if (event.key === "Enter") {
    event.value = input.value;
    carouselPage1 = [];
    carouselPage2 = [];
    carouselPage3 = [];

    pages = [carouselPage1, carouselPage2, carouselPage3];

    currentIndexPages = 0;
    indexRatingTitle = 0;

    searchFilm();

    input.value = "";
  }
});

function createFeaturedMovie(arrFilms) {
  highlightVideo.style.backgroundImage = `url(${arrFilms.backdrop_path})`;
  highlightVideo.style.backgroundSize = `cover`;
  highlightTitle.textContent = arrFilms.title;
  highlightRating.textContent = arrFilms.vote_average.toFixed(1);
  highlightLaunch.textContent = new Date(
    arrFilms.release_date
  ).toLocaleDateString("pt-BR", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
  highlightDescription.textContent = arrFilms.overview;
}

async function DailyFilm() {
  const response = await api.get("movie/436969?language=pt-BR");
  const featuredMovie = response.data;
  const genres = response.data.genres;

  const responseVideo = await api.get(`/movie/${featuredMovie.id}/videos`);
  const video = responseVideo.data;

  highlightVideoLink.href = `https://www.youtube.com/watch?v=${video.results[0].key}`;

  for (let i = 0; i < genres.length; i++) {
    highlightGenres.textContent = genres[i].name;
  }

  createFeaturedMovie(featuredMovie);
}

DailyFilm();

!localStorage.getItem("currentThemeSrc")
  ? localStorage.setItem("currentThemeSrc", "./assets/light-mode.svg")
  : localStorage.getItem("currentThemeSrc");

btnTheme.src = localStorage.getItem("currentThemeSrc");

function sun() {
  root.style.setProperty("--bg-secondary", "#ededed");
  root.style.setProperty("--text-color", "#1b2028");
  root.style.setProperty("--background", "#fff");
  btnLeft.src = "./assets/arrow-left-dark.svg";
  btnRight.src = "./assets/arrow-right-dark.svg";
  modalClose.src = "./assets/close-dark.svg";
  input.style.backgroundColor = "#fff";
  input.style.border = "1px solid #979797";
}

function moon() {
  root.style.setProperty("--bg-secondary", "#2D3440");
  root.style.setProperty("--text-color", "white");
  root.style.setProperty("--background", "#1B2028");
  root.style.setProperty("--bg-modal", "#2D3440");
  root.style.setProperty("--highlight-background", "#2D3440");
  input.style.border = "1px solid #665F5F";
  input.style.backgroundColor = "#3e434c";

  btnLeft.src = "./assets/arrow-left-light.svg";
  btnRight.src = "./assets/arrow-right-light.svg";
  modalClose.src = "./assets/close.svg";
}

const currentBgSrc = localStorage.getItem("currentThemeSrc");

function sunToMoon() {
  if (currentBgSrc === "./assets/dark-mode.svg") {
    moon();
  } else {
    sun();
  }
}

sunToMoon();

btnTheme.addEventListener("click", () => {
  const currentBgSrc = localStorage.getItem("currentThemeSrc");

  if (currentBgSrc === "./assets/light-mode.svg") {
    localStorage.setItem("currentThemeSrc", "./assets/dark-mode.svg");
    btnTheme.src = localStorage.getItem("currentThemeSrc");
    moon();
    return;
  } else if (currentBgSrc === "./assets/dark-mode.svg") {
    localStorage.setItem("currentThemeSrc", "./assets/light-mode.svg");
    btnTheme.src = localStorage.getItem("currentThemeSrc");
    sun();
    return;
  }
});
