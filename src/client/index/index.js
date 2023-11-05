/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */

const user = JSON.parse(localStorage.getItem("user"));

if (user) {
  const profileDiv = document.querySelector("#profile");
  profileDiv.querySelector("span").innerHTML = `Hello <b>${user.username}</b>`;

  const logoutButton = profileDiv.querySelector("#logout");
  logoutButton.addEventListener("click", () => {
    localStorage.removeItem("user");
    location.href = "/login";
  });

  document.querySelector("#add-note button").addEventListener("click", (e) => {
    const { target } = e;
    const parent = target.closest("#add-note");
    const title = parent.querySelector(".title").value;
    const body = parent.querySelector(".body").value;
    const favorite = !!parent.querySelector(".favorite").value;
    const user = JSON.parse(localStorage.getItem("user"));
    console.log(title, body);
    void fetch("/notes", {
      method: "POST",
      body: {
        title,
        body,
        favorite,
        username: user.username,
      },
      headers: {
        "Content-Type": "application/json",
      },
    });
  });

  document.querySelector("#notes")?.addEventListener("click", (e) => {
    const { target } = e;
    const noteLi = target.closest("li");

    if (target.classList.contains("edit")) noteLi.classList.add("editing");
    else if (target.classList.contains("save")) {
      const { id } = noteLi;
      const title = noteLi.querySelector(".title").value;
      const body = noteLi.querySelector(".body").value;
      const favorite = !!noteLi.querySelector(".favorite").value;

      void fetch("/notes", {
        method: "PATCH",
        body: {
          id,
          title,
          body,
          favorite,
        },
      });
    }
  });

  document.documentElement.classList.remove("anonymous");
} else {
  location.href = "/login";
}
