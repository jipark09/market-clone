const form = document.querySelector("#login-form");
const loginDiv = document.querySelector(".login-div");

const handleSubmit = async (e) => {
  e.preventDefault();
  const formData = new FormData(form);
  // 비번 암호화
  const sha256Pw = sha256(formData.get("password"));
  formData.set("password", sha256Pw);

  const res = await fetch("/login", {
    method: "post",
    body: formData,
  });
  const data = await res.json();

  const accessToken = data.access_token;
  window.localStorage.setItem("token", accessToken); // 로컬 스토리지에 토큰 저장
  console.log("서버에서 받음: ", accessToken);

  if (res.status === 200) {
    const isBtn = document.querySelector(".item-btn");
    if (!isBtn) {
      alert("로그인 성공 😎🍎");
      // const btn = document.createElement("button");
      // btn.innerText = "상품 가져오기";
      // btn.type = "button";
      // btn.classList.add("item-btn");

      // btn.addEventListener("click", async (e) => {
      //   console.log(accessToken);
      //   const res = await fetch("/items", {
      //     headers: {
      //       Authorization: `Bearer ${accessToken}`,
      //     },
      //   });
      //   const data = await res.json();
      //   console.log(data);
      // });
      window.location.pathname = "/";
      // loginDiv.appendChild(btn);
    }
  } else if (res.status === 401) {
    alert("id 혹은 pw가 틀렸습니다.");
  }
};

form.addEventListener("submit", handleSubmit);
