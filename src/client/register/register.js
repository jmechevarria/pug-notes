/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */

const user = JSON.parse(localStorage.getItem("user"));

if (user) {
  location.href = "/";
}

document.querySelector("#register button").addEventListener("click", (e) => {
  const { target } = e;
  const parent = target.closest("#register");
  const username = parent.querySelector("#username").value;
  const password = parent.querySelector("#password").value;

  fetch("/register", {
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
      const body = await response.json();
      if (response.ok) {
        localStorage.setItem("user", JSON.stringify(body.user));
        location.href = "/";
      } else {
        const error = body;
        console.log(response, error, error.message);
        document.querySelector("#registerError").textContent = String(
          response.status,
        ).startsWith("5")
          ? "Server error"
          : error.message || "Server error";
      }
    })
    .catch((error) => {
      console.error(error);
    });
});
