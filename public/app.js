import "./style.css";
import "../packages/core/css/index.css";
import {
  Form,
  Group,
  TextField,
  NumberField,
  requiredValidator,
} from "./js/core/index.js";

const options = [
  { value: "vincent_van_gogh", label: "Vincent van Gogh", group: "painters" },
  { value: "pablo_picasso", label: "Pablo Picasso", group: "painters" },
  { value: "leonardo_da_vinci", label: "Leonardo da Vinci" },
  { value: "claude_monet", label: "Claude Monet", group: "painters" },
  { value: "michelangelo", label: "Michelangelo", group: "painters" },
  { value: "rembrandt", label: "Rembrandt", group: "painters" },
  { value: "andy_warhol", label: "Andy Warhol" },
  { value: "salvador_dali", label: "Salvador Dali" },
  { value: "frida_kahlo", label: "Frida Kahlo" },
  { value: "edvard_munch", label: "Edvard Munch" },
  { value: "gustav_klimt", label: "Gustav Klimt" },
  { value: "georgia_o_keeffe", label: "Georgia O'Keeffe" },
  { value: "johannes_vermeer", label: "Johannes Vermeer" },
  { value: "paul_cezanne", label: "Paul Cézanne" },
  { value: "henri_matisse", label: "Henri Matisse" },
  { value: "edgar_degas", label: "Edgar Degas" },
  { value: "pierre_auguste_renoir", label: "Pierre-Auguste Renoir" },
  { value: "paul_gauguin", label: "Paul Gauguin" },
  { value: "henri_de_toulouse_lautrec", label: "Henri de Toulouse-Lautrec" },
  { value: "wassily_kandinsky", label: "Wassily Kandinsky" },
  { value: "joan_miro", label: "Joan Miró" },
  { value: "jackson_pollock", label: "Jackson Pollock" },
  { value: "edouard_manet", label: "Édouard Manet" },
  { value: "el_greco", label: "El Greco" },
  { value: "georges_seurat", label: "Georges Seurat" },
  { value: "jan_van_eyck", label: "Jan van Eyck" },
  { value: "gustave_courbet", label: "Gustave Courbet" },
  { value: "diego_velazquez", label: "Diego Velázquez" },
  { value: "tintoretto", label: "Tintoretto" },
  { value: "egon_schiele", label: "Egon Schiele" },
  { value: "piet_mondrian", label: "Piet Mondrian" },
  { value: "raphael", label: "Raphael" },
  { value: "sandro_botticelli", label: "Sandro Botticelli" },
  { value: "hans_holbein", label: "Hans Holbein" },
  { value: "giotto", label: "Giotto" },
  { value: "caravaggio", label: "Caravaggio" },
  { value: "francisco_goya", label: "Francisco Goya" },
  { value: "titian", label: "Titian" },
  { value: "james_mcneill_whistler", label: "James McNeill Whistler" },
  { value: "george_grosz", label: "George Grosz" },
  { value: "john_singer_sargent", label: "John Singer Sargent" },
  { value: "albrecht_durer", label: "Albrecht Dürer" },
  { value: "william_blake", label: "William Blake" },
  { value: "gustave_moreau", label: "Gustave Moreau" },
  { value: "paul_klee", label: "Paul Klee" },
  { value: "aivazovsky", label: "Ivan Aivazovsky" },
  { value: "thomas_gainsborough", label: "Thomas Gainsborough" },
  {
    value: "jean_auguste_dominique_ingres",
    label: "Jean-Auguste-Dominique Ingres",
  },
  { value: "john_constable", label: "John Constable" },
  { value: "antoine_watteau", label: "Antoine Watteau" },
  { value: "camille_pissarro", label: "Camille Pissarro" },
  { value: "pietro_perugino", label: "Pietro Perugino" },
  { value: "jacques_louis_david", label: "Jacques-Louis David" },
  { value: "jan_steen", label: "Jan Steen" },
  { value: "winslow_homer", label: "Winslow Homer" },
  { value: "edward_hopper", label: "Edward Hopper" },
  { value: "arkhip_kuindzhi", label: "Arkhip Kuindzhi" },
  { value: "nicholas_roerich", label: "Nicholas Roerich" },
  { value: "alexander_ivanov", label: "Alexander Ivanov" },
  { value: "konstantin_somov", label: "Konstantin Somov" },
  { value: "pyotr_konchalovsky", label: "Pyotr Konchalovsky" },
  { value: "roerich", label: "Nicholas Roerich" },
  { value: "kuzma_petrov_vodkin", label: "Kuzma Petrov-Vodkin" },
  { value: "arkhip_kuindzhi", label: "Arkhip Kuindzhi" },
  { value: "sergey_gerasimov", label: "Sergey Gerasimov" },
  { value: "ilya_repinsky", label: "Ilya Repin" },
  { value: "valentin_serov", label: "Valentin Serov" },
  { value: "boris_kustodiev", label: "Boris Kustodiev" },
  { value: "vasily_surikov", label: "Vasily Surikov" },
  { value: "andrey_rublev", label: "Andrey Rublev" },
  { value: "mikhail_nesterov", label: "Mikhail Nesterov" },
  { value: "ivan_shishkin", label: "Ivan Shishkin" },
  { value: "vasily_vereshchagin", label: "Vasily Vereshchagin" },
  { value: "alexei_savrasov", label: "Alexei Savrasov" },
  { value: "ivan_kramskoi", label: "Ivan Kramskoi" },
  { value: "konstantin_makovsky", label: "Konstantin Makovsky" },
  { value: "firs_zurabov", label: "Firs Zurabov" },
  { value: "pavel_fedotov", label: "Pavel Fedotov" },
  { value: "aleksandr_ivanov", label: "Aleksandr Ivanov" },
  { value: "ilya_mashkov", label: "Ilya Mashkov" },
  { value: "yuri_pimenov", label: "Yuri Pimenov" },
  { value: "alexander_deyneka", label: "Alexander Deyneka" },
  { value: "nicholas_filonov", label: "Nicholas Filonov" },
  { value: "vladimir_tatlin", label: "Vladimir Tatlin" },
  { value: "vasily_kandinsky", label: "Vasily Kandinsky" },
  { value: "lyubov_popova", label: "Lyubov Popova" },
  { value: "kazimir_malevich", label: "Kazimir Malevich" },
  { value: "el_lissitzky", label: "El Lissitzky" },
  { value: "alexander_rodchenko", label: "Alexander Rodchenko" },
  { value: "naum_gabo", label: "Naum Gabo" },
  { value: "david_burliuk", label: "David Burliuk" },
  { value: "mikhail_larionov", label: "Mikhail Larionov" },
  { value: "natalia_goncharova", label: "Natalia Goncharova" },
  { value: "nathan_altman", label: "Nathan Altman" },
  { value: "alexander_tyshler", label: "Alexander Tyshler" },
  { value: "sergey_sharshun", label: "Sergey Sharshun" },
  { value: "pavel_filoyenov", label: "Pavel Filoyenov" },
  { value: "anna_ostroumova_lebedeva", label: "Anna Ostroumova-Lebedeva" },
];

const rules = [
  {
    id: "disable-email",
    condition: (fields) => Number(fields["age"].getValue()) < 18,
    actions: [
      {
        type: "SET_DISABLED",
        payload: true,
        targetFields: ["email"],
      },
    ],
    elseActions: [
      {
        type: "SET_DISABLED",
        payload: false,
        targetFields: ["email"],
      },
    ],
    triggers: ["age"],
  },
  {
    id: "hide-name",
    condition: (fields) => Number(fields["age"].getValue()) < 18,
    actions: [
      {
        type: "SET_VISIBLE",
        payload: false,
        targetFields: ["lastName"],
      },
    ],
    elseActions: [
      {
        type: "SET_VISIBLE",
        payload: true,
        targetFields: ["lastName"],
      },
    ],
    triggers: ["age"],
  },
];

const groups = [
  {
    id: "painters",
    label: "Painters",
  },
];

const syncValidators = [
  (value) => (value.length < 3 ? "Value is too short" : null),
  (value) => (!value.match(/^[a-zA-Z]+$/) ? "Only letters are allowed" : null),
];

const asyncValidators = [
  async (value) => {
    await new Promise((resolve) => setTimeout(resolve, 500)); // Simulate delay
    return value === "taken" ? ["Value is already taken"] : null;
  },
  async (value) => {
    await new Promise((resolve) => setTimeout(resolve, 300)); // Simulate delay
    return value === "error"
      ? ["Error in async validation", "Another issue"]
      : null;
  },
];

const phoneMask = (value) => {
  const raw = value.replace(/\D/g, "");
  const formatted = raw.replace(/(\d{3})(\d{3})(\d{4})/, "($1) $2-$3");
  return { raw, formatted };
};

const validators = [...syncValidators, ...asyncValidators];

function initForm() {
  /*const fields = {
    firstName: new TextField({
      id: "firstName",
      label: "First Name",
      initialValue: "name",
      required: true,
    }),
    lastName: new TextField({
      id: "lastName",
      label: "Last Name",
      initialValue: "",
      required: false,
    }),
    email: new TextField({
      id: "email",
      label: "Email",
      initialValue: "",
      visible: true,
    }),
    age: new NumberField({
      id: "age",
      label: "Age",
      required: false,
    }),
    phone: new TextField({
      id: "phone",
      label: "Phone",
      placeholder: "Phone",
      mask: phoneMask,
    }),
  };*/

  const field1 = new TextField({ id: "name", initialValue: "John" });
  const field2 = new TextField({
    id: "email",
    initialValue: "john@example.com",
  });

  const addressField = new TextField({ id: "address", initialValue: "" });
  const cityField = new TextField({ id: "city", initialValue: "" });
  const addressGroup = new Group("addressDetails", {
    fields: {
      address: addressField,
      city: cityField,
    },
  });
  const group1 = new Group("userDetails", {
    fields: { name: field1, email: field2 },
    groups: { addressDetails: addressGroup },
  });

  // Watch for reactive data changes
  group1.watchData((data) => {
    console.log("Group data updated:", data);
  });

  const myForm = new Form(
    {},
    {
      group: group1,
    },
    {
      flow: rules,
    }
  );
  //nameField.value.subscribe((value) => console.log(value));

  const btn = document.getElementById("btn");
  btn.addEventListener("click", () => {
    console.log(myForm.progress());
  });

  myForm.render();
}

document.addEventListener("DOMContentLoaded", initForm, false);
