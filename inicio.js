import { initializeApp } from "https://www.gstatic.com/firebasejs/9.0.2/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/9.0.2/firebase-auth.js";
import { getFirestore, collection, getDocs, updateDoc, doc, addDoc, getDoc, deleteDoc, where, query } from "https://www.gstatic.com/firebasejs/9.0.2/firebase-firestore.js";
import { getStorage, ref, uploadBytes, getDownloadURL } from "https://www.gstatic.com/firebasejs/9.0.2/firebase-storage.js";


// Configura la información de tu proyecto de Firebase
const firebaseConfig = {
  apiKey: "AIzaSyCP6eUU6UueorEfCX8RauWoR1_Tz7yd_P0",
  authDomain: "puestags.firebaseapp.com",
  projectId: "puestags",
  storageBucket: "puestags.appspot.com",
  messagingSenderId: "52670231863",
  appId: "1:52670231863:web:7c5d962dad77c549e916b2"
};

const firebaseApp = initializeApp(firebaseConfig);
const auth = getAuth(firebaseApp);


// Variables globales
let horarioItems = [];
const sidebar = document.querySelector(".sidebar");
const container = document.querySelector(".container");
const btnLider = document.getElementById("btnLider");
const btnReportes = document.getElementById("btnReportes");
const btnColaborador = document.getElementById("btnColaborador");

const btnPermisos = document.getElementById("btnPermisos");
const btnProyectos = document.getElementById("btnProyectos");
const proyectosListContainer = document.querySelector(".proyectos-list");
const permisosListContainer = document.querySelector(".permisos-list");
const reportsListContainer = document.querySelector(".reports-list");
const colaboradorListContainer = document.querySelector(".colaboradores-list");
const employeesListContainer = document.querySelector(".employees-list");
const textoPrincipal = document.getElementById("textoPrincipal");
const employeesTable = document.getElementById("employees-table");
const employeesBody = document.getElementById("employees-body");
const userInfoContainer = document.getElementById("user-info");
const searchReportesInput = document.getElementById("searchReportes");
const reportsBody = document.getElementById("reports-body");
const searchEmpleadosInput = document.getElementById("searchEmpleados");
const btnBorrarEntries = document.getElementById("btnBorrarEntries");



searchReportesInput.addEventListener("input", () => {
  const searchTerm = searchReportesInput.value.toLowerCase();
  const reportesRows = reportsBody.getElementsByTagName("tr");

  searchReportesInput.style.display = "block"; // Mostrar la barra de búsqueda de reportes
  searchEmpleadosInput.style.display = "none"; // Ocultar la barra de búsqueda de empleados
  reportsListContainer.style.display = "block"; // Mostrar la tabla de reportes
  employeesListContainer.style.display = "none"; // Ocultar la tabla de empleados
  proyectosListContainer.style.display = "none";
  btnMostrarFormulario.style.display = "none";

  permisosListContainer.style.display = "none";

  for (const row of reportesRows) {
    const nombreCell = row.cells[0].textContent.toLowerCase();
    const fechaCell = row.cells[1].textContent.toLowerCase();
    const diaCell = row.cells[2].textContent.toLowerCase();
    const proyectoCell = row.cells[7].textContent.toLocaleLowerCase();
    row.style.display = nombreCell.includes(searchTerm) || fechaCell.includes(searchTerm) || diaCell.includes(searchTerm) || proyectoCell.includes(searchTerm) ? "table-row" : "none";
  }
});

const resultMessage = document.getElementById("resultMessage");




document.getElementById("searchColaborador").addEventListener("input", function () {
  const searchTerm = this.value.toLowerCase();
  const colaboradoresTable = document.getElementById("colaboradores-table");
  const colaboradoresBody = document.getElementById("colaboradores-body");
  const colaboradoresRows = colaboradoresBody.getElementsByTagName("tr");

  for (const row of colaboradoresRows) {
    const nombreCell = row.cells[0].textContent.toLowerCase();
    const rfcCell = row.cells[1].textContent.toLowerCase();

    // Mostrar u ocultar la fila según si la búsqueda coincide con algún término en las celdas
    row.style.display = nombreCell.includes(searchTerm) || rfcCell.includes(searchTerm) ? "table-row" : "none";
  }
});
const btnAgregarColaborador = document.getElementById("Agr");
btnAgregarColaborador.addEventListener("click", () => {
  const addColaboradorForm = document.getElementById("add-colaborador-form");
  addColaboradorForm.style.display = "block";
});


const btnGuardarCol = document.getElementById("btnGuardarCol");
btnGuardarCol.addEventListener("click", async () => {
  const name = document.getElementById("name2").value;
  console.log("Nombre a guardar:", name);

  const lastName = document.getElementById("lastname2").value;
  console.log("lastName a guardar:", lastName);

  const motherLastname = document.getElementById("motherLastName2").value;
  const rfc = document.getElementById("rfc2").value;
  const phoneNumber = document.getElementById("phoneNumber2").value;
  const curp = document.getElementById("curp").value;

  if (!name || !lastName || !motherLastname || !rfc || rfc.length !== 13) {
    alert("Por favor, complete los campos obligatorios.");
    return;
  }

  try {
    const db = getFirestore(firebaseApp);
    const usuariosCollection = collection(db, "users");

    // Agregar el nuevo usuario a Firestore con datos adicionales
    await addDoc(usuariosCollection, {
      name: name,
      lastName: lastName,
      motherLastName: motherLastname,
      rfc: rfc,
      curp: curp,
      phoneNumber: phoneNumber,
      status: "Disponible", // Agregar la variable status con el valor "Disponible"
    });

    console.log("Nuevo usuario registrado y datos agregados con éxito.");

    // Cerrar formulario después de guardar y limpiar los campos
    const addUserForm = document.getElementById("add-colaborador-form");
    addUserForm.style.display = "none";
    document.getElementById("name2").value = "";
    document.getElementById("lastname2").value = "";
    document.getElementById("motherLastName2").value = "";
    document.getElementById("rfc2").value = "";
    document.getElementById("curp").value = "";
    document.getElementById("phoneNumber2").value = "";
    await updateTable();
  } catch (error) {
    console.error("Error al registrar nuevo usuario:", error);
  }
});


const btnCerrarCol = document.getElementById("btnCerrarCol");
btnCerrarCol.addEventListener("click", () => {
  const addUserForm = document.getElementById("add-colaborador-form");
  addUserForm.style.display = "none";

  // Borrar los valores de los campos de texto
  document.getElementById("name2").value = "";
  document.getElementById("lastname2").value = "";
  document.getElementById("motherLastName2").value = "";
  document.getElementById("rfc2").value = "";
  document.getElementById("curp").value = "";
  document.getElementById("phoneNumber2").value = "";
});


btnColaborador.addEventListener("click", async () => {
  console.log("Clic en Colaboradores");
  textoPrincipal.textContent = "Colaboradores";

  try {
    const db = getFirestore(firebaseApp);
    const usersCollection = collection(db, "users");
    const usersSnapshot = await getDocs(usersCollection);

    const colaboradorListContainer = document.querySelector(".colaboradores-list");
    const colaborBody = document.getElementById("colaboradores-body");

    colaboradorListContainer.style.display = "block";
    colaborBody.innerHTML = "";
    reportsListContainer.style.display = "none";
    employeesListContainer.style.display = "none";
    btnAgregar.style.display = "none";
    permisosListContainer.style.display = "none";
    btnMostrarFormulario.style.display = "none";

    usersSnapshot.forEach((userDoc) => {
      const userData = userDoc.data();
      const name = userData.name || "Nombre no encontrado";
      const rfc = userData.rfc || "";
      const curp = userData.curp || "CURP no encontrado";
      const paterno = userData.lastName || "Apellido no encontrado";
      const materno = userData.motherLastName || "Apellido no encontrado";
      const status = userData.status || "Status indefinido";
      const userId = userDoc.id;


      // Resto de tu lógica para mostrar la información del usuario
      const row = document.createElement("tr");
      const qrContainer = document.createElement("td"); // Nuevo td para contener el código QR
      // Generar código QR
      const qr = new QRCode(qrContainer, {
        text: userId,
        width: 50,
        height: 50
      });

      // Agregar evento de clic al código QR
      qrContainer.addEventListener("click", () => {
        // Mostrar modal
        showModal(userId);
      });

      row.innerHTML = `
        <td>${name} ${paterno} ${materno}</td>
        <td>${rfc}</td>
        <td>${status}</td>
      `;
      row.appendChild(qrContainer);

      colaborBody.appendChild(row);
    });

    // Resto de tu código para mostrar detalles adicionales si es necesario

    // Display containers
    permisosListContainer.style.display = "none";
    colaboradorListContainer.style.display = "block";
    employeesListContainer.style.display = "none";
    proyectosListContainer.style.display = "none";
    addProyectForm.style.display = "none";
    btnMostrarFormulario.style.display = "none";
    reportsListContainer.style.display = "none";

  } catch (error) {
    console.error("Error al cargar la lista de colaboradores:", error);
  }
});


function showModal(userId) {
  const modal = document.getElementById("qrModal");
  const largeQR = document.getElementById("largeQR");
  const downloadButton = document.getElementById("downloadButton");

  // Limpiar cualquier contenido previo en el modal
  largeQR.innerHTML = '';

  try {
    console.log("Creando nuevo código QR");
    // Crear un nuevo código QR
    const qr = new QRCode(largeQR, {
      text: userId,
      width: 200,
      height: 200
    });

    console.log("Mostrando el código QR en el modal");

    // Crear una nueva imagen con el código QR y agregarla al modal
    const qrImage = new Image();
    qrImage.src = qr._el.childNodes[0].toDataURL("image/png"); // Convertir a formato base64
    largeQR.appendChild(qrImage);
  } catch (error) {
    console.error("Error al crear y mostrar el código QR:", error);
  }

  modal.style.display = "block";

  console.log("Agregando evento de clic al botón de descarga");
  // Agregar evento de clic al botón de descarga
  downloadButton.addEventListener("click", () => {
    console.log("Descargando código QR");

    // Obtener la imagen del código QR en formato base64
    const qrImageData = largeQR.querySelector("img").src.split(",")[1];

    // Configurar enlace de descarga
    const downloadLink = document.createElement("a");
    downloadLink.href = `data:image/png;base64,${qrImageData}`;
    downloadLink.download = "qrCode.png";
    downloadLink.click();
  });
}










// Función para cerrar el modal
function closeModal() {
  const modal = document.getElementById("qrModal");
  modal.style.display = "none";
}

















searchReportesInput.addEventListener("input", () => {
  const searchTerm = searchReportesInput.value.toLowerCase();
  const reportsRows = reportsBody.getElementsByTagName("tr");

  searchEmpleadosInput.style.display = "none"; // Ocultar la barra de búsqueda de empleados
  searchReportesInput.style.display = "block"; // Mostrar la barra de búsqueda de reportes
  employeesListContainer.style.display = "none"; // Ocultar la tabla de empleados
  reportsListContainer.style.display = "block"; // Mostrar la tabla de reportes
  permisosListContainer.style.display = "none";
  proyectosListContainer.style.display = "none";
  addProyectForm.style.display = "none";
  btnMostrarFormulario.style.display = "none";
  colaboradorListContainer.style.display = "none";



  for (const row of reportsRows) {
    const nombreCell = row.cells[0].textContent.toLowerCase(); // Cambiar el índice según la posición de la columna del nombre en tus reportes
    const curpCell = row.cells[1].textContent.toLowerCase(); // Cambiar el índice según la posición de la columna del CURP en tus reportes
    const fechaCell = row.cells[3].textContent.toLowerCase(); // Cambiar el índice según la posición de la columna de la fecha en tus reportes

    // Mostrar u ocultar la fila según si la búsqueda coincide con algún término en las celdas
    row.style.display = nombreCell.includes(searchTerm) || curpCell.includes(searchTerm) || fechaCell.includes(searchTerm) ? "table-row" : "none";
  }
});


// Evento para el botón de Reportes

btnReportes.addEventListener("click", async () => {
  console.log("Clic en Reportes");
  textoPrincipal.textContent = "Reportes";
  try {
    const db = getFirestore(firebaseApp);
    const entriesCollection = collection(db, "entries");
    const entriesSnapshot = await getDocs(entriesCollection);

    const reportsListContainer = document.querySelector(".reports-list");
    const reportsBody = document.getElementById("reports-body");

    reportsListContainer.style.display = "block";
    reportsBody.innerHTML = "";

    employeesListContainer.style.display = "none";
    btnAgregar.style.display = "none";
    permisosListContainer.style.display = "none";
    btnMostrarFormulario.style.display = "none";

    const userPromises = [];
    const projectPromises = [];

    entriesSnapshot.forEach((entryDoc) => {
      const entryData = entryDoc.data();
      const row = document.createElement("tr");

      const userRef = doc(db, "users", entryData.userId);
      const userPromise = getDoc(userRef).then((userDoc) => {
        const userData = userDoc.data();
        if (userData) {
          const photo = userData.photo || "";
          const name = userData.name || "Nombre no encontrado";
          const rfc = userData.rfc || "";
          const curp = userData.curp || "CURP no encontrado";
          const paterno = userData.lastName || "CURP no encontrado";
          const materno = userData.motherLastName || "CURP no encontrado";
          return { photo, name, curp, rfc, paterno, materno };
        } else {
          console.log("Documento de usuario no encontrado");
          return {
            photo: "",
            name: "Usuario no encontrado",
            curp: "CURP no encontrado",
            rfc: "",
            paterno: "Usuario no encontrado",
            materno: "",
          };
        }
      });

      // Obtener el nombre del proyecto
      const projectRef = doc(db, "projects", entryData.projectId);
      const projectPromise = getDoc(projectRef).then((projectDoc) => {
        const projectData = projectDoc.data();
        return projectData ? projectData.nameProject : "Proyecto no encontrado";
      });

      userPromises.push(userPromise);
      projectPromises.push(projectPromise);

      Promise.all([userPromise, projectPromise]).then(([user, nameProject]) => {
        const { name, curp, photo, rfc, paterno, materno } = user;
        const entryTime = entryData.entryTime.toDate();

        const date = entryTime.toLocaleDateString();
        const time = entryTime.toLocaleTimeString();

        const row = document.createElement("tr");
        row.innerHTML = `
          <td>
            <img src="${photo}" alt="Foto de perfil" style="width: 50px; height: 50px;">
          </td>
          <td>${name} ${paterno} ${materno}</td>
          <td>${rfc}</td>
          <td>${curp}</td>
          <td>${date}</td>
          <td>${time}</td>
          <td>${nameProject}</td>
          `;
        reportsBody.appendChild(row);
      });
    });

    await Promise.all([...userPromises, ...projectPromises]);

    // Display containers
    permisosListContainer.style.display = "none";
    reportsListContainer.style.display = "block";
    employeesListContainer.style.display = "none";
    proyectosListContainer.style.display = "none";
    addProyectForm.style.display = "none";
    btnMostrarFormulario.style.display = "none";
    colaboradorListContainer.style.display = "none";



    const existingExportButton = reportsListContainer.querySelector("#exportButton");
    if (existingExportButton) {
      existingExportButton.remove();
    }

    // Create and append export button


    // Enlazar el botón creado dinámicamente con el botón HTML existente
    const exportButtonHTML = document.getElementById("exportButtonHTML");
    exportButtonHTML.addEventListener("click", () => {
      exportToExcel(reportsBody);
    });

    reportsListContainer.appendChild(exportButtonHTML);

  } catch (error) {
    console.error("Error al cargar la lista de reporte:", error);
  }
});

function exportToExcel(reportsBody) {
  const wb = XLSX.utils.table_to_book(reportsBody, { sheet: "Reportes" });
  XLSX.writeFile(wb, "reportes.xlsx");
}

//BORRAR ENTRADAS

btnBorrarEntries.addEventListener("click", async () => {
  const userInput = prompt("Para borrar todos los documentos en la colección 'entries', escribe 'BORRAR' y presiona OK:");
  btnBorrarEntries.classList.add("delete-button");

  if (userInput && userInput.toUpperCase() === "BORRAR") {
    try {
      const db = getFirestore(firebaseApp);
      const entriesCollection = collection(db, "entries");

      const entriesSnapshot = await getDocs(entriesCollection);

      entriesSnapshot.forEach(async (doc) => {
        await deleteDoc(doc.ref);
      });

      resultMessage.textContent = "Todos los documentos en la colección 'entries' han sido eliminados.";
    } catch (error) {
      console.error("Error al intentar borrar los documentos:", error);

      resultMessage.textContent = "Error al intentar borrar los documentos. Consulta la consola para más detalles.";
    }
  } else {
    resultMessage.textContent = "Operación de borrado cancelada. Confirmación incorrecta.";
  }

});





document.getElementById("searchEmpleados").addEventListener("input", function () {
  const searchTerm = this.value.toLowerCase();
  const colaboradoresTable = document.getElementById("employees-table");
  const colaboradoresBody = document.getElementById("employees-body");
  const colaboradoresRows = colaboradoresBody.getElementsByTagName("tr");

  for (const row of colaboradoresRows) {
    const nombreCell = row.cells[0].textContent.toLowerCase();
    const rfcCell = row.cells[1].textContent.toLowerCase();

    // Mostrar u ocultar la fila según si la búsqueda coincide con algún término en las celdas
    row.style.display = nombreCell.includes(searchTerm) || rfcCell.includes(searchTerm) ? "table-row" : "none";
  }
});

//Boton Lider
btnLider.addEventListener("click", async () => {
  console.log("Clic en Lideres");
  textoPrincipal.textContent = "Lideres";
  try {
    const db = getFirestore(firebaseApp);
    const usuariosCollection = collection(db, "lideres");
    const usuariosSnapshot = await getDocs(usuariosCollection);

    employeesBody.innerHTML = "";

    usuariosSnapshot.forEach((usuarioDoc) => {
      const usuarioData = usuarioDoc.data();
      const row = document.createElement("tr");
      row.innerHTML = `
        <td>${usuarioData.nombre} ${usuarioData.apellidoPaterno} ${usuarioData.apellidoMaterno}</td>
        <td>${usuarioData.rfc}</td>
        <td>${usuarioData.telefono}</td>
      `;
      console.log(usuarioData.imageUrl)
      employeesBody.appendChild(row);
    });
    permisosListContainer.style.display = "none";
    reportsListContainer.style.display = "none";
    employeesListContainer.style.display = "block";
    proyectosListContainer.style.display = "none";
    addProyectForm.style.display = "none";
    btnMostrarFormulario.style.display = "none";
    colaboradorListContainer.style.display = "none";


    btnAgregar.style.display = "block"; // Muestra el botón Agregar

  } catch (error) {
    console.error("Error al cargar la lista de empleados:", error);
  }
});


//Boton permisos
btnPermisos.addEventListener("click", async () => {
  console.log("Clic en Permisos");
  textoPrincipal.textContent = "Permisos";

  try {
    const db = getFirestore(firebaseApp);
    const permisosCollection = collection(db, "permisos");
    const permisosSnapshot = await getDocs(permisosCollection);

    const permisosBody = document.getElementById("permisos-body");

    // Limpiar la tabla de permisos antes de rellenarla nuevamente
    permisosBody.innerHTML = "";

    permisosSnapshot.forEach((permisoDoc, index) => {
      const permisoData = permisoDoc.data();
      const row = document.createElement("tr");

      if (index === 0) {
        row.innerHTML = `
          <td>${permisoData.nombre}</td>
          <td>${permisoData.area}</td>
          <td>${permisoData.fechaInicio}</td>
          <td>${permisoData.fechaFinal}</td>
          <td>${permisoData.estatus}</td>
          <td>${permisoData.estatusRH}</td>
          <td>${permisoData.texto}</td>
        `;
      } else {
        row.innerHTML = `
          <td>${permisoData.nombre}</td>
          <td>${permisoData.area}</td>
          <td>${permisoData.fechaInicio}</td>
          <td>${permisoData.fechaFinal}</td>
          <td>${permisoData.estatus}</td>
          <td>${permisoData.estatusRH}</td>
          <td>${permisoData.texto}</td>
          <td><button class="btnAprobarRH" data-permiso-id="${permisoDoc.id}">Aprobar</button></td>
        `;
      }

      permisosBody.appendChild(row);
    });


    reportsListContainer.style.display = "none";
    employeesListContainer.style.display = "none";
    permisosListContainer.style.display = "block";
    proyectosListContainer.style.display = "none";
    btnAgregar.style.display = "none";
    addProyectForm.style.display = "none";
    btnMostrarFormulario.style.display = "none";
    colaboradorListContainer.style.display = "none";


    // Asociar eventos a los botones de aprobación
    const btnsAprobarRH = document.querySelectorAll(".btnAprobarRH");
    btnsAprobarRH.forEach(btn => {
      btn.addEventListener("click", () => {
        const permisoId = btn.getAttribute("data-permiso-id");
        updatePermisoStatusRH(permisoId);
      });
    });

  } catch (error) {
    console.error("Error al cargar los permisos:", error);
  }
});


async function updatePermisoStatusRH(permisoId) {
  try {
    const db = getFirestore(firebaseApp);
    const permisoRef = doc(db, "permisos", permisoId);

    await updateDoc(permisoRef, {
      estatusRH: "Aprobado"
    });

    console.log("Estatus RH actualizado con éxito.");

    // Volver a cargar la tabla de permisos para reflejar los cambios
    const permisosBody = document.getElementById("permisos-body");
    permisosBody.innerHTML = ""; // Limpiar el contenido actual de la tabla

    // Obtener los permisos actualizados
    const permisosSnapshot = await getDocs(collection(db, "permisos"));
    permisosSnapshot.forEach((permisoDoc) => {
      const permisoData = permisoDoc.data();
      const row = document.createElement("tr");
      row.innerHTML = `
        <td>${permisoData.nombre}</td>
        <td>${permisoData.area}</td>
        <td>${permisoData.fechaInicio}</td>
        <td>${permisoData.fechaFinal}</td>
        <td>${permisoData.estatus}</td>
        <td>${permisoData.estatusRH}</td>
        <td>${permisoData.texto}</td>
        <td><button class="btnAprobarRH" data-permiso-id="${permisoDoc.id}">Aprobar RH</button></td>
      `;
      permisosBody.appendChild(row);
    });

    const btnsAprobarRH = document.querySelectorAll(".btnAprobarRH");
    btnsAprobarRH.forEach((btn) => {
      btn.addEventListener("click", async () => {
        const permisoId = btn.getAttribute("data-permiso-id");
        await updatePermisoStatusRH(permisoId);
      });
    });

  } catch (error) {
    console.error("Error al actualizar el estatus RH:", error);
  }
}







btnAgregar.addEventListener("click", () => {
  const addUserForm = document.getElementById("add-user-form");
  addUserForm.style.display = "block";
});
// ...
const btnGuardar = document.getElementById("btnGuardar");
btnGuardar.addEventListener("click", async () => {
  const name = document.getElementById("nom").value;
  console.log("Nombre a guardar:", name);

  const lastName = document.getElementById("lastname").value;
  console.log("lastName a guardar:", lastName);

  const motherLastname = document.getElementById("motherLastName").value;
  const rfc = document.getElementById("rfc").value;
  const phoneNumber = document.getElementById("phoneNumber").value;
  const email = document.getElementById("correo").value;
  const password = document.getElementById("pass").value;

  if (!name || !lastName || !email || !password) {
    alert("Por favor, complete todos los campos obligatorios.");
    return;
  }
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    alert("Por favor, ingrese una dirección de correo electrónico válida.");
    return;
  }
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    const db = getFirestore(firebaseApp);
    const usuariosCollection = collection(db, "lideres");

    await addDoc(usuariosCollection, {
      uid: user.uid,
      email: user.email,
      nombre: name,
      apellidoPaterno: lastName,
      apellidoMaterno: motherLastname,
      rfc: rfc,
      telefono: phoneNumber,
      status: "Activo", 
    });

    console.log("Nuevo usuario registrado y datos agregados con éxito.");

    if (user.emailVerified) {
      console.log("El correo electrónico ya está verificado.");
    } else {
      await sendEmailVerification(user);
      console.log("Correo de verificación enviado con éxito.");
    }

    const addUserForm = document.getElementById("add-user-form");
    addUserForm.style.display = "none";
    document.getElementById("name").value = "";
    document.getElementById("lastname").value = "";
    document.getElementById("motherLastName").value = "";
    document.getElementById("rfc").value = "";
    document.getElementById("phoneNumber").value = "";
    document.getElementById("correo").value = "";
    document.getElementById("pass").value = "";

    await updateTable();
  } catch (error) {
    console.error("Error al registrar nuevo usuario:", error);
  }
});


async function sendEmailVerification(user) {
  try {
    await sendEmailVerification(user.auth);
    console.log("Correo de verificación enviado con éxito.");
  } catch (error) {
    console.error("Error al enviar el correo de verificación:", error);
  }
}



const btnCerrar = document.getElementById("btnCerrar");
btnCerrar.addEventListener("click", () => {
  const addUserForm = document.getElementById("add-user-form");
  addUserForm.style.display = "none";

  // Borrar los valores de los campos de texto
  document.getElementById("nom").value = "";
  document.getElementById("lastname").value = "";
  document.getElementById("motherLastName").value = "";
  document.getElementById("rfc").value = "";
  document.getElementById("phoneNumber").value = "";
});




const btnMostrarFormulario = document.getElementById("btnMostrarFormulario");
const btnCerrar2 = document.getElementById("btnCerrar2");
const modalOverlay = document.getElementById("modalOverlay");
const addProyectForm = document.getElementById("add-proyect-form");
btnCerrar2.addEventListener("click", () => {
  modalOverlay.style.display = "none";
  addProyectForm.style.display = "none";
});
btnMostrarFormulario.addEventListener("click", () => {
  modalOverlay.style.display = "block";
  addProyectForm.style.display = "block";

});



document.addEventListener("DOMContentLoaded", async () => {
  try {

    // Obtener una referencia a la base de datos de Firebase
    const db = getFirestore(firebaseApp);

    // Obtener la lista de líderes desde la base de datos
    const leadersCollection = collection(db, "lideres");
    const leadersSnapshot = await getDocs(leadersCollection);

    const liderSelect = document.getElementById("lider2");
    liderSelect.innerHTML = ""; // Limpiar opciones existentes

    // Agregar la opción predeterminada
    const defaultOption = document.createElement("option");
    defaultOption.value = "";
    defaultOption.text = "Seleccione líder";
    defaultOption.disabled = true;
    defaultOption.selected = true;
    liderSelect.appendChild(defaultOption);

    // Verificar si hay líderes disponibles
    if (!leadersSnapshot.empty) {
      const leaders = leadersSnapshot.docs.map(doc => {
        const leaderData = doc.data();
        // Agregar el ID del líder al objeto y devolverlo
        return { id: doc.id, ...leaderData };
      });

      // Log para verificar si se obtienen los líderes correctamente
      console.log("Líderes obtenidos:", leaders);

      // Actualizar el contenido del elemento <select> con la lista de líderes
      leaders.forEach(leader => {
        const option = document.createElement("option");
        option.value = leader.id; // Utilizar el ID como valor único
        option.text = leader.nombre;
        liderSelect.appendChild(option);
      });
    } else {
      console.log("No hay líderes disponibles.");
    }
  } catch (error) {
    console.error("Error al obtener la lista de líderes:", error);
  }

  const btnGuardar2 = document.getElementById("btnGuardar2");
  btnGuardar2.addEventListener("click", async () => {
    const nombreProyecto = document.getElementById("name").value;
    const clienteProyecto = document.getElementById("cliente").value;

    // Obtener el valor seleccionado en el campo <select> de líder (que debería ser el ID)
    const liderSelect = document.getElementById("lider2");
    const idLiderSeleccionado = liderSelect.value;

    if (nombreProyecto.trim() === "" || liderSelect.value === "" || clienteProyecto.trim() === "") {
      alert("Por favor, complete todos los campos.");
      return false;
    }

    try {
      // Obtener una referencia a la base de datos de Firebase
      const db = getFirestore(firebaseApp);

      // Guardar los datos del proyecto en la colección "projects"
      await addDoc(collection(db, "projects"), {
        nameProject: nombreProyecto,
        lider: idLiderSeleccionado, // Utilizar el ID del líder seleccionado
        cliente: clienteProyecto,
        status: "Activo"
      });

      // Después de guardar el proyecto, puedes limpiar el formulario o cerrarlo
      const addProyectForm = document.getElementById("add-proyect-form");
      addProyectForm.style.display = "none";
      modalOverlay.style.display = "none";

      // Limpiar los campos del formulario
      document.getElementById("name").value = "";
      document.getElementById("lider2").value = "";
      document.getElementById("cliente").value = "";

      // Ocultar el formulario (cerrar el modal)

      // Actualizar la tabla después de guardar
      await updateTableProyect();
    } catch (error) {
      console.error("Error al guardar el proyecto:", error);
    }
  });


});




const btnBorrarProyectos = document.getElementById("btnBorrarProyectos");
btnBorrarProyectos.addEventListener("click", async () => {
  try {
    // Obtener una referencia a la base de datos de Firebase
    const db = getFirestore(firebaseApp);

    // Obtener la referencia de la colección "projects"
    const projectsCollection = collection(db, "projects");

    // Obtener todos los documentos en la colección "projects"
    const projectsSnapshot = await getDocs(projectsCollection);

    // Borrar cada proyecto
    projectsSnapshot.forEach(async (doc) => {
      await deleteDoc(doc.ref);
    });

    console.log("Todos los proyectos han sido eliminados correctamente.");
  } catch (error) {
    console.error("Error al borrar proyectos:", error);
  }
});


const btnBorrar = document.getElementById("btnBorrar");
btnBorrar.addEventListener("click", async () => {
  try {
    // Obtener una referencia a la base de datos de Firebase
    const db = getFirestore(firebaseApp);

    // Obtener la referencia de la colección "projects"
    const projectsCollection = collection(db, "lideres");

    // Obtener todos los documentos en la colección "projects"
    const projectsSnapshot = await getDocs(projectsCollection);

    // Borrar cada proyecto
    projectsSnapshot.forEach(async (doc) => {
      await deleteDoc(doc.ref);
    });

    console.log("Todos los proyectos han sido eliminados correctamente.");
  } catch (error) {
    console.error("Error al borrar proyectos:", error);
  }
});





document.getElementById("searchP").addEventListener("input", function () {
  const searchTerm = this.value.toLowerCase();
  const proyectosCardsContainer = document.getElementById("proyectos-cards");
  const proyectosCards = proyectosCardsContainer.getElementsByClassName("proyecto-card");

  for (const card of proyectosCards) {
      const projectName = card.querySelector("h3").textContent.toLowerCase();
      const projectStatus = card.querySelector("p").textContent.toLowerCase();
      const projectClient = card.querySelectorAll("p")[1].textContent.toLowerCase();
      const projectLider = card.querySelectorAll("p")[2].textContent.toLowerCase();

      // Mostrar u ocultar la tarjeta según si la búsqueda coincide con algún término en las tarjetas
      const showCard = projectName.includes(searchTerm) || projectStatus.includes(searchTerm) || projectClient.includes(searchTerm) || projectLider.includes(searchTerm);
      card.style.display = showCard ? "block" : "none";
  }
});


btnProyectos.addEventListener("click", async () => {
  console.log("Clic en Proyectos");
  textoPrincipal.textContent = "Proyectos";

  try {
    const db = getFirestore(firebaseApp);
    const projectsCollection = collection(db, "projects");
    const projectsSnapshot = await getDocs(projectsCollection);

    const proyectosCardsContainer = document.getElementById("proyectos-cards");
    const statusFilter = document.getElementById("statusFilter").value;

    // Limpiar el contenedor de tarjetas antes de rellenarlo nuevamente
    proyectosCardsContainer.innerHTML = "";

    projectsSnapshot.forEach(async (projectDoc) => {
      const projectData = projectDoc.data();
      if (statusFilter === "todos" || projectData.status === statusFilter) {
        // Crear una tarjeta de proyecto
        const proyectoCard = document.createElement("div");
        proyectoCard.classList.add("proyecto-card");

        // Añadir contenido a la tarjeta
        const projectName = document.createElement("h3");
        projectName.textContent = projectData.nameProject;

        const projectStatus = document.createElement("p");
        projectStatus.textContent = "Estatus: " + projectData.status || "Sin especificar";

        const projectClient = document.createElement("p");
        projectClient.textContent = "Cliente: " + projectData.cliente;
        const projectLider = document.createElement("p");
        try {
          const liderDoc = await getDoc(doc(db, 'lideres', projectData.lider));
          if (liderDoc.exists()) {
            const liderData = liderDoc.data();
            // Mostrar nombre y apellido del líder en la tarjeta
            projectLider.textContent = `Lider: ${liderData.nombre} ${liderData.apellidoPaterno} ${liderData.apellidoMaterno}`;
          } else {
            projectLider.textContent = "Líder no encontrado";
          }
        } catch (error) {
          console.error("Error al obtener información del líder:", error);
        }
        // Agregar la tarjeta al contenedor de tarjetas
        proyectoCard.appendChild(projectName);
        proyectoCard.appendChild(projectStatus);
        proyectoCard.appendChild(projectClient);
        proyectoCard.appendChild(projectLider);


        // Añadir un evento de clic al div
        proyectoCard.addEventListener("click", async () => {
          try {
            // Construir una consulta para buscar todas las entradas relacionadas con este proyecto
            const entriesCollection = collection(db, "entries");
            const entriesQuery = query(entriesCollection, where("projectId", "==", projectDoc.id));
            const entriesSnapshot = await getDocs(entriesQuery);

            // Limpiar el contenido de la tabla dentro del modal
            document.getElementById("userInfoBody").innerHTML = "";

            // Mostrar información de los usuarios asignados al proyecto en una tabla dentro del modal
            entriesSnapshot.forEach(async (entryDoc) => {
              const entryData = entryDoc.data();
              const userId = entryData.userId;
              const entryDateTime = entryData.entryTime.toDate();
              const entryDate = entryDateTime.toLocaleDateString();
              const entryTime = entryDateTime.toLocaleTimeString();

              // Buscar información del usuario en la colección de usuarios
              const userRef = doc(db, "users", userId);
              const userDoc = await getDoc(userRef);

              if (userDoc.exists()) {
                const userData = userDoc.data();

                // Crear una fila de la tabla con los datos del usuario
                var row = document.createElement("tr");
                row.innerHTML = `
                              <td><img src="${userData.photo}" alt="Foto de perfil" style="width: 50px; height: 50px;"></td>
                              <td>${userData.name} ${userData.lastName} ${userData.motherLastName}</td>
                              <td>${userData.rfc}</td>
                              <td>${userData.phoneNumber}</td>
                              <td>${entryDate}</td>
                              <td>${entryTime}</td>
                              <!-- Agrega más celdas según sea necesario -->
                          `;

                // Agregar la fila a la tabla dentro del modal
                document.getElementById("userInfoBody").appendChild(row);
              } else {
                console.log("Usuario no encontrado");
              }
            });

            // Mostrar el modal
            modal.style.display = "block";
          } catch (error) {
            console.error("Error al buscar usuarios asignados al proyecto:", error);
          }
        });
        proyectosCardsContainer.appendChild(proyectoCard);

      }
    });

    // Resto del código para cambiar la visibilidad de otros contenedores
    reportsListContainer.style.display = "none";
    employeesListContainer.style.display = "none";
    proyectosListContainer.style.display = "block";
    permisosListContainer.style.display = "none";
    btnAgregar.style.display = "none";
    btnMostrarFormulario.style.display = "block";
    colaboradorListContainer.style.display = "none";

  } catch (error) {
    console.error("Error al cargar los proyectos:", error);
  }
});

// Obtener el modal
var modal = document.getElementById("userModal");

// Obtener el span que cierra el modal
var span = document.getElementsByClassName("close")[0];

// Cuando se hace clic en el botón de cierre del modal, cerrarlo
span.onclick = function () {
  modal.style.display = "none";
};

// Cuando el usuario hace clic fuera del modal, cerrarlo
window.onclick = function (event) {
  if (event.target == modal) {
    modal.style.display = "none";
  }
};





async function updateTable() {
  try {
    const db = getFirestore(firebaseApp);
    const usuariosCollection = collection(db, "lideres");
    const usuariosSnapshot = await getDocs(usuariosCollection);

    employeesBody.innerHTML = "";

    usuariosSnapshot.forEach((usuarioDoc) => {
      const usuarioData = usuarioDoc.data();
      const row = document.createElement("tr");
      row.innerHTML = `
              <td>${usuarioData.nombre} ${usuarioData.apellidoPaterno} ${usuarioData.apellidoMaterno}</td>
              <td>${usuarioData.rfc}</td>
              <td>${usuarioData.telefono}</td>
                  <td>${usuarioData.correo}</td>
              `;
      employeesBody.appendChild(row);
    });

    console.log("Tabla actualizada con éxito.");
  } catch (error) {
    console.error("Error al actualizar la tabla:", error);
  }
}



async function updateTableProyect() {
  try {
    const db = getFirestore(firebaseApp);
    const projectsCollection = collection(db, "projects");
    const projectSnapshot = await getDocs(projectsCollection);
    const proyectosCardsContainer = document.getElementById("proyectos-cards");

    // Limpiar el contenedor de tarjetas antes de rellenarlo nuevamente
    proyectosCardsContainer.innerHTML = "";

    projectSnapshot.forEach((projectDoc) => {
      const projectData = projectDoc.data();
      const proyectoCard = document.createElement("div");
      proyectoCard.classList.add("proyecto-card");

      const projectName = document.createElement("h3");
      projectName.textContent = projectData.nameProject;

      const projectStatus = document.createElement("p");
      projectStatus.textContent = "Estatus: " + projectData.status || "Sin especificar";
      const projectClient = document.createElement("p");
      projectClient.textContent = "Cliente: " + projectData.cliente;
      const projectLider = document.createElement("p");
      // Añadir la tarjeta al contenedor de tarjetas
      proyectoCard.appendChild(projectName);
      proyectoCard.appendChild(projectStatus);

      proyectoCard.addEventListener("click", async () => {
        try {
          // Construir una consulta para buscar todas las entradas relacionadas con este proyecto
          const entriesCollection = collection(db, "entries");
          const entriesQuery = query(entriesCollection, where("projectId", "==", projectDoc.id));
          const entriesSnapshot = await getDocs(entriesQuery);

          // Limpiar el contenido de la tabla dentro del modal
          document.getElementById("userInfoBody").innerHTML = "";

          // Mostrar información de los usuarios asignados al proyecto en una tabla dentro del modal
          entriesSnapshot.forEach(async (entryDoc) => {
            const entryData = entryDoc.data();
            const userId = entryData.userId;
            const entryDateTime = entryData.entryTime.toDate();
            const entryDate = entryDateTime.toLocaleDateString();
            const entryTime = entryDateTime.toLocaleTimeString();

            // Buscar información del usuario en la colección de usuarios
            const userRef = doc(db, "users", userId);
            const userDoc = await getDoc(userRef);

            if (userDoc.exists()) {
              const userData = userDoc.data();

              // Crear una fila de la tabla con los datos del usuario
              var row = document.createElement("tr");
              row.innerHTML = `
                            <td><img src="${userData.photo}" alt="Foto de perfil" style="width: 50px; height: 50px;"></td>
                            <td>${userData.name} ${userData.lastName} ${userData.motherLastName}</td>
                            <td>${userData.rfc}</td>
                            <td>${userData.phoneNumber}</td>
                            <td>${entryDate}</td>
                            <td>${entryTime}</td>
                            <!-- Agrega más celdas según sea necesario -->
                        `;

              // Agregar la fila a la tabla dentro del modal
              document.getElementById("userInfoBody").appendChild(row);
            } else {
              console.log("Usuario no encontrado");
            }
          });

          // Mostrar el modal
          modal.style.display = "block";
        } catch (error) {
          console.error("Error al buscar usuarios asignados al proyecto:", error);
        }
      });
      proyectosCardsContainer.appendChild(proyectoCard);
    });

    console.log("Tarjetas de proyectos actualizadas con éxito.");
  } catch (error) {
    console.error("Error al actualizar las tarjetas de proyectos:", error);
  }
}
