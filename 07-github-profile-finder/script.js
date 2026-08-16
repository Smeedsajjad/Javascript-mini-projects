const searchInput = document.querySelector("input");

const resultInfo = document.querySelector(".result-info");
const totalResult = document.querySelector("#total_results");
const searched = document.querySelector("#searched");

const cardsSection = document.querySelector("section.cards");

const pagination = document.querySelector("#pagination");
const previousButton = document.querySelector("#previous");
const nextButton = document.querySelector("#next");
const pageNumbers = document.querySelector("#page_numbers");

const detailsSection = document.querySelector(".details");
const backButton = document.querySelector("#back-button");

const profileAvatar = document.querySelector(".profile-avatar");
const profileName = document.querySelector(".profile-name");
const profileUsername = document.querySelector(".username");
const profileBio = document.querySelector(".bio");

const followersCount = document.querySelector(".followers-count");
const followingCount = document.querySelector(".following-count");
const repoCount = document.querySelector(".repo-count");

const repoCountBadge = document.querySelector(".repo-count-badge");
const repoList = document.querySelector(".repo-list");

const followButton = document.querySelector(".follow-btn");


let url = "https://api.github.com";

let currentPage = 1;
let perPage = 10;
let totalPages = 1;
let currentSearch = "";
let timer;


/* =========================================
   SEARCH USERS
========================================= */

async function search(search, page) {

    if (!search.trim()) {

        cardsSection.innerHTML = "";

        resultInfo.hidden = true;
        pagination.hidden = true;

        pageNumbers.innerHTML = "";

        previousButton.disabled = true;
        nextButton.disabled = true;

        totalResult.textContent = "0";
        searched.textContent = "";

        return;
    }

    try {

        const response = await fetch(
            `${url}/search/users?q=${encodeURIComponent(search)}&page=${page}&per_page=${perPage}`
        );

        if (!response.ok) {
            throw new Error(
                `HTTP error! status: ${response.status}`
            );
        }

        const data = await response.json();

        totalPages = Math.ceil(
            data.total_count / perPage
        );

        totalResult.textContent =
            data.total_count.toLocaleString();

        searched.textContent = search;

        cardsSection.innerHTML = "";

        /* No results */

        if (data.total_count === 0) {

            resultInfo.hidden = false;

            resultInfo.innerHTML = `
                <span>
                    No results found for
                    <strong>${search}</strong>
                </span>
            `;

            pagination.hidden = true;

            pageNumbers.innerHTML = "";

            previousButton.disabled = true;
            nextButton.disabled = true;

            return;
        }

        /* Show result information */

        resultInfo.hidden = false;

        resultInfo.innerHTML = `
            <span>
                Found
                <strong id="total_results">
                    ${data.total_count.toLocaleString()}
                </strong>
                results for
                <strong id="searched">
                    ${search}
                </strong>
            </span>
        `;

        /* Create cards */

        data.items.forEach((user) => {

            const profileCard = `
                <article
                    class="card"
                    data-username="${user.login}"
                >

                    <img
                        src="${user.avatar_url}"
                        alt="${user.login}"
                    />

                    <div class="card-info">

                        <h2>${user.login}</h2>

                        <p>@${user.login}</p>

                        <span class="view-profile">
                            View profile →
                        </span>

                    </div>

                </article>
            `;

            cardsSection.insertAdjacentHTML(
                "beforeend",
                profileCard
            );
        });

        renderPagination();

    } catch (error) {

        console.error(error);

        cardsSection.innerHTML = `
            <p>
                Something went wrong while searching.
            </p>
        `;
    }
}


/* =========================================
   SEARCH INPUT
========================================= */

searchInput.addEventListener("input", () => {

    clearTimeout(timer);

    timer = setTimeout(() => {

        const searchTerm =
            searchInput.value.trim();

        currentSearch = searchTerm;

        currentPage = 1;

        search(
            currentSearch,
            currentPage
        );

    }, 500);
});


/* =========================================
   CARD CLICK
========================================= */

cardsSection.addEventListener("click", (event) => {

    const card =
        event.target.closest(".card");

    if (!card) return;

    const username =
        card.dataset.username;

    showProfile(username);
});


/* =========================================
   SHOW PROFILE
========================================= */

async function showProfile(username) {

    try {

        /* Hide search page */

        cardsSection.hidden = true;
        pagination.hidden = true;
        resultInfo.hidden = true;

        /* Show profile page */

        detailsSection.hidden = false;

        profileName.textContent =
            "Loading...";

        profileUsername.textContent = "";

        profileBio.textContent = "";

        repoList.innerHTML =
            "<p>Loading repositories...</p>";

        /* Get user */

        const profileResponse =
            await fetch(
                `${url}/users/${encodeURIComponent(username)}`
            );

        if (!profileResponse.ok) {
            throw new Error(
                `Profile request failed: ${profileResponse.status}`
            );
        }

        const profile =
            await profileResponse.json();


        /* Profile information */

        profileAvatar.src =
            profile.avatar_url;

        profileAvatar.alt =
            profile.login;

        profileName.textContent =
            profile.name || profile.login;

        profileUsername.textContent =
            `@${profile.login}`;

        profileBio.textContent =
            profile.bio ||
            "This user has no bio.";


        /* Statistics */

        followersCount.textContent =
            profile.followers.toLocaleString();

        followingCount.textContent =
            profile.following.toLocaleString();

        repoCount.textContent =
            profile.public_repos.toLocaleString();

        repoCountBadge.textContent =
            profile.public_repos.toLocaleString();


        /* GitHub button */

        followButton.onclick = () => {

            window.open(
                profile.html_url,
                "_blank",
                "noopener,noreferrer"
            );

        };


        /* Get repositories */

        await loadRepositories(username);


        /* Scroll to profile */

        detailsSection.scrollIntoView({
            behavior: "smooth",
            block: "start"
        });

    } catch (error) {

        console.error(error);

        profileName.textContent =
            "Unable to load profile";

        profileBio.textContent =
            "Something went wrong while loading this profile.";

        repoList.innerHTML = "";
    }
}


/* =========================================
   LOAD REPOSITORIES
========================================= */

async function loadRepositories(username) {

    const response =
        await fetch(
            `${url}/users/${encodeURIComponent(username)}/repos?per_page=100&sort=updated`
        );

    if (!response.ok) {
        throw new Error(
            `Repository request failed: ${response.status}`
        );
    }

    const repositories =
        await response.json();

    repoList.innerHTML = "";

    if (repositories.length === 0) {

        repoList.innerHTML = `
            <p class="repo-description">
                This user doesn't have any
                public repositories.
            </p>
        `;

        return;
    }


    repositories.forEach((repo) => {

        const repoCard =
            document.createElement("article");

        repoCard.className =
            "repo-card";

        repoCard.innerHTML = `

            <div class="repo-main">

                <a
                    class="repo-name"
                    href="${repo.html_url}"
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    ${repo.name}
                </a>

                <span class="public-badge">
                    ${repo.private ? "Private" : "Public"}
                </span>

                <p class="repo-description">
                    ${
                        repo.description ||
                        "No description provided."
                    }
                </p>

                <div class="repo-meta">

                    ${
                        repo.language
                            ? `
                                <span class="language">
                                    <span class="language-dot"></span>
                                    ${repo.language}
                                </span>
                            `
                            : ""
                    }

                    <span>
                        ⭐ ${repo.stargazers_count}
                    </span>

                    <span>
                        🍴 ${repo.forks_count}
                    </span>

                </div>

            </div>
        `;

        repoList.appendChild(repoCard);
    });
}


/* =========================================
   PAGINATION
========================================= */

function renderPagination() {

    pageNumbers.innerHTML = "";

    if (totalPages <= 1) {

        pagination.hidden = true;

        return;
    }

    pagination.hidden = false;

    previousButton.disabled =
        currentPage === 1;

    nextButton.disabled =
        currentPage === totalPages;


    for (
        let page = 1;
        page <= totalPages;
        page++
    ) {

        if (
            page === 1 ||
            page === totalPages ||
            Math.abs(page - currentPage) <= 2
        ) {

            const button =
                document.createElement("button");

            button.className =
                "page-number";

            button.textContent =
                page;

            if (page === currentPage) {
                button.classList.add("active");
            }

            button.addEventListener(
                "click",
                () => {

                    currentPage = page;

                    search(
                        currentSearch,
                        currentPage
                    );

                }
            );

            pageNumbers.appendChild(button);

        } else {

            const last =
                pageNumbers.lastElementChild;

            if (
                !last ||
                last.className !== "dots"
            ) {

                const dots =
                    document.createElement("span");

                dots.className = "dots";

                dots.textContent = "…";

                pageNumbers.appendChild(dots);
            }
        }
    }
}


/* =========================================
   PREVIOUS
========================================= */

previousButton.addEventListener(
    "click",
    () => {

        if (currentPage > 1) {

            currentPage--;

            search(
                currentSearch,
                currentPage
            );
        }
    }
);


/* =========================================
   NEXT
========================================= */

nextButton.addEventListener(
    "click",
    () => {

        if (currentPage < totalPages) {

            currentPage++;

            search(
                currentSearch,
                currentPage
            );
        }
    }
);


/* =========================================
   BACK TO SEARCH
========================================= */

backButton.addEventListener(
    "click",
    () => {

        detailsSection.hidden = true;

        cardsSection.hidden = false;

        if (currentSearch) {

            resultInfo.hidden = false;

            pagination.hidden =
                totalPages <= 1;
        }

        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });
    }
);