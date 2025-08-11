const calcTime = (timestamp) => {
  // 한국 시간으로 계산됨 (UTC + 9시간)
  const curTime = new Date().getTime() - 9 * 60 * 60 * 1000; // 9*60분*60초*1초 = 9시간
  const time = new Date(curTime - timestamp);
  const hour = time.getHours();
  const minute = time.getMinutes();
  const second = time.getSeconds();

  if (hour > 0) return `${hour}시간 전`;
  else if (minute > 0) return `${minute}분 전`;
  else if (second > 0) return `${second}초 전`;
  else return "방금 전";
};

const renderData = (data) => {
  const main = document.querySelector(".item-list-overflow");

  data.reverse().forEach(async (obj) => {
    // item-list
    const itemListDiv = document.createElement("div");
    itemListDiv.classList.add("item-list");

    // item-list__img
    const imgDiv = document.createElement("div");
    imgDiv.classList.add("item-list__img");
    const imgTag = document.createElement("img");

    const res = await fetch(`/items/${obj.id}`);
    const blob = await res.blob();
    const url = URL.createObjectURL(blob);
    imgTag.src = url;
    imgTag.alt = "image";
    imgDiv.appendChild(imgTag);
    itemListDiv.appendChild(imgDiv);

    // item-list__info
    const infoDiv = document.createElement("div");
    infoDiv.classList.add("item-list__info");

    // item-list__info-title, item-list__info-meta, item-list__info-price
    const infoTitleDiv = document.createElement("div");
    infoTitleDiv.classList.add("item-list__info-title");
    const infoMetaDiv = document.createElement("div");
    infoMetaDiv.classList.add("item-list__info-meta");
    const infoPriceDiv = document.createElement("div");
    infoPriceDiv.classList.add("item-list__info-price");
    infoTitleDiv.innerText = obj.title;
    infoMetaDiv.innerText = obj.place + " " + calcTime(obj.insertAt);
    infoPriceDiv.innerText = obj.price;
    infoDiv.appendChild(infoTitleDiv);
    infoDiv.appendChild(infoMetaDiv);
    infoDiv.appendChild(infoPriceDiv);
    itemListDiv.appendChild(infoDiv);

    main.appendChild(itemListDiv);
  });
};

const fetchList = async () => {
  const res = await fetch("/items");
  const data = await res.json();
  renderData(data);
};

fetchList();
