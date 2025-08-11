const form = document.getElementById("write-form");

const handleSubmitForm = async (e) => {
  e.preventDefault();
  const body = new FormData(form);
  body.append("insertAt", new Date().getTime()); // 세계 시각 기준으로 보내짐
  try {
    const res = await fetch("/items", {
      method: "POST",
      body,
    });

    const resJson = await res.json();
    if (resJson === "200") {
      window.location.pathname = "/";
    }
  } catch (e) {
    console.error("error: ", e);
  }
};

form.addEventListener("submit", handleSubmitForm);
