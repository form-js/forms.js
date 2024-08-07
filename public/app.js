import "./style.css";
import "../packages/core/css/index.css";
import { Form } from "./js/core/index";
import { createApp } from "vue";
import App from "./App.vue";

function initVue() {
  const app = createApp(App);
  app.mount("#app");
}

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

const groups = [
  {
    id: "painters",
    label: "Painters",
  },
];

function initForm() {
  const form = new Form("form", {
    id: "form",
    schema: [
      {
        id: "select",
        type: "select",
        label: "Select",
        options: {
          maxItems: null,
          plugins: ["remove_button"],
        },
        required: true,
        optionsList: async function (query) {
          if (!query) return [...options];
          const search = [
            ...options.filter((item) => {
              return item.label
                .toLocaleLowerCase()
                .includes(query.toLocaleLowerCase());
            }),
          ];
          return search.map((item) => {
            return {
              value: item.value,
              label: item.label,
            };
          });
        },
        optionGroups: async function (query) {
          return groups;
        },
      },
      {
        id: "password",
        type: "password",
        allowPeek: true,
        label: "Pasword",
        required: true,
        conditions: (value, data) => {
          if (data) return !data.select?.includes("vincent_van_gogh");
          return true;
        },
      },
      {
        id: "submit",
        type: "button",
        template: "Submit",
      },
      {
        id: "reset",
        type: "button",
        template: "Reset",
        buttonType: "button",
        click: () => {
          form.reset();
        },
      },
    ],
  });

  const password = form.getField("password");

  password?.on(
    "changed",
    (event) => {
      console.log(event);
    },
    true
  );
  password?.on(
    "resetted",
    (event) => {
      console.log("resetted");
    },
    true
  );

  password?.on(
    "validationFailed",
    (event) => {
      console.log("failed");
    },
    true
  );

  password?.on(
    "visibilityChanged",
    (event) => {
      console.log(event);
    },
    true
  );

  password?.on(
    "disabledStateChanged",
    (event) => {
      console.log(event);
    },
    true
  );

  password?.on(
    "requiredStateChanged",
    (event) => {
      console.log(event);
    },
    true
  );

  form.on(
    "submitted",
    () => {
      console.log("submitted");
    },
    true
  );
  form.on(
    "dataUpdated",
    (event) => {
      console.log("data updated");
      console.log(event);
    },
    true
  );
  form.on(
    "initialized",
    () => {
      console.log("initialized");
    },
    true
  );
  form.on(
    "resetted",
    () => {
      console.log("resetted");
    },
    true
  );
  form.on(
    "validationFailed",
    () => {
      console.log("validation failed");
    },
    true
  );
}

document.addEventListener("DOMContentLoaded", initVue, false);
