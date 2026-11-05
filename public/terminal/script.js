import * as Integral from "./commands/integral.js";
import * as Ask from "./commands/ask.js";

// true when this terminal runs inside an iframe (e.g. embedded in the main portfolio site)
const EMBEDDED = window.self !== window.top;

const FileSystem = {
  readFile: function (path) {
      const xhr = new XMLHttpRequest();
      xhr.open("GET", path, false);
      xhr.send();
      return xhr.responseText;
  },
};

const asciiArt = `
███████╗ █████╗  ██████╗██╗  ██╗██╗███╗   ██╗         ██╗ █████╗ ██████╗ ██╗  ██╗ █████╗ ██╗   ██╗
██╔════╝██╔══██╗██╔════╝██║  ██║██║████╗  ██║         ██║██╔══██╗██╔══██╗██║  ██║██╔══██╗██║   ██║
███████╗███████║██║     ███████║██║██╔██╗ ██║         ██║███████║██║  ██║███████║███████║██║   ██║
╚════██║██╔══██║██║     ██╔══██║██║██║╚██╗██║    ██   ██║██╔══██║██║  ██║██╔══██║██╔══██║╚██╗ ██╔╝
███████║██║  ██║╚██████╗██║  ██║██║██║ ╚████║    ╚█████╔╝██║  ██║██████╔╝██║  ██║██║  ██║ ╚████╔╝ 
╚══════╝╚═╝  ╚═╝ ╚═════╝╚═╝  ╚═╝╚═╝╚═╝  ╚═══╝     ╚════╝ ╚═╝  ╚═╝╚═════╝ ╚═╝  ╚═╝╚═╝  ╚═╝  ╚═══╝  
Wanna know about me...🫠?
`;

document.getElementById('ascii-art').innerText = asciiArt;

const output = document.getElementById("output");
const input = document.getElementById("command-input");
const prompt = document.getElementById("prompt");

const technologies = [
  ["Claude", "MCP", "LangChain", "RAG"],
  ["Agentic Workflows", "Bedrock KB", "Vector DB", "OpenTelemetry"],
  ["Prompt Eng.", "Context Eng.", "Python", "FastAPI"],
  ["React + Vite", "TypeScript", "JavaScript", "Java"],
  ["SQL", "PostgreSQL", "MySQL", "Mongo"],
  ["IBM i / AS400", "Linux", "AWS", "GCP"],
  ["Docker", "Kubernetes", "Terraform", "ECS Fargate"],
  ["Jenkins", "Git/GitHub", "SSH", "Splunk"],
  ["Nmap", "Burp Suite", "Truffle", "MetaMask"],
  ["C", "Google Colab", "HTML", "CSS"]
];

const commands = [
  {
      name: "help",
      description: "list all available commands",
  },
  {
      name: "about",
      description: "introduction about me",
  },
  {
      name: "experience",
      description: "work experience",
  },
  {
      name: "education",
      description: "my qualification",
  },
  {
      name: "skills",
      description: "list of technologies I have worked with",
  },
  {
      name: "projects",
      description: "list of projects",
  },
  {
      name: "integral [arch|stack]",
      description: "my latest project, Integral Assistant, running live in this terminal",
  },
  {
      name: "posts",
      description: "my LinkedIn posts (alias: featured)",
  },
  {
      name: "ask [question]",
      description: "ask about my work (searches this portfolio, answers with sources)",
  },
  {
      name: "neofetch",
      description: "system info, but it's me",
  },
  {
      name: "resume",
      description: "open my resume",
  },
  {
      name: "sudo hire-sachin",
      description: "you know you want to",
  },
  {
      name: "theme [default|green|amber]",
      description: "change the terminal colours",
  },
  {
      name: "certifications",
      description: "my certificates",
  },
  {
      name: "clear",
      description: "clear the terminal",
  },
  {
      name: "links",
      description: "list all the links",
  },
  {
      name: "open [link-name]",
      description: "open a link in a new tab",
  },
  {
      name: "contact",
      description: "contact information",
  },
  {
      name: "surprise",
      description: "surprise yourself",
  },
];


const links = {
  "website": "https://www.sachinjadhavofficial.com/",
  "github": "https://github.com/kffod",
  "linkedin": "https://www.linkedin.com/in/sachin-jadhav-a3667b248/",
  "resume": "https://drive.google.com/file/d/1l0b2tm_yctVYfcCNwFGVclJtLw34AICF/view?usp=sharing",
};

const EMAIL = "sachindjadhav50@gmail.com";

function escapeHtml(s) {
  return String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}

// ---------- extras: neofetch, sudo, theme ----------
const THEMES = ["default", "green", "amber"];

function applyTheme(name) {
  THEMES.forEach((t) => document.body.classList.remove(`theme-${t}`));
  if (name && name !== "default") document.body.classList.add(`theme-${name}`);
}
try { applyTheme(localStorage.getItem("terminal-theme") || "default"); } catch (e) {}

function timeAtDxc() {
  const start = new Date(2025, 5, 1); // Jun 2025, counted inclusively like LinkedIn
  const now = new Date();
  const months = (now.getFullYear() - start.getFullYear()) * 12 + (now.getMonth() - start.getMonth()) + 1;
  const y = Math.floor(months / 12);
  const m = months % 12;
  return [y ? `${y} yr${y > 1 ? "s" : ""}` : "", m ? `${m} mo${m > 1 ? "s" : ""}` : ""].filter(Boolean).join(" ");
}

function neofetch() {
  const logo = [
    "███████╗     ██╗",
    "██╔════╝     ██║",
    "███████╗     ██║",
    "╚════██║██   ██║",
    "███████║╚█████╔╝",
    "╚══════╝ ╚════╝ ",
  ];
  const rows = [
    ["", '<span class="text-green">sachin</span>@<span class="text-green">dxc</span>'],
    ["", '<span class="text-gray">----------</span>'],
    ["role", "AI Full-Stack Engineer"],
    ["host", "DXC Technology · Software Engineer"],
    ["uptime", `${timeAtDxc()} at DXC`],
    ["location", "Mumbai, India"],
    ["stack", "Claude · MCP · RAG · Agentic Workflows"],
    ["infra", "Bedrock KB · Vector DB · Python · FastAPI"],
    ["project", "Integral Assistant (type 'integral')"],
    ["certs", "4× Anthropic Claude (type 'certifications')"],
    ["shell", "integral-sh"],
  ];
  const info = rows.map(([k, v]) => (k ? `<span class="text-pink">${k.padEnd(9, " ")}</span>${v}` : v)).join("\n");
  const colours = ["#ff5f56", "#ffbd2e", "#27c93f", "#B0E0E6", "#FF1493", "#FFA500", "#acadab"]
    .map((c) => `<span style="color:${c}">███</span>`).join("");
  return `<div class="neofetch"><pre class="text-blue">${logo.join("\n")}</pre><pre>${info}\n\n${colours}</pre></div>`;
}

function hireCard() {
  const lines = [
    ["Sachin Jadhav · AI Full-Stack Engineer", null],
    ["", null],
    ["web       sachinjadhavofficial.com", `web       <a href="${links.website}" target="_blank" rel="noopener">sachinjadhavofficial.com</a>`],
    [`email     ${EMAIL}`, `email     <a href="mailto:${EMAIL}">${EMAIL}</a>`],
    ["linkedin  sachin-jadhav-a3667b248", `linkedin  <a href="${links.linkedin}" target="_blank" rel="noopener">sachin-jadhav-a3667b248</a>`],
    ["github    kffod", `github    <a href="${links.github}" target="_blank" rel="noopener">kffod</a>`],
    ["roles     AI Engineer · FDE · AI Full-Stack", null],
  ];
  const w = Math.max(...lines.map(([t]) => t.length));
  const body = lines.map(([t, h]) => `│ ${h ?? escapeHtml(t)}${" ".repeat(w - t.length)} │`).join("\n");
  return `<span class="text-gray">[sudo] password for recruiter: ********</span><br>` +
    `<span class="text-green">✓ access granted. excellent decision.</span><br>` +
    `<pre class="text-blue">┌${"─".repeat(w + 2)}┐\n${body}\n└${"─".repeat(w + 2)}┘</pre>` +
    `<span class="text-gray">type "open linkedin" or "resume", or just email me.</span>`;
}

function sudo(cmd) {
  const arg = (cmd.split(" ")[1] || "").replace("undefined", "");
  if (arg === "hire-sachin") return hireCard();
  if (!arg) return `usage: <span class="text-red">sudo</span> hire-sachin`;
  return `<span class="text-red">sudo: ${escapeHtml(arg)}: permission denied.</span> nice try 😄<br>` +
    `this terminal has a human approval gate too. try <span class="text-red">sudo hire-sachin</span>`;
}

function setTheme(cmd) {
  const arg = (cmd.split(" ")[1] || "").replace("undefined", "");
  if (!THEMES.includes(arg)) return `usage: <span class="text-red">theme</span> [${THEMES.join("|")}]`;
  applyTheme(arg);
  try { localStorage.setItem("terminal-theme", arg); } catch (e) {}
  return `theme set to <span class="text-green">${arg}</span>`;
}

const commandHistory = [];
let commandHistoryIndex = 0;


function autoCompleteCommand(command) {
  const commandName = command.split(" ")[0];
  const commandArgs = Object.keys(links).find((link) => link.startsWith(command.split(" ")[1]));
  const commandList = commands.map((command) => command.name);
  const filteredCommands = commandList.filter((command) => command.startsWith(commandName));
  let autoCompleteCommand = command;
  if (filteredCommands.length === 1) {
    autoCompleteCommand = filteredCommands[0].split(" ")[0];
  }
  if (filteredCommands?.length === 1 && commandArgs) {
      autoCompleteCommand = autoCompleteCommand +" "+commandArgs;
  }
  return autoCompleteCommand;
}


const commandFunctions = {
    help: function () {
        let helpText = "commands: <br> <br>";
        commands.forEach((command) => {
          helpText += `<span class="text-red">${command.name}</span> - ${command.description} <br>`;
        });
        return helpText;
    },
    about: function () {
        // Read about section from about.html
        // return aboutText;
        const aboutText = FileSystem.readFile("commands/about.html");
        return aboutText;
  },
  education: function () {
    // Read education section from education.html
    const educationText = FileSystem.readFile("commands/education.html");
    return educationText;
},
experience: function () {
  // Read experience section from experience.html
  const experienceText = FileSystem.readFile("commands/experience.html");
  return experienceText;
},
certifications: function () {
  // Read certifications section from certifications.html
  const certificationsText = FileSystem.readFile("commands/certifications.html");
  return certificationsText;
},
  projects: function () {
    // Read about section from about.html
    // return aboutText;
    const project = FileSystem.readFile("commands/project.html");
    return project;
  },
  integral: function (command) {
    return Integral.render(command);
  },
  featured: function () {
    return FileSystem.readFile("commands/featured.html");
  },
  posts: function () {
    return FileSystem.readFile("commands/featured.html");
  },
  ask: function (raw) {
    return Ask.render(raw);
  },
  neofetch: function () {
    return neofetch();
  },
  resume: function () {
    window.open(links.resume, "_blank");
    return `Opening my resume in a new tab. <span class="text-gray">(pop-up blocked? <a href="${links.resume}" target="_blank" rel="noopener">open it here</a>)</span>`;
  },
  sudo: function (cmd) {
    return sudo(cmd);
  },
  theme: function (cmd) {
    return setTheme(cmd);
  },
  contact: function () {
    // Read about section from about.html
    // return aboutText;
    const contact = FileSystem.readFile("commands/contact.html");
    return contact;
  },
    skills: function () {
        // Create a table of technologies
        const { table, maxCellLength } = createTable(technologies);
        const containerWidth = maxCellLength * technologies[0].length * 10 + 20;
        const tableContainer = `<div style="width:${containerWidth}px" class="text-red"> <pre>${table}</pre> </div>`;
        return tableContainer;
    },
  open: function (command) {

      const linkName = command.split(" ")[1];
      if (links[linkName]) {
        window.open(links[linkName], "_blank");
        return `Opening ${linkName} in a new tab`;
      } else {
        return `<span class="text-red">Invalid link name: ${linkName}</span>`;
      }
  },
  links: function () {
    let list = "";
    for (const linkName in links) {
      list += `${linkName} <br>`;
    }
    list += `<br><span class="text-gray">Type "open <span class="text-pink">[link-name]</span>" to open a link in a new tab</span>`;
    return list;
  },
  surprise: function () {
    const asciiContent = getRandomASCII();
    return `<pre class="ascii-art">${asciiContent}</pre>`;
  }
};

const postRenderFunctions = {
  projects: function () {
    const outputProjects = document.getElementsByClassName("output-project");
    for (const outputProject of outputProjects) {
      outputProject.appendChild(document.createTextNode('---'.repeat(40)));
    }
   },
  integral: function () {
    Integral.run();
  },
  ask: function () {
    Ask.run();
  }
};

output.innerHTML += "Type <span class='text-red'>'help'</span> for a list of commands. <br />" +
  "<span class='text-gray'>AI engineer · I ship production AI agents end to end.</span> <br />" +
  "type <span class='text-red'>'integral'</span> to watch my latest project, " +
  "<span class='text-green'>Integral Assistant</span>, drive an IBM i green screen. <br /> <br />";
if (!EMBEDDED) input.focus();  
input.addEventListener("keydown", function (event) {
  // Ctrl+C interrupts a running Integral demo
  if (event.ctrlKey && (event.key === "c" || event.key === "C") && Integral.isRunning()) {
    event.preventDefault();
    Integral.abort();
    return;
  }
  if (event.key === "Enter") {
    // While the Integral demo waits at its approval gate, Enter sends the answer to it
    if (Integral.isAwaiting()) {
      event.preventDefault();
      const value = input.value;
      input.value = "";
      resizeInput();
      Integral.answer(value);
      return;
    }
    if (Integral.isRunning()) { event.preventDefault(); return; }
    event.preventDefault();
    commandHistory.push(input.value);
    const rawInput = input.value.trim();
    input.value = input.value.toLowerCase();
      const command = input.value.trim().split(/\s+/)[0];
      const commandArgs = input.value.trim().split(/\s+/)[1];
      input.value = "";
      const echo = command === "ask" ? escapeHtml(rawInput) : `${escapeHtml(command)} ${escapeHtml(commandArgs || '')}`;
      output.innerHTML += `${prompt.innerHTML}${echo}<br /> <br />`;
        if (commandFunctions[command]) {
          output.innerHTML += commandFunctions[command](command === "ask" ? rawInput : `${command} ${commandArgs}`) + "<br />";
          if (postRenderFunctions[command]) {
            postRenderFunctions[command]();
          }
        } else if (command === "clear") {
          output.innerHTML = "";
      } else {
            output.innerHTML += `<span class="text-red">Invalid command: ${escapeHtml(command)}</span>. <br> Type <span class="text-red">help</span> for a list of commands.`
        }
        if (command !== "clear") {
            output.innerHTML += "<br> <br>"
        }
        scrollToBottom()
    }
  if (event.key === "Tab") {
    event.preventDefault();
    input.value = autoCompleteCommand(input.value);
  }
  if (event.key === "ArrowUp") {
    if (commandHistory.length === 0) {
      return;
     }
    event.preventDefault();
    if (commandHistoryIndex === commandHistory.length) {
      commandHistoryIndex = 0;
    }
    input.value = commandHistory[commandHistory.length - 1 - commandHistoryIndex];
    commandHistoryIndex++;
  }
  if (event.key === "ArrowDown") {
    event.preventDefault();
    if (commandHistory.length === 0) {
      return;
     }
    if (commandHistoryIndex === 0) {
      commandHistoryIndex = commandHistory.length;
    }
    commandHistoryIndex--;
    input.value = commandHistory[commandHistory.length - 1 - commandHistoryIndex];
  }
    resizeInput();
});

// the parent page (portfolio site) can run a command: postMessage({type: "terminal:run", command})
window.addEventListener("message", function (event) {
  if (event.origin !== window.location.origin) return;
  const data = event.data || {};
  if (data.type !== "terminal:run" || typeof data.command !== "string") return;
  runFromParent(data.command, 0);
});

function runFromParent(command, tries) {
  // still on the boot screen: wait until the prompt is visible so the visitor sees the output
  const ui = document.getElementById("command-interface");
  if (ui && ui.style.display === "none" && tries < 80) {
    setTimeout(() => runFromParent(command, tries + 1), 250);
    return;
  }
  if (Integral.isRunning()) return;
  input.value = command.slice(0, 300);
  resizeInput();
  input.focus({ preventScroll: true });
  input.dispatchEvent(new KeyboardEvent("keydown", { key: "Enter", bubbles: true }));
}

input.addEventListener("blur", function (event) {
    if (!EMBEDDED) input.focus();
});

// clicking anywhere in the terminal focuses the prompt (needed when embedded)
document.getElementById("shell").addEventListener("click", function () {
  if (window.getSelection && String(window.getSelection())) return; // allow text selection
  input.focus({ preventScroll: true });
});

function resizeInput() {
    input.style.width = input.value.length + 1 + "ch";
}

// scroll to bottom
function scrollToBottom() {
  const shell = document.getElementById("shell");
    shell.scrollTop = output.scrollHeight;
    window.scroll(0, output.scrollHeight);
}

function createTable(data) {
    // Determine the maximum length of any cell in the table
    let maxCellLength = 0;
    for (let i = 0; i < data.length; i++) {
        for (let j = 0; j < data[i].length; j++) {
            if (data[i][j].length > maxCellLength) {
                maxCellLength = data[i][j].length;
            }
        }
    }

    // Create the top border of the table
    let topBorder = "┌" + "─".repeat(maxCellLength + 2) + "┬" + "─".repeat(maxCellLength + 2) + "┬" + "─".repeat(maxCellLength + 2) + "┬" + "─".repeat(maxCellLength + 2) + "┐";

    // Create the data rows of the table
    let dataRows = "";
    for (let i = 0; i < data.length; i++) {
        for (let j = 0; j < data[i].length; j++) {
            let cell = data[i][j];
            let padding = " ".repeat(Math.floor((maxCellLength - cell.length) / 2));
            let extraPadding = (cell.length % 2 == maxCellLength % 2) ? "" : " ";
            let formattedCell = "│ " + padding + cell + padding + extraPadding + " ";
            dataRows += formattedCell;
        }
        dataRows += "│\n";
        if (i != data.length - 1) {
            dataRows += "├" + "─".repeat(maxCellLength + 2) + "┼" + "─".repeat(maxCellLength + 2) + "┼" + "─".repeat(maxCellLength + 2) + "┼" + "─".repeat(maxCellLength + 2) + "┤\n";
        }
    }

    // Create the bottom border of the table
    let bottomBorder = "└" + "─".repeat(maxCellLength + 2) + "┴" + "─".repeat(maxCellLength + 2) + "┴" + "─".repeat(maxCellLength + 2) + "┴" + "─".repeat(maxCellLength + 2) + "┘";

    // Concatenate all the parts to create the final table
    let table = topBorder + "\n" + dataRows + bottomBorder;

  return { maxCellLength, table };
  
}

function getRandomASCII() {
  const asciiArts = [
    `
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢀⣠⡶⠟⠛⠉⠙⠻⢿⣤⡀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢀⡀⠀⣀⣤⣶⠿⠯⠤⠄⠀⠀⠀⠀⠀⠙⢿⣄⣀⣀⣀⣀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⣸⣿⣛⣻⢯⣅⠀⠀⠀⠀⠀⠀⠀⠀⠀⣠⠴⠞⠋⠉⠀⠉⠛⠿⡦⡀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⣴⣿⠭⣍⣉⠛⢾⣝⡂⠀⠀⠀⠀⣠⡴⠋⠁⠀⠀⠀⠀⠀⠀⠀⠀⠙⢿⡆⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⣿⣇⠀⣰⣿⣿⣿⣿⡙⢂⣠⠴⠿⠥⣄⣀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠈⢿⡄⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⣀⣴⣿⣏⠳⢿⣿⣿⣿⢛⡇⠋⠡⢒⣒⣒⣒⣛⡛⠦⣤⣀⠀⠀⠀⠀⠀⠀⠀⠘⡷⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⣰⡿⣿⠁⠘⠈⠀⠀⣈⡙⠳⠞⣠⡴⠊⠉⢉⣽⣦⣌⠉⠓⠦⣍⠳⡄⠀⠀⠀⠀⠀⠀⢹⠃
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⣿⡇⡇⠀⠀⠀⠀⡤⠞⠛⠓⠀⢧⣙⠲⢤⣾⣿⣽⣿⣿⡷⢤⡈⢧⠹⡄⠀⠀⠀⠀⠀⠀⡇
⠀⠀⠀⠀⠀⣀⣴⠾⠻⢶⣄⠀⠀⠀⠀⢰⣿⣇⠹⣄⠀⠀⠀⠀⠀⠀⠀⠀⠀⢿⠓⢦⣌⠙⠛⠛⠛⠓⠒⠛⠒⠷⠇⠀⠀⠀⠀⠀⠀⣿
⠀⡶⠶⠒⠛⣫⣥⡴⠒⠂⢻⣧⠀⠀⠀⣸⣇⠈⢷⡈⠓⠦⣄⡀⠀⠀⠀⠀⠀⠈⣧⠀⠈⠉⠓⠒⠒⠋⠁⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⣿⡇⠀⠀⠀⠀⢀⣇⠠⠤⣾⠻⠿⠶⠶⣿⠛⢦⡀⠉⠳⣄⡀⠉⠙⠲⠤⣄⣀⡀⠈⠓⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⡇
⡿⠛⠶⠶⠒⠚⠛⠙⢦⣼⠃⠀⠀⠀⠀⢿⠀⠈⠙⠦⣄⠀⠙⠓⢦⣄⣀⠀⠈⠉⠓⠲⠦⠤⠤⣤⣀⣠⣄⠃⠀⠀⠀⠀⠀⠀⠀⠀⢀⠇
⣿⣄⢀⣀⣠⡤⠤⠤⢾⡏⠀⠀⠀⠀⠀⢸⡇⠀⠀⠀⠈⠙⠲⠦⣤⣀⣈⠉⠛⠒⠶⠦⠤⠤⠤⣤⠄⠉⣻⠆⠀⠀⠀⠀⠀⠀⠀⠀⠸⠀
⣽⡿⠉⠁⠀⠀⠀⢀⣼⠁⠀⠀⠀⠀⠀⠀⣧⠀⠀⠀⠀⠀⠀⠀⠀⠀⠉⠉⠙⠛⠓⠒⠒⠒⠒⠒⠒⠛⠁⠀⠀⠀⠀⠀⠀⠀⠀⠀⣇⠀
⠙⣷⣀⣀⣤⠴⠒⠋⢹⣧⣄⣀⣀⣀⣀⣀⣹⡄⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⣸⡏⠀
⠀⠸⣿⡁⠀⠀⣀⣴⠟⠉⠉⠉⠉⠉⠉⠛⢻⣧⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢠⣿⠃⠀
⠀⠀⠙⠛⠛⠛⠛⠁⠀⠀⠀⠀⠀⠀⠀⠀⠘⣿⡀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⣼⠏⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢸⡇⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⣸⡏⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢸⡇⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢀⡿⠁⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⣸⡇⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢀⣀⣀⣸⣧⡀⣀⣀⣀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⣰⡟⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠒⠒⠉⠉⠉⠁⠀⠀⠉⠉⠉⠉⠉
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⣿⠃⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⣿⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⣿⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⣾⡇⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
          `,
    `
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⣖⠒⠊⠉⠉⠐⠒⠀⠀⠀⠀⠀⠀⠀⠀⣀⣀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠙⢷⣄⠀⠀⠀⠀⠀⢀⣤⣤⣤⣤⣤⣤⣿⣇⠀⠀⠀⠀⠀⠀⣀⣀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠈⠳⣄⠀⠀⠀⠿⠋⠉⠈⠉⠉⠉⠛⠛⠓⠦⢤⣀⠀⠠⠿⠛⠛⠒⠂⢀⣀⣀⡀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠘⢷⡄⠀⠀⠀⠀⠀⠀⠀⠀⠀⣀⣤⣤⡤⠿⢷⣦⣄⡀⠀⠀⣠⡾⠛⠉⣙⣷⣒⢶⢄⡀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠙⣄⠀⠀⠀⠀⠀⠀⣴⡾⠋⠁⣀⣤⡶⠶⠶⣮⣽⣶⣾⠏⣠⡶⠛⠉⢉⣍⠉⠻⣝⢦⡀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢀⣿⡆⠀⠀⠀⠀⠀⣬⣤⣴⠟⠉⠀⠀⠀⠀⠀⠉⠙⢿⣶⠋⠀⠀⠀⢿⣿⣷⣦⡈⢻⡽⡀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⣠⠶⠋⠀⠀⠀⠀⠀⠀⠀⢿⣅⠀⠀⠀⠀⠀⣰⣾⣿⣦⠀⠀⢻⡆⠀⠀⠀⢸⣿⣿⠉⣷⡄⠹⡀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⣠⡶⠟⠁⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠹⡆⠀⠀⠀⠀⣿⣿⠿⣿⡄⠀⠠⢣⠀⠀⠀⠀⢿⣿⣿⡿⠃⢀⣷
⠀⠀⠀⠀⠀⠀⠀⢀⣴⠞⠋⠁⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢰⡿⣿⠀⠀⠀⣸⣿⣟⣰⣿⠁⠀⠀⣸⣄⠀⠀⠀⠀⠈⣁⣠⡴⢛⡥
⠀⠀⠀⠀⣠⡴⠞⠉⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢸⣧⢹⣆⠀⠀⠹⣿⠿⠛⠁⠀⢀⣼⣏⠉⠙⣛⣛⣉⣭⡵⣶⣿⣿⠁
⠀⠀⣠⠞⠋⠀⠀⠀⠀⠀⢀⣠⡶⠶⠶⣄⠀⠀⠀⠀⠀⣿⣄⠀⠀⢻⣄⠙⠷⢦⣤⣤⣤⣤⢶⣾⠏⠀⠙⢿⣦⣄⣀⣠⣴⠞⠋⠁⠀⢡
⢠⡾⠁⠀⠀⠀⠀⠀⠀⣴⠛⢹⣄⠀⠀⠹⣷⣀⠀⠀⠀⠈⠙⠷⣤⣤⣈⣙⣳⣶⡶⠶⠟⠋⠁⠀⠀⠀⠀⠀⠈⢻⣏⠁⠀⠀⠀⠀⣰⣿
⣾⠀⠀⠀⠀⠀⠀⠀⢸⡟⠀⣿⡟⢷⣄⠀⠈⠻⢷⣄⣀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢀⣀⣤⣶⣿⣧⠿
⣿⠀⠀⠀⠀⠀⠀⠀⠸⣷⠀⠸⣿⣄⠙⢿⣦⣄⣀⠈⠙⠻⠶⢤⣄⣀⣀⣀⡀⠀⠀⠀⠀⠀⠀⢀⣀⣀⣀⣠⣤⣶⣾⣿⡭⣷⣿⣿⠃⠀
⢹⡀⠀⠀⠀⠀⠀⠀⠀⠹⣄⠀⠘⢿⣿⠿⠿⣿⣿⣿⡶⢤⣤⣀⣀⣉⣉⣉⣉⣛⣛⣛⣛⣻⣟⣫⡿⠿⠿⠾⠿⠿⢿⣭⠀⣼⣿⠏⠀⠀
⠀⠳⡄⠀⠀⠀⠀⠀⠀⠀⠙⢷⣄⠀⠙⠳⢤⣀⡉⠛⠿⣷⣤⣉⡉⠉⠉⠙⠛⠛⠛⢛⣿⣿⡧⠀⠀⠀⠀⠀⢀⣠⣴⣿⣾⡿⠋⠀⠀⠀
⠀⠀⠘⢦⡀⠀⠀⠀⠀⠀⠀⠀⠙⠷⣤⣀⠀⠉⠙⠳⠶⠤⣽⣿⣿⣿⣶⣶⣶⣶⡾⠿⣛⣉⣤⣤⢤⡴⣶⣿⡭⢿⡼⠟⠉⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠙⠢⣄⠀⠀⠀⠀⠀⠀⠀⠀⠙⠛⠲⠦⣤⣤⣀⣀⣀⣀⣀⣠⣬⣽⠿⠭⠿⠛⠓⡒⣛⠩⣴⠛⠁⠀⠈⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠈⠑⠠⢤⣄⠀⠀⠀⠀⠀⠀⠀⠀⠀⠈⠉⠉⠛⠋⠉⠉⠀⣀⣀⡤⡄⠀⣉⣥⣃⡘⠁⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
          `,
    `
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⣀⣠⢴⣴⣶⢿⡿⣿⣿⣿⣟⣦⣤⢀⠀⠀⠀⢀⣀⣤⣶⣶⣶⣶⣶⣄⣀⡀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⢠⣰⡾⢿⡹⣏⢶⣓⢮⣖⡳⢦⡳⣭⢻⡽⣯⣶⣴⡶⣟⢯⡛⣵⣚⠶⣓⢮⣛⡿⣿⣭⣳⡀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⢀⣴⡿⣹⡍⠂⢹⣎⢷⡹⣞⣼⣽⣳⣽⣶⣫⢼⡹⢿⣿⣷⢪⠷⣹⠶⣭⢻⣝⣮⠇⡈⢜⡻⣷⣏⣤⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⣠⢿⡞⣱⢧⡻⣜⣧⣿⣟⣿⠻⣟⢻⡛⢿⡻⢿⣿⣳⣭⣿⣿⣧⣻⣥⣿⡼⣧⣾⣭⣿⣼⣏⣷⡹⣾⣳⣆⡀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⣰⡿⣏⢾⡱⣏⢷⡿⣛⡳⣞⡼⣛⡼⣣⣟⣧⣛⣷⣾⣽⣿⣿⣿⣿⣿⡹⢞⡽⣓⢯⡛⢾⡹⣏⡟⣿⣳⢿⣿⣷⣤⠀⠀⠀⠀
⠀⠀⢀⣰⣟⡳⣝⠎⣷⡹⣎⠷⣭⢳⣎⡷⣽⣾⣷⣿⠿⠿⠟⡛⠛⠻⠻⠿⣿⣿⣿⣯⣞⡽⣶⣻⠷⠿⠾⡽⠶⠿⠷⢾⡽⣿⣷⣆⠀⠀
⠀⢢⣼⣿⢮⣽⠊⡔⣯⢷⣭⢻⣼⣷⣿⣿⠿⠏⠉⠀⠀⢀⠀⠀⠀⣤⡀⠀⡰⢏⠿⣿⣿⠉⠁⠀⠁⠀⠀⠀⠀⠀⠀⠀⠈⠉⠻⢿⣷⣶
⣴⡿⢻⣟⠾⣼⠁⢈⣿⠳⢮⣿⣿⡿⡍⣹⠂⠂⠀⠀⠀⠀⠀⢀⣾⣿⣿⣿⣵⠈⠀⣿⣿⠄⠀⠀⠀⠀⠀⠀⠀⣠⣾⣷⣶⡀⠀⠈⢿⣿
⠿⣜⡻⣏⡻⣜⢧⡻⣜⢯⢿⣿⣿⣷⣦⣑⠀⠀⠀⠀⠀⠀⡀⠾⣿⣿⣿⣿⣏⠃⠀⣿⣿⠀⠀⠀⠀⠀⠀⠀⠀⢿⣿⣿⡿⠇⠀⠀⣸⣿
⠻⣜⣳⢭⡳⣝⢮⣳⡝⣮⢳⢮⣝⡻⣿⣿⣷⣶⣀⣀⠀⠀⠀⠀⠘⠙⢋⣎⣙⣆⣶⣿⣿⣆⣀⣀⡀⣀⠀⣀⢀⡀⣈⢑⣀⣠⣔⣶⣿⣎
⢈⡟⣧⢏⣷⢫⡗⣧⠿⣜⢯⡞⣼⢳⡝⣿⢿⣿⣿⣿⣿⣶⣷⣾⣾⣷⣿⣿⣿⣿⣿⡿⣟⣻⢻⢟⡿⣽⢻⡽⢯⠿⡽⣏⢟⣳⣯⣿⣿⠛
⣮⡝⣮⢻⡜⣧⢻⡜⣟⢮⡳⣝⣧⢻⣼⡹⢮⡵⣫⢟⡻⢟⡿⢿⢿⣿⣿⣿⡿⣻⢭⡳⢧⣧⣛⡞⣼⠲⣏⡞⣝⡺⡵⣮⣟⠻⡝⣯⣾⡄
⣧⢻⡜⣧⢻⣜⢯⣝⢮⢷⡹⣞⡼⣳⢞⡽⣣⢷⡹⢮⡝⣧⣿⣿⣿⢻⡻⢼⡱⢧⣏⢷⣫⢟⡿⣾⣷⣿⣻⡽⣟⡟⣿⣷⣈⣰⣤⣿⣿⣃
⡞⣧⢻⣜⣧⣛⠾⣜⢯⡞⣵⢫⡞⣵⢫⢷⡹⢮⡝⣧⢻⡿⣟⡽⢎⡷⣹⢧⣻⢳⢮⡳⣝⢾⡱⣏⠿⣧⢳⡝⡾⣜⠶⣹⢿⣿⣿⣿⣿⣿
⣟⡼⣳⢞⡶⣫⢟⡽⢮⣝⡞⣧⢻⡜⣯⢞⡽⣣⢟⣼⢣⡟⡼⣭⢻⣜⣳⢻⡜⣯⢳⡽⣎⢷⡻⣜⣻⡜⣧⣻⢵⣫⢏⣧⢻⣿⣿⣿⣿⣿
⡾⣱⢏⡾⣱⢏⡾⣹⢳⢮⡝⢮⣳⣽⣾⣿⣿⣿⣿⣾⣧⣿⣵⣋⠷⣎⡗⡯⣞⡵⣫⢞⡽⣎⢷⡹⢧⡻⣜⢧⣛⠶⣫⢖⡳⢾⣿⣿⣿⣿
⣷⡹⣎⢷⣹⢮⡳⣏⢟⣲⣽⣿⣿⣿⣿⣿⣿⣯⣟⡿⣿⢿⣿⣿⣿⣿⣿⣵⣾⣼⣧⣿⣼⣝⣮⣝⣧⣻⣼⣮⣽⣿⣿⡿⣿⣻⢿⣿⣿⣿
⡶⣝⢯⡞⣵⢫⢷⡹⢮⣿⣿⢯⣷⣛⣾⣟⣿⣻⣿⣿⣿⢿⣶⢿⣼⣳⣟⣻⣻⣻⢿⣿⣿⣿⣿⣿⣿⣟⣿⣛⣟⣳⣝⣾⣵⣿⣿⣿⣿⣿
⡽⣎⡷⣫⡝⣯⠞⣽⣣⢟⡿⣿⣾⢿⣾⣿⣷⣿⣶⣿⣾⣟⣾⣯⣿⣽⣻⣟⡿⣽⢿⡿⣿⢿⡿⣿⢿⡿⣾⡽⣾⣟⡿⢯⣿⣿⣿⡿⣿⣏
⣳⡝⢾⣱⢻⡜⣯⡝⡿⣿⣼⣥⢫⣏⢮⡳⣍⢯⡝⢯⣛⠿⠿⢿⠿⣿⢿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣯⣿⣶⣻⣶⣽⣿⣿⠿⠏⠁⠁⠈⠈
⣗⣺⢣⣏⢷⡹⢶⡹⣵⢫⢷⣫⢗⣮⡳⣝⢯⡞⣽⣣⢟⡾⣹⣏⢷⣹⣎⠷⣭⢞⡱⢯⡝⣮⠽⣭⣛⣼⣳⣿⡟⠻⠙⠀⠁⠀⠀⠀⠀⠀
⣿⣟⣿⣾⣷⣿⣮⣗⣧⣛⣮⢳⣏⣶⢻⡝⣮⢽⡳⣏⢿⡼⣳⢞⡽⢶⣫⢟⡼⣫⡝⣧⣛⣶⣻⣶⣿⣿⡿⠃⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⣿⣻⢿⣷⣿⣾⣽⣯⣻⢿⡽⣿⣾⢿⣿⢿⡾⣷⢿⣾⡷⣟⣧⣿⢾⣳⡽⣮⣳⣧⣿⣾⣿⣿⣿⣿⠟⠯⠁⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⣿⣽⣻⡾⣽⢯⣟⡿⣿⢿⣿⡿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⢿⣟⣿⣻⢿⣿⣿⣏⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⣿⣞⡷⣿⢯⣟⣯⡿⣽⡿⣾⣿⣿⣿⣿⣿⣿⢿⣿⣿⣿⣿⣿⣿⣿⢿⣿⣯⣟⡿⣞⣷⣯⣟⡿⣿⣿⣶⡄⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
          `,
    `
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⣠⣤⣤⣤⡀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⣠⣶⣿⠟⠉⠉⠻⣿⡄⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢀⣤⣾⠿⠉⠀⠀⠀⠀⠀⠹⣿⡄⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⣀⣴⣾
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢀⣴⣿⠟⠁⠀⠀⠀⠀⠀⠀⠀⠀⣿⣿⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⣀⣴⣾⡿⠛⠉
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢀⣴⣿⠟⠁⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢸⣿⡆⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢀⣴⣾⡿⠟⠁⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢀⣀⣴⣿⡿⠃⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢸⣿⣷⣶⣶⣦⣤⣤⣄⡀⠀⢀⣠⣾⣿⠿⠋⠀⠀⠀⠀⠀⣠
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⣼⣿⣿⡿⠋⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⣠⣤⠶⠞⣿⠟⠋⠉⠉⠙⣻⠿⢿⣿⣿⣿⠟⠁⠀⠀⠀⠀⠀⢀⡼⠁
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢰⣿⠁⠛⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⣰⠟⠁⢠⡞⠁⠀⠀⠀⢀⡴⠋⠀⢀⡿⠋⠁⠀⠀⠀⠀⠀⠀⠀⡞⠁⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⣠⣼⣿⡄⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⣼⠃⠀⢠⠏⠀⠀⠀⠀⣰⠏⠀⠀⣠⠟⠀⠀⠀⠀⠀⠀⠀⠀⠀⢸⡥⠤⡀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⣰⣿⠟⠁⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠠⣇⠀⣠⡏⠀⠀⠀⠀⣼⠁⠀⠀⣰⠋⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢀⡴⠁
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⣀⣄⣄⣼⣿⠋⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢻⡶⠋⠀⠀⠀⠀⢸⣧⠀⠀⣴⠃⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠘⢧⠀
⠀⠀⠀⠀⠀⠀⠀⠀⢀⣀⣀⠀⠀⠀⠀⣾⡿⠿⣿⡿⠁⠀⠀⠀⠀⠀⠀⣠⣶⣶⣶⡀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠙⠛⠛⠁⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠈⠳
⠀⠀⠀⠀⠀⠀⢀⣾⠿⠛⢿⣿⣷⣄⡀⣿⠃⠀⠈⠀⠀⠀⠀⠀⠀⢀⣾⣿⣿⣿⣿⣧⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⣠⣤⣦⣼⣿⠀⠀⠀⣿⣿⣿⣿⣿⣦⣀⠀⠀⠀⠀⠀⠀⠀⣿⣿⣿⣿⣿⣿⡿⠀⠀⠀⢀⣀⣀⣀⣀⡀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⣤⣾⣿⣿⣿⣷⣄⠀⠀⠀⠀⠀⠀⠀
⠀⣠⣾⡿⠋⠉⠉⠁⠀⠀⠀⠀⠉⢯⡙⠻⣿⣿⣷⣤⡀⠀⠀⠀⠀⢿⣿⣿⣿⣿⡿⠃⢀⡤⠖⠋⠉⠉⠉⠉⠉⠉⠒⠦⣄⠀⠀⠀⠀⠀⣾⣿⣿⣿⣿⣿⣿⣿⣧⠀⠀⠀⠀⠀⠀
⣾⣿⠋⠀⠀⠀⠀⣀⣀⠀⠀⠀⠀⠀⠙⢦⣄⠉⠻⢿⣿⣷⣦⡀⠀⠈⠙⠛⠛⠋⠀⢰⠟⡇⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠈⠳⣄⠀⠀⠀⣿⣿⣿⣿⣿⣿⣿⣿⣿⠀⠀⠀⠀⠀⠀
⣿⡇⠀⠀⠀⣴⠟⣫⣿⣿⣄⠀⠀⠀⠀⡶⢌⡙⠶⣤⡈⠛⠿⣿⣷⣦⣀⠀⠀⠀⠀⡇⠀⢻⣄⠀⠀⣠⢷⠀⠀⠀⠀⠀⡶⠀⠘⡆⠀⠀⠻⣿⣿⣿⣿⣿⣿⣿⡟⠀⠀⠀⠀⠀⠀
⣿⡇⠀⠀⢸⣟⢸⣿⣿⣿⣿⠀⠀⠀⠀⡇⠀⠈⠛⠦⣝⡳⢤⣈⠛⠻⣿⣷⣦⣀⠀⠀⠀⠀⠈⠙⠋⠁⠀⠛⠦⠤⠤⠚⠁⠀⠀⢳⠀⠀⠀⠈⠛⠿⠿⠿⠟⠋⠀⠀⠀⠀⠀⠀⠀
⣿⡇⠀⠀⠈⢿⣞⣿⣿⣿⠏⠀⠀⠀⠀⡇⠀⠀⠀⠀⠀⠙⠳⢬⣛⠦⠀⠙⢻⣿⣷⣦⣀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⡞⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⣿⡇⠀⠀⠀⠀⠉⠛⠋⠁⠀⠀⠀⠀⠀⡇⠀⠀⠀⠀⠀⠀⠀⠀⠈⠁⠀⠀⠈⣿⠉⢻⣿⣷⣦⣀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢀⡼⠁⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⣿⡇⠀⠀⠀⠀⠀⣠⣄⠀⠀⢰⠶⠒⠒⢧⣄⡀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⣿⠀⢸⡇⢸⡟⢿⣷⣦⣴⣶⣶⣶⣶⣤⣔⠋⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⣿⡇⠀⠀⣤⠀⠀⠿⠿⠁⢀⡿⠀⠀⠀⡄⠈⠙⡷⢦⣄⡀⠀⠀⠀⠀⠀⠀⠀⣿⠀⢸⡇⢸⡇⠀⣿⠙⣿⣿⣉⠉⠙⠿⣿⣧⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⣿⡇⠀⠀⠙⠷⢤⣀⣠⠴⠛⠁⠀⠀⠀⠇⠀⠀⡇⢸⡏⢹⡷⢦⣄⡀⠀⠀⠀⣿⡀⢸⡇⢸⡇⠀⡟⠀⢸⠀⢹⡷⢦⣄⣘⣿⡆⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⣿⣿⠢⣤⡀⠀⠀⠀⠀⠀⠀⣠⠾⣿⣿⡷⣤⣀⡇⠸⡇⢸⡇⢸⠉⠙⠳⢦⣄⡻⢿⣾⣧⣸⣧⠀⡇⠀⢸⠀⢸⡇⢤⣈⠙⠻⣿⣆⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⢹⣿⣷⣌⡉⠛⠲⢶⣶⠖⠛⠛⢶⣄⡉⠛⠿⣽⣿⣶⣧⣸⡇⢸⠀⠀⠀⠀⠈⠙⠲⢮⣝⠻⣿⣷⣷⣄⣸⠀⢸⡇⠀⠈⠁⠀⢸⣿⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠈⠙⠻⢿⣷⣶⣤⣉⡻⢶⣄⣀⠈⠙⠳⢦⣈⡉⠻⢿⣿⣷⣾⣦⡀⠀⠀⠀⠀⠀⠀⠈⠙⠲⢭⣛⠿⣿⣷⣼⡇⠀⠀⠀⠀⠈⣿⡇⠀⠀⠀⠀⠀⠀⣀⠀⠀⠀⠀⠀⠀⠀⠀⣀
⠀⠀⠀⠀⠀⠈⠙⠻⢿⣿⣷⣶⣽⣻⡦⠀⠀⠈⠙⠷⣦⣌⡙⠻⢿⣟⣷⣤⣀⠀⠀⠀⠀⠀⠀⠀⠈⠙⠳⢯⣻⡇⠀⠀⠀⠀⠀⢸⣿⠀⣀⠀⠀⠀⠀⠈⠳⣄⠀⠀⠀⢀⡏⠙⠛
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠈⠛⠻⢿⣿⣿⣿⣶⣤⣤⣤⣀⣈⠛⠷⣤⣈⡛⠷⢽⡻⢶⣄⣀⠀⠀⠀⠀⠀⠀⠀⠈⠛⠳⢤⣀⠀⠀⢸⣿⡀⠈⠳⢤⣀⣀⣰⠃⠈⠛⠶⠶⠿⠃⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢈⣿⡿⠛⠉⠙⠛⠛⠻⢷⣦⣄⣩⣿⠶⠖⠛⠛⠛⠛⠛⠛⠿⢷⣶⣦⣄⠀⠀⠀⠀⠉⢻⣶⣿⣿⠇⠀⠀⠀⠉⠉⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⣼⣿⠁⠀⠀⠀⠀⠀⠀⠀⣿⣿⠋⠀⠀⠀⠀⠀⣠⠖⠂⠀⠀⠀⠈⠙⠿⣿⣦⡄⠀⠀⣸⣿⠟⠋⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢰⣿⡟⠀⠀⠀⠀⠀⠀⠀⠀⢸⡇⠀⠀⠀⠀⣰⠊⠁⠀⠀⠀⠀⠀⠀⠀⠀⠈⠛⢿⣶⣄⣿⡇⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⣿⣿⠇⠀⠀⠀⠀⠀⠀⠀⠀⢸⣧⠀⠀⢀⠞⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⡠⠙⢿⣿⣇⡀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢀⡿⠿⠀⠀⠀⠀⠀⠀⠀⠀⠀⠘⡿⠦⠠⠋⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠧⠤⠄⠙⡿⠿⠦⠤⠤⠤⠤⠄⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
          `,
    `
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠠⣄⡀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠘⠻⣦⣄⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⣀⡴⠂⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠙⠲⢤⡀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⣤⠾⠋⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠙⢦⣤⡀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⢀⣤⡾⠛⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠙⣷⣿⣠⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⣠⡾⠟⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢸⣿⣿⣧⡀⠀⠀⠀⠀
⠀⠀⠀⠀⢀⣼⡟⠁⣠⠂⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠹⣿⣿⣧⠀⠀⠀⠀
⠀⠀⠀⢠⣿⡿⠀⠸⠁⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠸⣿⣿⣧⠀⠀⠀
⠀⠀⢀⣼⣿⡇⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠹⣿⣿⠇⠀⠀
⠀⠀⣾⣿⡿⠁⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢿⣿⣦⠀⠀
⠀⢸⣧⣿⠇⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢸⣿⣿⣷⠀
⠀⢸⣽⡏⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢸⣿⡇⣿⠀
⠀⣸⣿⡇⠀⠀⠀⠀⠀⠀⣀⣀⡀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⣀⣀⣀⣠⣤⣤⣠⣤⣤⣤⡀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢸⣿⡷⣿⡇
⢠⣿⣿⠀⠀⠀⠀⠀⠀⣸⣿⣿⣿⣿⣿⣿⡿⣿⣷⣦⠀⠀⠀⠀⠀⣴⣿⣟⣋⣉⣿⣿⣅⣠⣯⣾⣿⣿⣶⡀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢸⣿⣿⢻⡇
⠀⣿⣿⠀⠀⠀⠀⠀⢸⣿⣿⠿⣻⣷⠿⠿⢿⣯⣉⠁⠀⠀⠀⠀⠀⠀⢉⣩⣽⡿⠿⠿⠿⢿⣥⣴⡿⣿⣿⣧⡤⠀⠀⠀⠀⠀⠀⠀⠀⢸⣿⣿⢸⡇
⠀⢹⣿⠀⠀⠀⠀⠀⠀⢠⣄⣾⣿⣧⣤⡤⣤⣈⣻⣷⡄⠀⠀⢀⡀⣴⣿⣿⣋⣧⣶⡿⢶⣾⣿⣿⣧⣿⣿⠋⠀⠀⠀⠀⠀⠀⠀⠀⠀⢸⣿⣿⣹⡇
⠀⢸⣿⡄⠀⠀⠀⠀⠀⠈⠉⠉⢹⣟⠻⠶⠿⠉⣽⣿⠇⠀⠀⠀⠀⠿⠿⠿⠋⠹⣿⣿⣾⣷⡾⠟⠉⠉⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢸⣿⣿⠋⠁
⠀⢸⣿⡇⠀⠀⠀⠀⠀⠀⠀⠀⠀⠙⠳⠾⠛⠛⠋⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠋⠉⠉⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢸⣏⣿⠀⠀
⠀⢸⣿⡇⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⣹⣿⣟⠀⠀
⠀⢸⣿⡇⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⣽⣿⡏⠀⠀
⠀⠈⠻⣿⡀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⣀⣀⣀⠀⠀⠀⠀⠀⢀⣀⣀⣀⣀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢸⡿⠃⠀⠀
⠀⠀⠀⠈⢿⡆⠀⠀⠀⠀⠀⠀⠀⣠⣶⣾⣿⠿⣿⣿⣿⣿⣿⣿⣿⠿⣿⡿⠻⣿⣻⣿⣦⣀⣀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⣸⠁⠀⠀⠀
⠀⠀⠀⠀⠘⣧⠀⠠⡄⠀⠀⣴⣿⣿⣻⠛⣿⣇⣈⣿⣿⣿⣿⣻⣿⣷⣿⣷⣤⣤⣿⣿⣿⣿⣿⣿⣦⣄⢀⠀⠀⠀⠀⠄⢀⡀⠀⠀⢰⣿⠀⠀⠀⠀
⠀⠀⠀⠀⠀⢸⠀⠰⣄⠀⣾⣿⣿⣿⣿⣿⣻⣿⣧⣜⠻⢿⡿⢛⣿⣿⡏⢹⣿⣝⣿⣿⣷⣿⣿⣿⣿⣿⠉⠀⡀⠀⠀⠀⢼⠇⠀⠀⢸⣿⡄⠀⠀⠀
⠀⠀⠀⠀⠀⢾⣧⠀⠸⡆⣿⣿⣿⣿⣿⣿⠟⠋⠙⠛⠿⠿⠿⠿⠟⠛⠛⠛⠛⠛⠛⠿⠿⣿⣿⣿⣿⣿⡆⢸⡇⢀⣷⠀⠀⠀⠀⠀⣿⣿⣇⠀⠀⠀
⠀⠀⠀⠀⠀⢸⣿⣇⠀⢱⠘⠿⠉⠁⠙⢿⣆⡀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢀⣀⣀⣠⣾⠟⠉⠁⠻⠇⢸⡇⣸⡟⠀⠀⠀⠀⣼⣿⣏⣻⡄⠀⠀
⠀⠀⠀⠀⠀⢸⢹⣿⣷⠀⠀⠀⠀⠀⢲⡀⠉⠉⠉⠉⠉⠉⠉⠉⠉⠉⠉⠉⠉⠉⠉⣡⣾⡟⠀⠀⠀⠀⢀⣿⢡⣿⠃⠀⠀⠀⣼⣿⣿⡟⣇⣇⠀⠀
⠀⠀⠀⠀⠀⢸⡇⢹⣿⡆⠀⠀⠀⠀⠈⠻⣦⡀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢀⣠⣾⡿⠟⠋⠀⠀⠀⠀⢀⣾⢃⣿⡟⠀⠀⠀⢸⣿⣿⣿⡇⠍⣾⠀⠀
⠀⠀⠀⠀⠀⢸⠷⠾⢿⣿⠀⠀⠀⠀⢠⡆⠙⠿⣷⣶⣶⣾⣿⣿⣿⣿⣿⣿⣿⣷⣀⠀⠀⠀⠀⠀⠀⣿⣵⣿⡏⠀⠀⠀⠀⣸⣿⣿⣿⡇⢠⣿⡄⠀
⠀⠀⠀⠀⠀⠈⠀⠀⠘⣿⣆⠀⠀⠀⠀⣷⠀⠀⠀⠈⠉⠀⠉⠉⠛⠃⠀⠀⠀⠈⠻⣷⠀⠀⠀⠀⠀⠀⠉⠀⠀⠀⠀⠀⢠⣿⣿⣿⣿⣿⡿⢻⡇⠀
⠀⠀⠀⠀⠀⣆⠀⠀⠀⠸⣿⣦⡀⠀⠀⠹⣷⠀⠀⠀⢹⣄⠀⠀⠀⣠⣶⡄⠀⠀⠀⢻⡆⠀⠀⠀⣤⣤⣶⣦⣄⣀⢀⣶⣿⣿⣿⡿⠛⠁⢀⣼⠇⠀
⠀⠀⠀⠀⠀⢸⡀⠀⠀⠀⠙⣿⣿⣷⡀⢠⣿⡀⠀⠀⢸⣿⡆⠀⠀⢻⣿⣿⠀⠀⠀⢸⣿⡄⢀⣤⣿⣿⣿⣿⣿⣿⣿⣿⡿⠟⠁⠀⠀⢀⡿⠏⠀⠀
⠀⠀⠀⠀⠀⠀⢻⡄⠀⠀⠀⣨⡿⠻⣿⣿⣿⡇⠀⠀⠸⣿⡇⠀⠀⠸⣿⣿⡆⠀⠀⠈⣿⣿⣿⣿⣿⣿⣿⣿⣿⡿⠛⠁⠀⠀⠀⣀⡴⠋⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠳⣄⣠⡾⠋⠀⢰⡞⢿⣿⡁⠀⠀⠀⢿⣧⠀⠀⠀⢿⣿⡇⠀⠀⠀⠛⣿⣿⣿⣿⣿⣿⡿⠋⠀⠀⠀⠀⣠⡾⠋⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠙⡏⠀⠀⣠⣾⡾⠛⠛⠛⠛⠛⠷⣾⣿⣷⣴⣦⣤⣾⣿⣶⣶⣶⣾⡟⠛⠛⣿⠛⠉⠀⠀⠀⠀⣠⡾⠋⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⣼⠃⣰⣣⣿⠏⠀⠀⠀⠀⠀⠀⠀⠀⠀⠉⠉⠛⠻⢿⡿⣿⣿⣿⣿⠀⠀⠀⢹⣆⠀⠀⢀⣴⠟⠉⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠐⣷⣼⣿⣿⣿⠀⠀⠀⠀⠀⠀⠀⢀⣤⠶⠶⠀⠀⠀⠀⠀⠀⠀⠈⠻⣄⠀⠀⠀⠹⣦⣴⣿⣿⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠙⠿⢻⡇⠀⠀⠀⠀⠀⠚⠉⠁⠀⠀⢀⡀⠀⠀⠀⠀⠀⠀⠀⠀⠸⡄⠀⠀⠀⠻⣿⡿⠋⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠈⠙⣦⡄⢰⣄⣀⣀⣀⣠⣤⣾⣿⡟⠀⠀⠀⠀⠀⠀⠀⠀⢠⣿⣦⣤⣤⡄⠙⣶⣦⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⣿⣧⣤⣝⣿⣿⣾⠿⠋⠉⠁⠀⠀⠀⠀⠀⠀⠀⠀⣰⣿⣿⣿⣿⣿⣿⣆⠀⠹⡄⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢰⡋⠀⠀⠀⠉⠁⠀⠀⠀⠀⠀⢀⣴⠀⠜⠋⠀⣰⣾⠿⠟⣿⠛⣿⣿⢹⠀⠀⠀⣷⡀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠈⢷⣦⣀⣀⣀⣀⣀⣠⣶⣶⣾⡿⠋⣼⣷⠀⣺⣿⣇⣶⡾⠁⠀⣿⣿⢸⠀⠀⠀⢸⣧⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⣿⠛⠛⠛⠛⠛⠛⠋⠉⠉⣠⣾⣿⣿⣾⣿⣿⣿⢿⠇⠀⠀⣿⣿⣿⠀⠀⠀⠀⢻⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠹⣦⣀⠀⠀⠀⢀⣠⣶⣿⣿⣿⢩⣉⣹⣿⣿⣧⣾⠀⠀⠀⢹⣿⣿⠂⠀⠀⠀⢸⣷⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠈⠙⣷⣶⣶⣿⣿⣿⠟⢙⣿⣿⣿⣟⣿⡛⠛⠋⠀⠀⠀⣼⣿⣿⡀⠀⠀⠀⠸⣿⡆⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⣿⠙⣿⣯⣉⣠⣶⣿⡏⠉⠹⠿⠛⠁⠀⠀⠀⠀⠀⢸⣿⣿⡇⠀⠀⠀⠀⠸⣇⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⣿⢠⠀⠉⠉⠉⠁⣿⡇⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢸⣿⣿⡇⠀⠀⠀⠀⠀⣿⡀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢿⣾⠀⠀⠀⠀⠀⢸⣿⡄⠀⠀⠀⠀⠀⠀⠀⠀⠀⢸⣿⣿⣷⠀⠀⠀⠀⠀⢹⡇⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⣼⣿⣦⣄⠀⠀⠀⠘⣿⣷⣤⠀⠀⠀⠀⠀⠀⠀⠀⠘⣿⣿⣿⡇⠀⠀⠀⠀⢸⣿⡄⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢀⣠⣶⣦⣭⣉⠉⠻⣦⣄⡀⢈⣿⣿⣿⡇⠀⠀⠀⠀⠀⠀⠀⣼⣿⣿⣿⣷⣴⣶⣤⣀⢸⣿⣧⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢠⣴⣿⣛⡓⠶⣭⣻⣷⢾⣿⣿⣿⣿⣿⣿⣿⡇⠀⠀⠀⠀⠀⠀⣾⣿⡟⢻⠛⢛⣒⣛⣛⣛⣻⣿⣿⣆⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⣠⡶⠟⠛⠛⠉⢉⣥⣿⡟⣳⣿⣿⣿⣿⣿⣿⣿⣿⡇⠀⠀⠀⠀⠀⠈⠁⣿⡟⠷⠀⠘⣿⣍⣩⣭⣍⣻⣿⣿⡄⠀⠀⠀⠀
⠀⠀⠀⠀⠀⣠⠶⠒⠛⠛⠓⠲⠶⣦⣤⣎⡉⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⡇⠀⠀⠀⠀⠀⠀⢸⣿⣧⠀⠰⢶⣿⣭⣭⣽⣯⣽⣿⣿⣧⠀⠀⠀⠀
⠀⠀⠀⢀⣼⡏⠀⠀⠀⠀⠀⠀⣠⣨⣭⣿⣷⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⡇⠀⠀⠀⠀⠀⠀⠚⣿⣿⠀⠀⠀⠙⣍⣉⣉⣉⣑⣻⣿⣿⣧⡀⠀⠀
⠀⠀⣴⣿⠋⠀⠀⠀⠀⠀⠀⠀⣼⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⠇⠀⠀⠀⠀⠀⠀⠀⣿⣿⡆⠀⠀⠚⠛⠛⠛⠛⠛⠿⠿⣿⣿⣧⠀⠀
⠀⢰⣿⣷⡀⠀⠀⠀⠀⠀⣠⣾⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⡿⠛⠛⠁⠀⠀⠀⠀⠀⠀⠀⠀⣿⣿⠃⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠸⣿⣿⣦⠀
⠀⠘⣿⣿⣿⣦⣤⣤⣤⣴⣿⣿⣿⣿⣿⣿⣿⣿⣿⡿⠿⠛⠉⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⣸⣿⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢸⣿⣿⣿⡇
⠀⠀⠈⠻⢿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⠟⠋⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⣿⣿⠀⢀⠀⠀⠀⠀⠀⠀⠀⠀⠀⣸⣿⣿⣿⡇
⠀⠀⠀⠀⠀⠈⠉⠛⠛⠛⠛⠛⠛⠉⠉⠁⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠸⣿⣷⣮⣤⣤⣤⣤⣤⣤⣤⣤⣴⣿⣿⣿⣿⣷
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠙⢿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⡿
⠀⠀⠀⡀⢀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⡈⢉⣙⡛⠛⠛⠛⠛⠛⠛⠛⠛⠛⠛⠁
      `,
    `
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⣀⣀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⢸⠁⠈⠳⣄⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢀⡤⠖⢦⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⢸⠀⠀⠀⠘⢆⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢀⡴⠋⠀⠀⢸⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⢸⠀⠀⠀⠀⠈⢧⡀⠀⠀⠀⠀⠀⠀⢀⡴⠋⠀⠀⠀⠀⢸⠁⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⣸⠀⠀⠀⠀⠀⠀⠈⠉⠉⠉⠉⠒⠒⠋⠀⠀⠀⠀⠀⠀⢸⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⣠⠖⠋⠁⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢸⠀⠀⠀⠀
⠀⠀⠀⠀⣠⠞⠁⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢯⠀⠀⠀⠀
⠀⠀⢀⡞⠁⠀⢀⣤⣄⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠈⢣⠀⠀⠀
⠀⢠⠏⠀⠀⠠⢯⣿⣿⠁⠀⠀⠀⠀⠀⠀⣠⡤⣤⡀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢧⠀⠀
⢀⡞⠀⠀⠀⠀⠈⠉⠁⠀⠀⠀⠀⠀⠀⣼⠁⣷⣾⣿⠆⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠈⣇⠀
⣸⠀⠀⠀⠀⢀⣀⡀⠀⠀⠀⠀⠀⠀⠀⠈⠑⠛⠋⠁⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢸⠀
⡏⠀⠀⢠⣾⣿⣿⣿⣿⣦⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢸⡇
⡇⠀⠀⠀⢹⣿⣿⣿⠿⠋⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢸⡇
⣇⠀⠀⠀⠀⠈⠉⠉⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢸⠁
⢹⡀⠀⠀⢸⣿⣷⣶⣤⣀⠀⠀⠀⣀⣀⡄⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⡞⠀
⠀⢧⠀⠀⠀⠈⠉⠉⠉⠉⠉⠉⠉⠉⠉⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⡼⠀⠀
⠀⠈⢧⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢀⡞⠁⠀⠀
⠀⠀⠈⠳⡀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⣠⠋⠀⠀⠀⠀
⠀⠀⠀⠀⠈⠢⣄⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢀⡴⠋⠁⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠈⠑⠢⢄⣀⡀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢀⣀⣀⡤⠖⠉⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠉⠉⠉⠁⠀⠒⠈⠉⠉⠉⠁⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
          `,

    `
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⣀⣀⣀⣀⣀⣀⣀⡀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⣀⣤⣶⡾⠿⠛⠛⠛⠛⠛⠛⠛⠛⠛⠛⠿⠷⣶⣤⣄⣀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⢀⣤⡾⠟⠋⠁⣀⣀⣤⣤⣄⠀⠀⠀⠀⠀⠀⠀⠀⠀⠾⠿⠿⠿⢿⣿⣶⣶⣦⣄⡀⠀⠀⠀
⠀⠀⠀⢀⣴⠟⠋⢀⣤⣶⡿⠟⢋⣉⣀⣀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⣠⣴⣿⡿⣿⣿⣿⣿⡦⠀⠀
⠀⠀⣴⡟⢁⣴⣾⡿⠟⢁⣴⡾⠛⠛⠛⠛⠻⢷⣄⠀⠀⠀⠀⠀⠀⠀⣴⡾⠋⠁⠀⢀⣾⣿⣿⣷⡀⠀⠀
⠀⣸⡟⠀⠛⠋⠉⠀⢀⣿⠋⠀⠀⠀⠀⠀⠀⠈⢿⡆⠀⠀⠀⠀⠀⣼⠏⠀⠀⠀⠀⠈⠛⠛⠀⣿⡇⠀⠀
⢠⣿⠀⠀⠀⠀⠀⠀⣼⡇⠀⣴⣶⣦⡀⠀⠀⠀⢸⡇⠀⠀⠀⠀⠀⣿⡄⠀⠀⠀⠀⠀⠀⠀⣰⣿⣷⠀⠀
⣼⡇⠀⠀⠀⠀⠀⠺⢿⣷⡀⠿⠿⠛⠀⠀⠀⢀⣾⠇⠀⠀⠀⠀⠀⠘⠿⣶⣦⣤⣤⣶⣶⣾⣿⣭⣿⠀⠀
⣿⠀⠀⠀⠀⠀⠀⠀⠀⠉⠛⠷⣶⣤⣤⣤⣶⠿⠃⠀⠀⠀⠀⠀⠀⠀⠀⣀⣽⠟⠉⢀⣀⣀⠉⠛⢿⣇⠀
⣿⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠤⢤⣤⣤⡤⠴⠶⣿⣿⠋⢠⣾⡟⠉⠛⢿⣆⠀⢻⣧
⡏⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⡀⠀⠀⠀⠀⠀⠀⢠⣿⠃⢠⣿⢿⡿⢿⣶⣾⣿⡆⢸⣿
⣇⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⣾⡏⠀⢸⡷⠾⠷⠾⠷⠿⢿⡇⢸⡿
⣿⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢹⣇⠀⣿⡇⠀⠀⠀⠀⠀⣸⡇⣸⡇
⢻⡆⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠈⣿⠀⣿⡇⠀⠀⠀⠀⢠⣿⢁⣿⠀
⠘⣿⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⣿⠀⣿⠃⠀⠀⠀⠀⣾⡇⢸⣿⠀
⠀⢻⣇⠀⠀⠀⡀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢠⣿⠀⣿⠀⠀⠀⠀⠀⣿⠀⠸⣿⠀
⠀⠈⣿⡄⠀⠀⢳⡀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠑⠦⠀⠀⠀⠀⣸⡏⢰⣿⣤⣀⣀⠀⠀⢿⡇⠀⣿⠀
⠀⠀⠘⣿⡀⠀⠈⢷⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⣿⠁⣸⡏⠀⠈⠙⠳⣄⢸⣿⠀⣿⠀
⠀⠀⠀⠹⣷⡀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠘⠳⠶⣤⣀⠀⠀⠀⢸⡏⠀⣿⣤⣤⣤⣤⣤⣼⣿⣿⠀⣿⠀
⠀⠀⠀⠀⠙⣷⡀⠀⠀⠠⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠙⠻⣦⣀⣼⡇⠀⢿⣇⣽⣯⣿⣹⣇⣼⠇⠀⣿⠀
⠀⠀⠀⠀⠀⠘⢿⣦⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠈⠻⣿⣇⠀⠘⣿⣍⠉⠉⢻⣿⠟⠀⣰⡿⠀
⠀⠀⠀⠀⠀⠀⠀⠙⢷⣤⣀⠀⠀⠀⠀⠦⣄⣀⠀⠀⠀⠀⠀⠀⠘⣿⣄⠀⠈⠙⠛⠛⠛⠉⢀⣴⡿⠁⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠉⠻⢷⣦⣄⡀⠀⠀⠈⠉⠓⠂⠀⠀⠀⠀⠈⠻⢷⣦⣤⣤⣤⣤⣴⠿⠋⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠈⠙⠻⠿⣶⣤⣄⡀⠀⠀⠀⠀⠀⠀⢀⣀⣤⣽⡿⠛⠉⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠈⠉⠛⠿⣶⣤⣤⣤⡶⠿⠛⠉⠁⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⣀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠂⠀⢠⡶⠀⡠⣖⣲⣲⠖⢲⣶⡀⠀⠀⠑⢼⣔⣲⢂⣰⠒⠂⠀⡟⠛⢶⣒⠀⠠⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢀⡀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠘⠀⠀⠀⠀⠀⠀⠀⠀⠀
          `,

    `
⠀⠀⠀⠀⠀⠀⠀⠀⠀⡇⠀⡇⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢀⣠⣶⣶⣿⣿⣿⣿⣷⣦⣤⣬⡀⠀⡇⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⡇⢸⠃⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⣀⣴⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣶⠄⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⡇⢸⠂⠀⠀⠀⠀⠀⠀⠀⠀⢀⣾⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣆⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⢰⠃⢸⠀⠀⠀⠀⠀⠀⠀⠀⢤⣾⣿⣿⣿⣿⣿⣿⣿⣿⠿⠟⠛⠋⠉⠉⣀⠀⠙⢿⣆⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⢸⠀⣾⠀⠀⠀⠀⠀⠀⠀⠀⢺⣿⣿⣿⣿⣿⠿⠛⠁⠀⠀⠀⠀⠀⠀⠀⠈⣷⠀⠈⢿⡄⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⣀⣀⣀⣀⣀⣀⡀⠀⣸⠀⡟⠀⠀⠀⠀⠀⠀⠀⠀⢈⣿⣿⣿⠁⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢸⣄⣀⠠⣷⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⡭⣭⡭⣭⠋⢹⡇⠀⡏⢀⡇⠀⠀⠀⠀⠀⠀⠀⠀⠀⣿⣿⣿⠆⠀⠀⠀⠀⠀⠀⠀⠀⠀⢀⣤⣶⣿⣿⣿⣿⣿⢻⣷⡄⣄⠀⠀⠀⠰⠞⢿⣶⠞⣿⡶⠟⣶⣤⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⣼⠁⠀⡇⢸⡇⠀⠀⠀⠀⠀⠀⠀⠀⠀⠘⣿⣿⠀⠀⢀⣤⣴⣶⣶⣶⣖⠒⠺⣿⣿⠻⣿⣿⠿⢻⡄⣿⣷⠈⠀⠀⠀⠀⣰⡟⠁⣾⡟⠡⣾⡏⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⣿⠀⠀⡇⢸⡇⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢻⣿⡀⢰⠟⣫⣶⣾⣿⣿⡌⠃⠀⢽⣿⡈⠉⠁⠀⠀⠀⢿⣿⠀⠀⠀⠀⠀⠼⠿⠀⠿⠟⠀⠿⠶⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⡏⠀⢸⡇⣾⠁⠀⠀⠀⠀⠀⠀⠘⣆⠀⢰⣶⢿⣷⠃⠛⠛⠷⠾⠟⠁⢀⡀⡂⠀⠙⠛⣻⣦⣀⣀⣤⣾⡿⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⡇⠀⢸⡃⣿⠀⠀⠀⠀⠀⠀⠀⠀⠘⠀⢸⣧⣼⢿⣄⠐⡀⠀⠀⢀⡴⠋⣠⣥⣤⣴⣿⣋⠈⣭⡉⢙⣿⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⢰⡇⠀⣸⠃⣿⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢻⣧⣀⣿⣆⠀⣤⠔⠛⠁⢀⣤⡶⠟⣛⣯⡿⢷⣿⡀⢀⣿⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⢸⠇⠀⣿⣤⡇⠀⣀⠀⠀⡀⠀⠀⠀⠀⠀⠀⠀⠙⢿⣽⣿⣦⠀⠙⣺⣿⣿⠿⠞⠛⠉⠁⣠⡾⡏⠀⢸⡏⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⢸⠀⠐⣟⣿⣷⣿⢛⣿⣾⡟⣿⣶⠆⠀⠀⠀⠀⠀⠀⠀⡼⢿⡄⠀⠈⠉⠛⠶⠖⠒⠚⠋⣩⡾⠁⠀⢸⣷⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⣼⠀⠀⣿⣿⡋⢨⣿⠋⢠⣿⠋⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠘⣷⠀⠀⠀⠀⠀⠀⠰⠶⠾⠛⢁⢰⢦⣾⢿⣦⡀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⡿⠀⠰⣿⣿⣿⢻⣿⢀⡀⣷⠆⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢹⡇⠀⠀⠀⠀⠀⠀⠀⠀⠀⠘⣯⣿⡿⢲⣾⣿⡿⠘⠶⣄⡀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⢠⡇⠀⢰⡷⣿⠃⠀⠀⠀⠉⠉⠉⠈⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠺⣷⡄⠲⣦⣌⢾⣷⣶⣾⣼⣿⣿⣿⣷⣿⣿⡟⠀⠀⠀⠈⠉⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠇⠀
⠀⠀⠀⢸⡇⠀⢸⣷⣿⣷⠶⠶⠶⠤⢤⣤⣤⣤⣤⣤⣤⣀⣀⣀⣀⣀⣀⡀⢘⣷⠀⠀⠁⠀⠻⣿⡿⠟⠋⠉⠀⣄⣿⠏⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢷⡀
⠀⠀⠀⢸⠇⠀⠘⠛⠛⠛⠛⠛⠛⠷⠶⠶⠶⠶⠶⢦⣥⣬⣭⣭⣭⣍⣹⡿⠋⣽⡄⠀⠀⠀⠀⠀⠀⢀⠀⢀⣴⠟⠁⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⢸⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠈⠉⠀⠀⠻⣷⡄⣀⡀⠀⣀⣴⡶⠞⠋⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠈⠳⣄⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠈⠉⠉⠉⠉⠉⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠈⠣
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢠
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢠⣿
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢀⣿⣿
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⣼⣿⣿
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢰⣿⣿⣿
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⣸⣿⣿⣿
          `,

    `
⠉⠉⠉⠁⣸⡟⠀⠀⠀⠀⠈⠉⠉⠋⠉⠛⢻⣿⠈⠉⠉⠉⠈⠈⠈⠈⠈⠈⠈⠈⠁⠁⠁⠁⠁⠁⠁⠁⠁⠉⠉⠉⠉⠉⠉⠉⠉⠉⢻⣇⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⡃
⠀⠀⢠⣶⣿⣧⣤⣀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢿⡇⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠘⣿⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⡇
⠀⠀⠈⣿⣿⣿⣿⣿⠿⢦⣄⡀⠀⠀⠀⠀⠀⠸⣷⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢻⡇⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⡇
⠀⠀⣰⣿⣿⣿⣿⣿⠀⠀⠈⠙⠳⢦⣄⡀⠀⠀⢿⡇⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠸⣷⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⡇
⠀⢰⡿⠁⠈⢻⣿⣿⠀⠀⠀⠀⠀⠀⠈⠛⠷⣦⣸⣿⣤⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⣿⣧⣀⣤⣠⣤⣤⣤⣤⣤⣄⣠⣤⣼⡇
⠀⣾⠃⠀⠀⠀⠹⣿⡦⠀⠀⠀⠀⠀⠀⠀⠀⠈⠙⠿⣷⣆⡀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢸⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⠿⠛⠉⡇
⣼⠃⠀⠀⠀⠀⠀⠹⣿⡀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠈⠙⢿⣦⡀⠆⣁⠀⣀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢈⣿⣿⣿⣿⣿⠿⠛⠋⠉⠀⠀⠀⠀⡇
⠟⠀⠀⠀⠀⠀⠀⠀⢹⣷⡀⢀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠉⠻⣷⣟⣷⣹⡆⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢀⣬⣿⡿⠛⠋⠁⠀⠀⠀⠀⠀⠀⠀⠀⡇
⠀⠀⠀⠀⠀⠀⠀⠀⠀⢹⣷⡆⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠈⠻⣿⣹⣦⣤⣤⣤⣤⣤⣤⡶⠶⠶⠶⠶⠶⠶⠶⣶⣤⣤⣴⠾⠛⠉⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⡇
⠀⠀⠀⠀⠀⠀⠀⠀⠀⢶⣿⣿⣄⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠉⠋⠉⠁⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⡇
⠀⠀⠀⠀⠀⠀⠀⠀⢐⣼⣿⣿⣿⣧⡀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⡇
⣄⣀⣀⣀⣀⣀⣤⣤⣾⣿⣿⣿⣿⣿⣿⣦⡀⠀⠀⢠⡤⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢀⣴⡇
⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣦⣼⠟⠁⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠐⣦⡀⠀⠀⣀⣴⠟⠉⡇
⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⡿⠉⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠲⣄⠈⠻⣶⡾⠋⠁⠀⠀⡇
⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⠁⠀⠀⠀⠀⠀⠀⣀⣀⣀⡀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⣀⣀⣀⠀⠀⠀⠀⠀⠀⠈⠂⠀⠹⣷⡀⠀⠀⢀⡇
⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣵⢾⣿⠃⠀⠀⠀⠀⠀⠀⣾⠋⠙⣿⣿⡄⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⣿⠋⢹⣿⣷⠀⠀⠀⠀⠀⠀⠀⠀⠀⠹⣿⢀⠀⢸⡇
⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⠋⠇⢸⡏⠀⠀⠀⠀⠀⢀⠀⣿⣷⣾⣿⣿⡇⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠈⣿⣷⣾⣿⣿⠇⠀⠀⠀⠀⠀⠀⠀⠀⠀⢿⣏⠀⢸⡇
⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⠀⢀⣿⠀⠀⠀⠀⠀⠀⠊⠀⠈⠻⣿⠿⠛⠁⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⡙⠿⣿⠿⠋⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⣿⣶⣾⡇
⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⡿⠀⣼⡇⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢠⣾⣶⣶⣤⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠄⠒⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢸⣿⣿⡇
⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⠟⠁⢀⣿⠀⣠⣴⠶⠶⠶⣤⡀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠤⣈⢙⡛⠁⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢀⣤⡶⠶⠶⢶⣄⡀⠀⠀⠀⠐⢿⣿⡇
⣿⣿⣿⣿⣿⣿⣿⠿⠟⠁⠀⠀⢸⡇⢸⡏⠁⠀⠀⠀⢈⣿⡄⠀⠀⠀⠀⠀⠀⢀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢀⡟⠉⠀⠀⢰⢦⡙⣷⠀⠀⠀⠀⢸⣿⡇
⠟⠙⠛⠛⠉⠉⠀⠀⠀⠀⠀⠀⢸⡇⠸⣷⣄⠀⠆⢀⣼⡿⠀⠀⠀⠀⠀⠀⠀⠈⠄⠀⣠⡶⠾⠟⠓⠒⠲⣶⡄⠀⠀⠀⠀⠀⠀⠀⠀⠸⣷⡀⠠⠄⠋⠈⣫⣿⠁⠀⠀⠀⠀⢿⡇
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠸⣇⠀⠈⠙⠛⠛⠛⠉⠀⠀⠀⠀⠀⠀⠀⠀⢀⢰⢸⣿⠠⠀⠀⠀⠈⠙⢺⣿⠀⠀⠀⠀⠀⠀⠀⠀⠀⠈⠻⢶⣤⣶⠾⠟⠁⠀⠀⠀⠀⠀⢸⡇
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢿⡄⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢠⡈⢿⣄⠀⠤⢒⠆⠈⢘⣿⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⡇
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠈⣿⡀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠙⢦⡙⠳⠶⠤⠤⠶⠿⠋⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⡇
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢈⣷⡀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⡇
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢘⣷⡀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⡇
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⣹⡇⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠃
          `,
    `
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⣀⣀⣤⣤⣤⣤⣄⣀⣀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⣀⣤⣶⡿⠛⠋⠉⠉⠉⠉⠉⡿⠛⠻⠷⣶⣤⡀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢠⣾⠟⠉⠀⠙⣦⣀⣀⣀⣠⡤⠴⡿⣄⡀⠀⠀⠉⠻⢷⣤⡀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⣰⡟⠁⠀⠀⠀⣰⠋⢧⠀⠀⠀⠀⠀⡇⠀⠉⠙⠓⠒⡶⢯⣙⣿⣆⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⣼⡟⠀⠀⠀⢀⠞⠁⠀⠈⣳⡤⠤⠴⠚⣟⠛⠒⠒⠒⣺⠳⢤⣀⣉⣻⣷⡀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⣸⡿⠶⠶⣤⣾⡁⠀⠀⢀⡜⠉⣧⣠⣤⣴⣾⣶⠶⠶⠶⠷⣶⣶⣶⣬⣭⣙⣷⡀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⢠⣿⠁⠀⠀⣿⠀⠙⢲⣞⠁⣠⡾⠟⠉⠁⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠉⠙⠻⢷⣄⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⢸⡏⠀⠀⠀⡇⠀⠀⢸⠏⣿⡏⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠙⢷⡄⠀
⠀⠀⠀⢀⣠⣴⣶⣶⣦⣾⠃⠀⠀⢠⡇⠀⠀⣸⠀⣿⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠈⣿⡄
⠀⠀⣠⡿⠿⡄⠀⠀⠈⣿⡀⠀⠀⡼⠀⠀⣴⣃⣤⣿⡀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢸⡇
⠀⣰⡿⠁⠀⠹⡄⠀⠀⣿⠿⣶⣴⡷⠒⠋⠻⡄⠀⢹⣧⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢀⣿⠃
⢀⣿⠁⠀⠀⠀⢹⣀⣴⡏⠀⠀⠙⢿⣦⠀⠀⢹⡄⠀⠻⣧⡀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢀⣠⣿⠋⠀
⢸⡿⢧⠀⠀⢀⡼⠯⣼⡇⠀⠀⠀⠀⠙⣷⡄⠀⣇⡤⠞⠉⠻⢷⣤⣄⣀⣀⠀⠀⠀⠀⠀⠀⣀⣀⣀⣤⣶⣿⣿⣿⠀⠀
⣿⡇⠈⢧⣠⠎⠀⠀⢸⡇⠀⠀⠀⠀⠀⠘⣿⡞⠛⠢⣄⠀⣠⠏⠈⠉⡿⠛⠛⠛⢻⠛⠛⠛⠛⢿⠉⠁⣴⠟⠁⣿⠀⠀
⣿⠃⠀⡼⠧⣄⠀⠀⢸⡇⠀⠀⠀⠀⠀⠀⠘⣷⡀⠀⠘⣶⣁⡀⠀⡼⠁⢀⡀⠀⠘⡇⣀⣠⣤⣬⣷⣾⠏⠀⠀⣿⠀⠀
⣿⣀⡞⠁⠀⠈⢣⡀⢸⡇⠀⠀⠀⠀⠀⠀⠀⢹⣇⠀⡼⠁⠀⠉⣹⠛⠉⠉⡉⠉⢙⣏⠁⠀⠀⠀⣼⡏⠀⠀⠀⣿⠀⠀
⣿⡿⣄⠀⠀⠀⠀⢳⣼⡇⠀⠀⠀⠀⠀⠀⠀⠈⣿⡾⠁⠀⠀⢀⡇⢠⠂⣜⣠⣤⠸⡟⢣⠀⠀⢰⡿⠀⠀⠀⠀⣿⠀⠀
⣿⡇⠈⠳⡄⠀⠀⣨⢿⡇⠀⠀⠀⠀⠀⠀⠀⠀⣿⡗⠒⠲⢤⣸⠀⣸⣄⣿⣿⣿⣷⣿⣞⣠⣤⣿⠇⠀⠀⠀⠀⣿⠀⠀
⢸⣇⠀⠀⢹⡀⡰⠃⢸⡇⠀⠀⠀⠀⠀⠀⠀⠀⢸⡇⠀⠀⠀⣹⢉⡽⣿⢿⣿⣿⣿⣿⣅⠀⠀⣿⠀⠀⠀⠀⢀⣿⠀⠀
⠘⣿⡀⠀⠈⡿⠁⠀⢸⣷⣦⣤⣤⣄⣀⡀⠀⠀⢸⡇⠀⠀⠀⡟⠘⡅⢇⢸⣿⣿⠇⡇⡸⠀⠀⣿⠀⢀⣀⣠⣼⣿⠀⠀
⠀⢻⣇⠀⣰⠛⠒⠦⣼⡇⠀⠀⠉⠉⠙⢻⣷⣦⣼⡏⠉⠓⠦⣿⠤⠵⠾⠾⠿⢿⣸⣯⠧⠖⠚⣿⡾⠟⠋⠉⣹⡇⠀⠀
⠀⠈⢿⣶⠇⠀⠀⠀⢸⣿⣶⣤⣤⣤⣀⣼⣀⣈⣙⣃⡀⠀⠀⢹⡀⠀⠀⢀⣀⣀⣸⣁⣀⣀⣤⣤⣤⣶⠶⠿⣿⡇⠀⠀
⠀⠀⠈⠻⣷⣄⠀⠀⢘⣧⠀⠀⠉⠉⠉⠙⠛⠛⠛⠛⠛⠛⠛⠛⠛⠛⠛⠛⠛⠛⠛⠛⢉⡉⠉⠉⠀⠀⠀⢀⣿⠁⠀⠀
⠀⠀⠀⠀⠈⠙⠛⠿⠻⣿⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢸⡷⠶⠶⠶⢶⡶⠿⠿⠿⠛⠋⠀⠀⢀⣀⣤⣾⡿⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⣿⣤⣀⡀⠀⠀⠀⠀⠀⠀⠀⠀⠀⣸⡇⠀⠀⠀⢸⣧⣤⣤⣤⣶⣶⠶⠿⠛⠋⠁⣼⡇⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⢿⡍⠙⠛⢿⠿⠷⠶⠶⠾⠿⠿⠟⢻⡇⠀⠀⠀⢸⡏⠉⠁⠀⣀⣀⣀⣀⣄⣀⣀⣿⠁⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⢸⡟⠲⢦⣼⣀⣀⣀⣤⣤⣀⣀⡀⢸⡇⠀⠀⠀⢸⣷⠖⠚⠉⠉⠀⠀⠀⠀⠀⣸⡏⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠸⣿⠀⠀⡏⠁⠀⠀⠀⠀⠀⠈⠉⣿⠇⠀⠀⠀⠀⢿⣆⠀⠀⠀⠀⠀⠀⠀⣠⡿⠁⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠻⣧⣀⡇⠀⠀⠀⠀⠀⢀⣠⣾⠟⠀⠀⠀⠀⠀⠈⠻⢷⣶⣶⣶⣶⡶⠿⠛⠁⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠈⠛⠛⠿⠿⠿⠿⠿⠛⠋⠁⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
          `,

    `
⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⡿⠿⠿⠿⠿⢿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿
⣿⣿⣿⣿⣿⣿⣿⣿⠟⠋⠁⠀⠀⠀⠀⠀⠀⠀⠀⠉⠻⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿
⣿⣿⣿⣿⣿⣿⣿⠁⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢺⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿
⣿⣿⣿⣿⣿⣿⣿⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠆⠜⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿
⣿⣿⣿⣿⠿⠿⠛⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠉⠻⣿⣿⣿⣿⣿
⣿⣿⡏⠁⠀⠀⠀⠀⠀⣀⣠⣤⣤⣶⣶⣶⣶⣶⣦⣤⡄⠀⠀⠀⠀⢀⣴⣿⣿⣿⣿⣿
⣿⣿⣷⣄⠀⠀⠀⢠⣾⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⢿⡧⠇⢀⣤⣶⣿⣿⣿⣿⣿⣿⣿
⣿⣿⣿⣿⣿⣿⣾⣮⣭⣿⡻⣽⣒⠀⣤⣜⣭⠐⢐⣒⠢⢰⢸⣿⣿⣿⣿⣿⣿⣿⣿⣿
⣿⣿⣿⣿⣿⣿⣿⣏⣿⣿⣿⣿⣿⣿⡟⣾⣿⠂⢈⢿⣷⣞⣸⣿⣿⣿⣿⣿⣿⣿⣿⣿
⣿⣿⣿⣿⣿⣿⣿⣿⣽⣿⣿⣷⣶⣾⡿⠿⣿⠗⠈⢻⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿
⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⡿⠻⠋⠉⠑⠀⠀⢘⢻⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿
⣿⣿⣿⣿⣿⣿⣿⡿⠟⢹⣿⣿⡇⢀⣶⣶⠴⠶⠀⠀⢽⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿
⣿⣿⣿⣿⣿⣿⡿⠀⠀⢸⣿⣿⠀⠀⠣⠀⠀⠀⠀⠀⡟⢿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿
⣿⣿⣿⡿⠟⠋⠀⠀⠀⠀⠹⣿⣧⣀⠀⠀⠀⠀⡀⣴⠁⢘⡙⢿⣿⣿⣿⣿⣿⣿⣿⣿
⠉⠉⠁⠀⠀⠀⠀⠀⠀⠀⠀⠈⠙⢿⠗⠂⠄⠀⣴⡟⠀⠀⡃⠀⠉⠉⠟⡿⣿⣿⣿⣿
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢷⠾⠛⠂⢹⠀⠀⠀⢡⠀⠀⠀⠀⠀⠙⠛⠿⢿
          `
  ];
  const random = Math.floor(Math.random() * asciiArts.length);
  const ascii = asciiArts[random];
  console.log(ascii);
  return ascii;
}
