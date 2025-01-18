var PRINCE_URL = "https://di9wyc1hpf.execute-api.ap-southeast-2.amazonaws.com/v1/prince-lambda-v1-v15";
var API_GATEWAY_REQUEST_LIMIT = 10_000_000;
var API_GATEWAY_REQUEST_LIMIT_DISPLAY = "10Mb";

document.addEventListener("DOMContentLoaded", function() {
  $("#try-html-file input")[0].onchange = handle_file_input_with_textarea;
  $("#try-html-file a")[0].onclick = handle_editing_mode;

  $("#try-css-file input")[0].onchange = handle_file_input_with_textarea;
  $("#try-css-file a")[0].onclick = handle_editing_mode;

  $("#try-other-file input")[0].onchange = handle_file_input;

  $("#try-generate a")[0].onclick = handle_generate_pdf_link;

  $("#try-html-file textarea")[0].innerHTML =
"<!DOCTYPE html>\n\
<html>\n\
  <head>\n\
    <link rel=\"stylesheet\" href=\"prince.css\" />\n\
    <meta charset=\"utf-8\" />\n\
    <title>Prince PDF Example</title>\n\
  </head>\n\
  <body>\n\
    <h1>Hello from Prince!</h1>\n\
    <p>\n\
      This is an example PDF created with <span>Prince</span>.\n\
    </p>\n\
  </body>\n\
</html>";
});

function handle_file_input_with_textarea() {
  if (this.files.length == 0) {
    return;
  }

  let textarea = this.parentElement.getElementsByTagName("textarea")[0];
  let reader = new FileReader();

  reader.onloadend = function() {
    textarea.value = reader.result;
    textarea.style.display = "block";

    let button = textarea.parentElement.getElementsByTagName("a")[0];

    if (button.innerHTML == "Show editor") {
      button.innerHTML = "Hide editor";
    }
  };

  reader.readAsText(this.files[0]);
}

function handle_editing_mode() {
  if (this.innerHTML == "Show editor") {
    this.innerHTML = "Hide editor";
    this.parentElement.getElementsByTagName("textarea")[0].style.display = "block";
  } else {
    this.innerHTML = "Show editor";
    this.parentElement.getElementsByTagName("textarea")[0].style.display = "none";
  }

  return false;
}

function handle_file_input() {
  if (this.files.length == 0) {
    return;
  }

  let other_file_input = this;
  let reader = new FileReader();

  reader.onloadend = function() {
    other_file_input.content = Array.from(new Uint8Array(reader.result));
  };

  //
  // add the delete link
  //

  let delete_link = other_file_input.parentElement.querySelector("a");

  if (delete_link.style.display == "none") {
    delete_link.style.display = "";

    delete_link.onclick = function() {
      delete_link.parentElement.parentElement.removeChild(delete_link.parentElement);
      return false;
    };

    append_new_other_file();
  }

  // read the file data
  reader.readAsArrayBuffer(this.files[0]);
}

function append_new_other_file() {
  let div = document.createElement("div");

  let delete_link = document.createElement("a");
  delete_link.href = "#";
  delete_link.innerHTML = "x";
  delete_link.style.display = "none";
  div.appendChild(delete_link);

  let file_input = document.createElement("input");
  file_input.type = "file";
  file_input.name = "other_file_input";
  file_input.onchange = handle_file_input;
  div.appendChild(file_input);

  $("#try-other-file")[0].appendChild(div);
}

function utf16_to_utf8(utf16_string) {
  let code_units = [];

  for (let utf16_char of utf16_string) {
    let code_point = utf16_char.codePointAt();

    if (code_point < 0x80) {
      code_units.push(code_point);
    }
    else if (code_point < 0x800) {
      code_units.push(((code_point >> 6) & 0b0001_1111) | 0b1100_0000);
      code_units.push(((code_point     ) & 0b0011_1111) | 0b1000_0000);
    }
    else if (code_point < 0xD800) {
        code_units.push(((code_point >> 12) & 0b0000_1111) | 0b1110_0000);
        code_units.push(((code_point >>  6) & 0b0011_1111) | 0b1000_0000);
        code_units.push(((code_point      ) & 0b0011_1111) | 0b1000_0000);
    }
    else if (code_point < 0xE000) {
        code_units.push(0xEF);
        code_units.push(0xBF);
        code_units.push(0xBD);
    }
    else if (code_point < 0x10000) {
        code_units.push(((code_point >> 12) & 0b0000_1111) | 0b1110_0000);
        code_units.push(((code_point >>  6) & 0b0011_1111) | 0b1000_0000);
        code_units.push(((code_point      ) & 0b0011_1111) | 0b1000_0000);
    }
    else if (code_point < 0x10FFFF) {
        code_units.push(((code_point >> 18) & 0b0000_0111) | 0b1111_0000);
        code_units.push(((code_point >> 12) & 0b0011_1111) | 0b1001_0000);
        code_units.push(((code_point >>  6) & 0b0011_1111) | 0b1000_0000);
        code_units.push(((code_point      ) & 0b0011_1111) | 0b1000_0000);
    }
    else {
        code_units.push(0xEF);
        code_units.push(0xBF);
        code_units.push(0xBD);
    }
  }

  return code_units;
}

function enable_generate_button() {
  generate_pdf_link = $("#try-generate a")[0];
  generate_pdf_link.innerHTML = "Click to Generate";
  generate_pdf_link.className = "blue-button";
}

function disable_generate_button() {
  generate_pdf_link = $("#try-generate a")[0];
  generate_pdf_link.innerHTML = "Please wait...";
  generate_pdf_link.className = "disabled-button";
}

function display_message(message) {
  enable_generate_button();

  $("#try-prince-output img")[0].style.display = "none";
  $("#try-prince-output h2")[1].style.display = "";
  $("#try-prince-output p")[0].style.display = "";
  $("#try-prince-output textarea")[0].style.display = "";
  $("#try-prince-output textarea")[0].innerHTML = message;

  $("#try-generate")[0].scrollIntoView({ behavior: "smooth" });
}

function wait_for_response() {
  $("#try-prince-output")[0].style.display = "";
  $("#try-prince-output img")[0].style.display = "";
  $("#try-prince-output h2")[0].style.display = "none";
  $("#try-prince-output h2")[1].style.display = "none";
  $("#try-prince-output div")[0].style.display = "none";
  $("#try-prince-output p")[0].style.display = "none";
  $("#try-prince-output textarea")[0].style.display = "none";

  let existing_pdf_iframe = $("#try-prince-output div")[0].getElementsByTagName("iframe");

  if (existing_pdf_iframe.length > 0) {
    existing_pdf_iframe[0].remove();
  }
}

function display_pdf(pdf_data) {
    let pdf_bytes = Uint8Array.from(pdf_data);
    let blob = new Blob([pdf_bytes.buffer], { type: "application/pdf" });
    let url = window.URL.createObjectURL(blob);

    let pdf_iframe = document.createElement("iframe");
    pdf_iframe.src = url;

    let generated_pdf = $("#try-prince-output div")[0];
    generated_pdf.append(pdf_iframe);
    $("#try-prince-output h2")[0].style.display = "";
    generated_pdf.style.display = "";
}

function handle_generate_pdf_link() {
  if (this.className == "disabled-button") {
    return false;
  }

  disable_generate_button();
  wait_for_response();

  //
  // build request
  //

  let request = {
    files: []
  };

  let try_html_file_input = $("#try-html-file input")[0];

  request.files.push({
    filename: (try_html_file_input.files.length ? try_html_file_input.files[0].name : "prince.html"),
    content: utf16_to_utf8($("#try-html-file textarea")[0].value),
  });

  let css_file_input = $("#try-css-file input")[0];

  request.files.push({
    filename: (css_file_input.files.length ? css_file_input.files[0].name : "prince.css"),
    content: utf16_to_utf8($("#try-css-file textarea")[0].value),
  });

  let other_file_inputs = document.querySelectorAll("#try-other-file input");

  for (let other_file_input of other_file_inputs) {
    if (other_file_input.files.length > 0 && other_file_input.content) {
      request.files.push({
        filename: other_file_input.files[0].name,
        content: other_file_input.content,
      });
    }
  }

  let request_size = 0;

  for (let file of request.files) {
    request_size += file.content.length;
  }

  if (request_size > API_GATEWAY_REQUEST_LIMIT) {
    display_message(`Sorry, your request is too large (over ${API_GATEWAY_REQUEST_LIMIT_DISPLAY}). Please reduce attachments sizes, then try again`);
    return false;
  }

  //
  // Send request
  //

  let xhr = new XMLHttpRequest();
  xhr.open("POST", PRINCE_URL);
  xhr.setRequestHeader("Content-Type", "application/json");
  xhr.timeout = 29000;

  xhr.onerror = function() {
    // For security reasons, the cause of XHR errors are not exposed to Javascript
    display_message("Sorry, a network error occurred. Please try again");
  };

  xhr.ontimeout = function() {
    display_message("Sorry, the request took too long. Please try again");
  };

  xhr.onload = function() {
    if (xhr.status != 200) {
      display_message("Sorry, we had a problem generating your PDF. Please try again");
      return false;
    }
    try {
      //
      // View the final PDF
      //

      let response = JSON.parse(xhr.responseText);

      if (response.error) {
        throw true;
      }

      if (response.ok.stdout.length > 0) {
        display_pdf(response.ok.stdout);
      }

      display_message(response.ok.stderr || "No warnings or errors occurred");
    } catch (err) {
      display_message("Sorry, we had a problem generating your PDF. Please try again");
    }
  };

  xhr.send(JSON.stringify(request));

  return false;
}
