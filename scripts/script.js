import JSONFormatter from "json-formatter-js";

const bodyForm = document.querySelector(".body-form");
const body = document.querySelector(".body");
const inputNone = document.querySelector(`input[value="none"]`);
const btnSend = document.querySelector(".btn-send");
const responseBox = document.querySelector(".response__box");
const optionsKey = document.querySelector(".options__key");
const optionsValue = document.querySelector(".options__value");
const optionsBtn = document.querySelector(".options__add");
const optionsBox = document.querySelector(".option");
const requestForm = document.querySelector(".request");
const codeBox = document.querySelector("#code-box");
const errorBox = document.querySelector(".error");

inputNone.checked = true;

console.log("welcome to the application");

/**
 * @description This object will store all the key, value header option entered by user
 * @type {Object}
 */

const option = {};

/**
 * @description Will return new JSONFormatter object that can be used for rendering the formatted json markup in frontend
 * @param {JSON} data
 * @returns Object (JSONFormatter)
 * @package JSONFormatter
 * 
 */

const formatJson = function (data) {
  return new JSONFormatter(data);
};


/**
 * @description This function will return the javascript object from the json 
 * @param {JSON} obj 
 * @returns {Object}
 */
const getJsonObj = function (obj) {
  try {
    const val = obj.split("\n").join("");
    return JSON.parse(val);
  } catch (err) {
    renderError(err.message);
  }
};

const renderSpinner = (el)=>{
  const markup = `
  <div style='text-align:center'>
        <svg version="1.1" id="Layer_1" class="svg" xmlns="http://www.w3.org/2000/svg"
            xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 367.136 367.136"
            style="enable-background:new 0 0 367.136 367.136;" xml:space="preserve">
            <path d="M185.262,1.694c-34.777,0-68.584,9.851-97.768,28.488C59.1,48.315,36.318,73.884,21.613,104.126l26.979,13.119
	c25.661-52.77,78.03-85.551,136.67-85.551c83.743,0,151.874,68.13,151.874,151.874s-68.131,151.874-151.874,151.874
	c-49.847,0-96.44-24.9-124.571-65.042l53.219-52.964H0v113.365l39.14-38.953c13.024,17.561,29.147,32.731,47.731,44.706
	c29.33,18.898,63.353,28.888,98.391,28.888c100.286,0,181.874-81.588,181.874-181.874S285.548,1.694,185.262,1.694z" />
            <g></g>
            <g></g>
            <g></g>
            <g></g>
            <g></g>
            <g></g>
            <g></g>
            <g></g>
            <g></g>
            <g></g>
            <g></g>
            <g></g>
            <g></g>
            <g></g>
            <g></g>
        </svg>
    </div>
  
  `;
  el.insertAdjacentHTML('afterbegin',markup);
}

const renderError = (msg) => {
  errorBox.classList.remove("hidden");
  errorBox.firstElementChild.textContent = msg;

  setTimeout(() => {
    errorBox.classList.add("hidden");
  }, 5000);
};

const getURLEnocdedFormData = function () {
  const data = Object.fromEntries(new FormData(body));
  const searchParams = new URLSearchParams();
  delete data["key"];
  delete data["value"];

  Object.entries(data).forEach((val) => {
    searchParams.append(val[0], val[1]);
  });

  return searchParams;
};

const getMultipartFormData = function () {
  const newFrom = new FormData();
  const data = Object.fromEntries(new FormData(body));
  delete data["key"];
  delete data["value"];

  Object.entries(data).forEach((val) => {
    newFrom.append(val[0], val[1]);
  });

  return newFrom;
};

const getRawData = function () {
  const data = body.firstElementChild.value;

  return data;
};

const getResponseData = async function (res, headers) {
  let data;
  if (headers["content-type"].includes("json")) {
    data = await res.json();
    data = JSON.stringify(data);
  } else if (headers["content-type"].includes("FormData")) {
    data = await res.formData();
    data = JSON.stringify(data);
  } else {
    data = await res.text();
  }

  return data;
};

const getBodyFormJson = function () {
  const data = Object.fromEntries(new FormData(body));
  return data["body-data"];
};

const renderUrlEncodedFormMarkup = function () {
  const markup = `
  <input type="text" name="key" id="key" class="input__text">
  <input type="text" name="value" id="key" class="input__text">
  <input type="submit" value="Add" class="btn btn__crimson">
  `;

  body.innerHTML = "";
  body.insertAdjacentHTML("afterbegin", markup);
};

const renderJsonFormMarkup = function () {
  const markup = `
  <textarea name="body-data" class=" body-data input__text-area" id="" cols="30" rows="10" placeholder="Please put data in json form using quotes"></textarea>
  `;

  body.innerHTML = " ";

  body.insertAdjacentHTML("afterbegin", markup);
};

const renderUrlEncodedItemMarkup = function (data) {
  const markup = `
  <div class="group body__item">
  <label class="padding-small">${data.key}</label>
  <input type="text" name="${data.key
    .split(" ")
    .join("_")}" class="input__text" value=${data.value}>
  <input type="button" value="Remove" class="btn btn__remove btn__crimson">
</div>
  `;
  body.reset();
  body.insertAdjacentHTML("afterbegin", markup);
};

bodyForm.addEventListener("change", function () {
  const value = Object.fromEntries(new FormData(requestForm));

  if (value.body__type === "none") {
    body.innerHTML = "";
  } else if (
    value.body__type === "application/x-www-form-urlencoded;charset=UTF-8" ||
    value.body__type === "multipart/form-data"
  ) {
    renderUrlEncodedFormMarkup();
  } else {
    renderJsonFormMarkup();
  }
});

body.addEventListener("submit", function (e) {
  e.preventDefault();
  const data = Object.fromEntries(new FormData(body));
  console.log(data);

  renderUrlEncodedItemMarkup(data);
});

body.addEventListener("click", function (e) {
  if (e.target.classList.contains("btn__remove")) {
    e.target.parentElement.remove();
  }
});

optionsBtn.addEventListener("click", function () {
  const key = optionsKey.value;
  const value = optionsValue.value;

  console.log(key, value);
  if (!key || !value) return;

  option[key] = value;

  optionsKey.value = "";
  optionsValue.value = "";

  const markup = `
            <div class="option__item">
            <label class="value">${key}</label>
            <label class="value">${value}</label>
            <input type="button" value="Remove" class="btn btn__crimson option__btn-remove">
        </div>
    `;

  this.parentElement.insertAdjacentHTML("beforebegin", markup);
});

optionsBox.addEventListener("click", function (e) {
  if (e.target.classList.contains("option__btn-remove")) {
    const ele = e.target.parentElement;

    const value = ele.querySelector(".value").textContent;

    delete option[value];

    ele.remove();
    
  }
});

btnSend.addEventListener("click", async function () {
  try {
    const requestOBJ = Object.fromEntries(new FormData(requestForm));

    const fetchOption = {
      method: requestOBJ["request-type"],
      ...option,
    };

    
    fetchOption.headers = {};

    if (requestOBJ.body__type !== "none") {
      fetchOption.headers["Content-Type"] = requestOBJ.body__type;

      let bodyData;

      if (requestOBJ.body__type === "application/json") {
        bodyData = getBodyFormJson();
        bodyData = getJsonObj(bodyData);
        bodyData = JSON.stringify(bodyData);
      } else if (
        requestOBJ.body__type ===
        `application/x-www-form-urlencoded;charset=UTF-8`
      ) {
        bodyData = getURLEnocdedFormData();
      } else if (requestOBJ.body__type === `multipart/form-data`) {
        bodyData = getMultipartFormData();
      } else {
        bodyData = getRawData();
      }

    

      fetchOption.body = bodyData;
    }


    renderSpinner(responseBox);

    const res = await fetch(requestOBJ.url, fetchOption);


    const { type, url, redirected, status, ok, statusText, body } = res;
    const headers = Object.fromEntries(res.headers);

    const resObj = {
      type,
      url,
      redirected,
      status,
      ok,
      statusText,
      headers,
      body,
    };


    const resJson = formatJson(resObj);
    responseBox.innerHTML = "";

    responseBox.append(resJson.render());
    let data = await getResponseData(res, headers);

    if(headers['content-type'].includes('application/json')){
      data = JSON.stringify(JSON.parse(data),null,4);
    }


    codeBox.innerHTML = data;
    Prism.highlightAll();
  } catch (err) {
    responseBox.innerHTML = "";
  
    renderError(`${err.message} , Please check the network tab if nessacery`);
  }
});

