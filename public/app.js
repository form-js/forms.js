import './style.css';
import '../packages/core/css/index.css'; 
import { Form } from "./js/core/index";

function initForm() {
  new Form("form", {
    id: "form",
    schema: [
      {
        id: "username",
        type: "text",
        label: "Test",
        required: true,
      },
    ],
  });
}

document.addEventListener("DOMContentLoaded", initForm, false);
