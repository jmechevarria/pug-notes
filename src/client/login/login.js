/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */

const user = JSON.parse(localStorage.getItem("user"));

if (user) {
  location.href = "/";
}

document.querySelector("#login button").addEventListener("click", (e) => {
  const { target } = e;
  const parent = target.closest("#login");
  const username = parent.querySelector("#username").value;
  const password = parent.querySelector("#password").value;

  fetch("/login", {
    method: "POST",
    body: JSON.stringify({
      username,
      password,
    }),
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then(async (response) => {
      if (response.ok) {
        const body = await response.json();
        localStorage.setItem("user", JSON.stringify(body.user));
        location.href = "/";
      } else {
        const error = await response.json();
        console.log(response, error, error.message);
        document.querySelector("#loginError").textContent = String(
          response.status
        ).startsWith("5")
          ? "Server error"
          : error.message || "Server error";
      }
    })
    .catch((error) => {
      console.error(error);
    });
});
