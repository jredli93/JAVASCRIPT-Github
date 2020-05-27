class GITHUB {
  constructor() {
    this.client_id = "9e756a64deea150b0f18";
    this.client_secret = "52c40f8b1622d77c8f64709a34978216638f4e3a";
    this.base = "https://api.github.com/users/";
  }

  async getUser(username) {
    const url = `${this.base}${username}?client_id='${this.client_id}'&client_secret='${this.client_secret}'`;
    const reposURL = `${this.base}${username}/repos?client_id='${this.client_id}'&client_secret='${this.client_secret}'`;

    const userData = await fetch(url);
    const user = await userData.json();

    const reposData = await fetch(reposURL);
    const repos = await reposData.json();

    return { user, repos };
  }
}

class UI {
  getUserData(user) {
    const {
      name,
      url,
      public_repos: repos,
      avatar_url: img,
      message,
      login,
    } = user;
    this.displayUser(name, url, repos, img, message, login);
  }

  displayRepos(repos) {
    const btn = document.getElementById("getRepos");
    repos.forEach((repo) => {
      let link = document.createElement("p");
      link.innerHTML = `<a href='${repo.html_url}'>${repo.name}</a>`;

      btn.appendChild(link);
    });
  }

  showFeedback(text) {
    const feedback = document.querySelector(".feedback");

    feedback.classList.add("showItem");
    feedback.textContent = text;
    setTimeout(() => {
      feedback.classList.remove("showItem");
    }, 2500);
  }

  displayUser(name, url, repos, img, message, login) {
    if (message == "Not Found") {
      this.showFeedback(message);
    } else {
      const div = document.createElement("div");
      const gitUserDiv = document.getElementById("github-users");
      div.classList.add("row", "single-user", "my-3");
      div.innerHTML = `<div class=" col-sm-6 col-md-4 user-photo my-2">
       <img src="${img} " class="img-fluid" alt="">
      </div>
      <div class="col-sm-6 col-md-4 user-info text-capitalize my-2">
       <h6>name : <span>${name} </span></h6>
       <h6>github : <a href="${url}" class="badge badge-primary">link </a> </h6>
       <h6>public repos : <span class="badge badge-success">${repos} </span> </h6>
      </div>
      <div class=" col-sm-6 col-md-4 user-repos my-2">
       <button type="button" data-id='${login}' id="getRepos" class="btn reposBtn text-capitalize mt-3">
        get repos
       </button>
      </div>`;
      gitUserDiv.appendChild(div);
    }
  }
}

(function () {
  const inputSearch = document.getElementById("searchUser");
  const submitForm = document.getElementById("searchForm");
  const userList = document.getElementById("github-users");

  const github = new GITHUB();
  const ui = new UI();

  submitForm.addEventListener("submit", (event) => {
    event.preventDefault();

    const inputValue = inputSearch.value;

    if (inputValue === "") {
      ui.showFeedback("Please enter user");
    } else {
      github.getUser(inputValue).then((data) => {
        ui.getUserData(data.user);
      });
    }
  });

  userList.addEventListener("click", (event) => {
    event.preventDefault();
    const username = event.target.dataset.id;
    github.getUser(username).then((data) => ui.displayRepos(data.repos));
  });
})();
