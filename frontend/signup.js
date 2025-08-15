const form = document.querySelector("#signup-form");

const checkPassword = () => {
  const formData = new FormData(form);
  const pw = formData.get("password");
  const pwCheck = formData.get("passwordCheck");

  if (pw == pwCheck) {
    return true;
  } else return false;
};

const handleSubmit = async (e) => {
  e.preventDefault();
  const formData = new FormData(form);
  // 비번 암호화
  const sha256Pw = sha256(formData.get("password"));
  formData.set("password", sha256Pw);

  if (checkPassword()) {
    const res = await fetch("/signup", {
      method: "post",
      body: formData,
    });
    const data = await res.json();
    if (data === "200") {
      alert("환영합니다 😎🍎");
      window.location.pathname = "/login.html";
    }
  } else {
    alert("비밀번호가 같지 않습니다. 다시 입력해주세요.");
  }
};

form.addEventListener("submit", handleSubmit);
