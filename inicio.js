import { initializeApp } from "https://www.gstatic.com/firebasejs/9.0.2/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/9.0.2/firebase-auth.js";
import { getFirestore, collection, getDocs, updateDoc, doc, addDoc } from "https://www.gstatic.com/firebasejs/9.0.2/firebase-firestore.js";
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


searchReportesInput.addEventListener("input", () => {
  const searchTerm = searchReportesInput.value.toLowerCase();
  const reportesRows = reportsBody.getElementsByTagName("tr");

  searchReportesInput.style.display = "block"; // Mostrar la barra de búsqueda de reportes
  searchEmpleadosInput.style.display = "none"; // Ocultar la barra de búsqueda de empleados
  reportsListContainer.style.display = "block"; // Mostrar la tabla de reportes
  employeesListContainer.style.display = "none"; // Ocultar la tabla de empleados
  proyectosListContainer.style.display = "none";
  permisosListContainer.style.display="none";

  for (const row of reportesRows) {
    const nombreCell = row.cells[0].textContent.toLowerCase();
    const fechaCell = row.cells[1].textContent.toLowerCase();
    const diaCell = row.cells[2].textContent.toLowerCase();
    const proyectoCell = row.cells[7].textContent.toLocaleLowerCase();
    row.style.display = nombreCell.includes(searchTerm) || fechaCell.includes(searchTerm) || diaCell.includes(searchTerm) || proyectoCell.includes(searchTerm) ? "table-row" : "none";
  }
});

// Evento para el botón de Reportes
btnReportes.addEventListener("click", async () => {
  console.log("Clic en Reportes");
  textoPrincipal.textContent = "Reportes";
  try {
    // Obtener la referencia a la colección "horario" en Firebase
    const db = getFirestore(firebaseApp);
    const horarioCollection = collection(db, "horario");

    // Obtener una lista de documentos en la colección
    const horarioSnapshot = await getDocs(horarioCollection);

    // Limpiar el array antes de llenarlo de nuevo
    horarioItems = [];

    // Iterar a través de los documentos de horario
    for (const doc of horarioSnapshot.docs) {
      const horarioData = doc.data();
      const nombre = horarioData.nombre;
      const fecha = horarioData.fecha;
      const dia = horarioData.dia;
      const tipo = doc.id.includes("_entrada") ? "entrada" : "salida"; // Determinar si es entrada o salida
      const hora = horarioData[tipo] || "Sin " + tipo;
      const proyecto = horarioData.proyecto;

      // Buscar si ya existe un objeto con el mismo nombre y fecha en horarioItems
      let existingItem = horarioItems.find(item => item.nombre === nombre && item.fecha === fecha);

      if (!existingItem) {
        // Si no existe, crear un nuevo objeto
        existingItem = {
          nombre: nombre,
          fecha: fecha,
          dia: dia,
          entrada: "Sin entrada",
          salida: "Sin salida",
          hrsOrd: 0, // Se calculará más adelante
          hrsExtra: 0, // Se calculará más adelante
          proyecto: proyecto
        };
        existingItem[tipo] = hora; // Asignar la hora correspondiente
        horarioItems.push(existingItem);
      } else {
        // Si ya existe, actualizar la entrada o salida
        existingItem[tipo] = hora;
      }
    }

    // Calcular las horas ordinarias y las horas extras y actualizar la tabla
    horarioItems.forEach(item => {
      const horaEntrada = new Date(`1970-01-01T${item.entrada}`);
      const horaSalida = new Date(`1970-01-01T${item.salida}`);
      const tiempoTrabajado = horaSalida - horaEntrada;
      item.hrsOrd = tiempoTrabajado >= 9 * 3600000 ? 9 : tiempoTrabajado / 3600000;
      item.hrsExtra = Math.max(tiempoTrabajado / 3600000 - 9, 0);
    });

    // Mostrar los datos en la tabla de Reportes
    const reportsListContainer = document.querySelector(".reports-list");
    const reportsBody = document.getElementById("reports-body");

    reportsListContainer.style.display = "block";
    reportsBody.innerHTML = "";

    horarioItems.forEach((horarioItem) => {
      const row = document.createElement("tr");
      row.innerHTML = `
        <td>${horarioItem.nombre}</td>
        <td>${horarioItem.fecha}</td>
        <td>${horarioItem.dia}</td>
        <td>${horarioItem.entrada}</td>
        <td>${horarioItem.salida}</td>
        <td>${horarioItem.hrsOrd.toFixed(2)}</td>
        <td>${horarioItem.hrsExtra.toFixed(2)}</td>
        <td>${horarioItem.proyecto}</td>
      `;
      reportsBody.appendChild(row);

      reportsListContainer.style.display = "block";
      employeesListContainer.style.display = "none";
      btnAgregar.style.display = "none";
      permisosListContainer.style.display = "none";
    });
  } catch (error) {
    console.error("Error al cargar los reportes:", error);
  }
});

searchEmpleadosInput.addEventListener("input", () => {
  const searchTerm = searchEmpleadosInput.value.toLowerCase();
  const empleadosRows = employeesBody.getElementsByTagName("tr");


  searchEmpleadosInput.style.display = "block"; // Mostrar la barra de búsqueda de empleados
  searchReportesInput.style.display = "none"; // Ocultar la barra de búsqueda de reportes
  employeesListContainer.style.display = "block"; // Mostrar la tabla de empleados
  reportsListContainer.style.display = "none"; // Ocultar la tabla de reportes
  permisosListContainer.style.display = "none";
  proyectosListContainer.style.display="none";

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
      apellidoMaterno:motherLastname,
      rfc:rfc,
      telefono:phoneNumber,
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

//Boton Proyectos
btnProyectos.addEventListener("click", async () => {
  console.log("Clic en Proyectos");
  textoPrincipal.textContent = "Proyectos";

  try {
    const db = getFirestore(firebaseApp);
    const proyectsCollection = collection(db, "projects");
    const proyectsSnapshot = await getDocs(proyectsCollection);

    const proyectosBody = document.getElementById("proyectos-body"); 

    // Limpiar la tabla de permisos antes de rellenarla nuevamente
    proyectosBody.innerHTML = "";

    proyectsSnapshot.forEach((proyectDoc, index) => {
      const projectData = proyectDoc.data();
      const row = document.createElement("tr");

      if (index === 0) {
        row.innerHTML = `
          <td>${projectData.lider}</td>
          <td>${projectData.nameProject}</td>
        `;
      } else {
        row.innerHTML = `
          <td>${projectData.lider}</td>
          <td>${projectData.nameProject}</td>
        `;
      }

      proyectosBody.appendChild(row);
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
