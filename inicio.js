import { initializeApp } from "https://www.gstatic.com/firebasejs/9.0.2/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/9.0.2/firebase-auth.js";
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
const btnPermisos = document.getElementById("btnPermisos");
const btnProyectos = document.getElementById("btnProyectos");
const proyectosListContainer = document.querySelector(".proyectos-list");
const permisosListContainer = document.querySelector(".permisos-list");
const reportsListContainer = document.querySelector(".reports-list");
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


searchReportesInput.addEventListener("input", () => {
  const searchTerm = searchReportesInput.value.toLowerCase();
  const reportsRows = reportsBody.getElementsByTagName("tr");

  searchEmpleadosInput.style.display = "none"; // Ocultar la barra de búsqueda de empleados
  searchReportesInput.style.display = "block"; // Mostrar la barra de búsqueda de reportes
  employeesListContainer.style.display = "none"; // Ocultar la tabla de empleados
  reportsListContainer.style.display = "block"; // Mostrar la tabla de reportes
  permisosListContainer.style.display = "none";
  proyectosListContainer.style.display = "none";

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
          <td><button class="btn btn-primary" data-userid="${entryData.userId}">Reporte</button></td>
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
    
    reportsListContainer.appendChild(exportButton);
    
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





searchEmpleadosInput.addEventListener("input", () => {
  const searchTerm = searchEmpleadosInput.value.toLowerCase();
  const empleadosRows = reportsBody.getElementsByTagName("tr");


  searchEmpleadosInput.style.display = "block"; // Mostrar la barra de búsqueda de empleados
  searchReportesInput.style.display = "none"; // Ocultar la barra de búsqueda de reportes
  employeesListContainer.style.display = "block"; // Mostrar la tabla de empleados
  reportsListContainer.style.display = "block"; // Ocultar la tabla de reportes
  permisosListContainer.style.display = "none";
  proyectosListContainer.style.display = "none";

  for (const row of empleadosRows) {
    const nombreCell = row.cells[1].textContent.toLowerCase();
    const areaCell = row.cells[2].textContent.toLowerCase();
    const correoCell = row.cells[3].textContent.toLowerCase();
    row.style.display = nombreCell.includes(searchTerm) || areaCell.includes(searchTerm) || correoCell.includes(searchTerm) ? "table-row" : "none";
  }
});

//Boton Empleados
btnLider.addEventListener("click", async () => {
  console.log("Clic en Empleados");
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
      <td><img src="${usuarioData.imageUrl}" alt="Imagen de perfil" style="max-width: 50px;"></td>
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







// Agregar empleado
btnAgregar.addEventListener("click", () => {
  const addUserForm = document.getElementById("add-user-form");
  addUserForm.style.display = "block";
});
// ...

const btnGuardar = document.getElementById("btnGuardar");
btnGuardar.addEventListener("click", async () => {
  const name = document.getElementById("name").value;
  const lastName = document.getElementById("lastname").value;
  const motherLastname = document.getElementById("motherLastName").value;
  const rfc = document.getElementById("rfc").value;
  const phoneNumber = document.getElementById("phoneNumber").value;
  const imagenFile = document.getElementById("photo").files[0]; // Obtener archivo de imagen
  const email = document.getElementById("correo").value
  const password = document("pass").value



  try {
    // Crear un nuevo usuario en Firebase Authentication
    await firebase.auth().createUserWithEmailAndPassword(email, password);

    const db = getFirestore(firebaseApp);
    const usuariosCollection = collection(db, "lideres");

    // Subir la imagen a Firebase Storage
    const storage = getStorage(firebaseApp);
    const storageRef = ref(storage, `images/${imagenFile.name}`);
    await uploadBytes(storageRef, imagenFile);

    // Obtener la URL de descarga de la imagen subida
    const imageUrl = await getDownloadURL(storageRef);

    // Agregar el nuevo usuario con la URL de la imagen a Firestore
    await addDoc(usuariosCollection, {
      nombre: name,
      apellidoPaterno: lastName,
      apellidoMaterno: motherLastname,
      rfc: rfc,
      telefono: phoneNumber,
      photo: imageUrl
    });

    console.log("Nuevo usuario con imagen agregado con éxito.");

    // Cerrar formulario después de guardar y limpiar los campos
    const addUserForm = document.getElementById("add-user-form");
    addUserForm.style.display = "none";
    document.getElementById("name").value = "";
    document.getElementById("lastname").value = "";
    document.getElementById("motherLastName").value = "";
    document.getElementById("rfc").value = "";
    document.getElementById("phoneNumber").value = "";
    document.getElementById("photo").value = "";
    document.getElementById("correo");
    await updateTable();
  } catch (error) {
    console.error("Error al agregar nuevo usuario:", error);
  }
});

const btnCerrar = document.getElementById("btnCerrar");
btnCerrar.addEventListener("click", () => {
  const addUserForm = document.getElementById("add-user-form");
  addUserForm.style.display = "none";

  // Borrar los valores de los campos de texto
  document.getElementById("nombre").value = "";
  document.getElementById("area").value = "";
  document.getElementById("correo").value = "";
});

btnProyectos.addEventListener("click", async () => {
  console.log("Clic en Proyectos");
  textoPrincipal.textContent = "Proyectos";

  try {
    const db = getFirestore(firebaseApp);
    const projectsCollection = collection(db, "projects");
    const projectsSnapshot = await getDocs(projectsCollection);

    const proyectosBody = document.getElementById("proyectos-body");

    // Limpiar el contenedor de proyectos antes de rellenarlo nuevamente
    proyectosBody.innerHTML = "";
    const imagePromises = [];

    projectsSnapshot.forEach(async (projectDoc) => {
      const projectData = projectDoc.data();
      const card = document.createElement("div");
      card.classList.add("card", "square-card");

      const cardBody = document.createElement("div");
      cardBody.classList.add("card-body");

      const folderImage = document.createElement("img");
      folderImage.src = "imagenes/motores.jpg"; // Cambia esto por la ruta real de la imagen de tu carpeta
      folderImage.classList.add("folder-image");
      folderImage.style.width = "100%";
      imagePromises.push(new Promise(resolve => {
        folderImage.onload = resolve;
        folderImage.onerror = resolve; // También resolvemos si hay un error de carga
      }));

      const title = document.createElement("h5");
      title.classList.add("card-title");
      title.textContent = projectData.nameProject;

      const text = document.createElement("p");
      text.classList.add("card-text");
      text.textContent = "Lider: " + projectData.lider;
      // Añadir un evento de clic al card
      card.addEventListener("click", async () => {
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
              console.log("Usuario asignado:", userData);

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
      cardBody.appendChild(folderImage);

      cardBody.appendChild(title);
      cardBody.appendChild(text);
      
      card.appendChild(cardBody);

      // Agregar la card al contenedor de cards
      proyectosBody.appendChild(card);
    });

    reportsListContainer.style.display = "none";
    employeesListContainer.style.display = "none";
    proyectosListContainer.style.display = "block";
    permisosListContainer.style.display = "none";

    btnAgregar.style.display = "none";

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
              <td><img src="${usuarioData.photo}" alt="Imagen de perfil" style="max-width: 50px;"></td>
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
