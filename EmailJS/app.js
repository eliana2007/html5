const PUBLIC_KEY = "IXL9RgNeLcKjCV1ux";
const SERVICE_ID = "service_5l4xdon";
const TEMPLATE_ID = "template_9jnyyk6";

emailjs.init({ publicKey: PUBLIC_KEY });

const formulario = document.getElementById("formulario");
const btnEnviar = document.getElementById("btn-enviar");
const spinner = document.getElementById("spinner");
const textoBoton = document.getElementById("texto-boton");
const notificacion = document.getElementById("notificacion");

function mostrarNotificacion(html, tipo) {
    notificacion.className = "alert alert-" + tipo + " mt-4 mb-0";
    notificacion.innerHTML = html;
}

function marcarError(id, texto) {
    document.getElementById("error-" + id).textContent = texto;
    document.getElementById(id).classList.toggle("is-invalid", texto !== "");
    document.getElementById(id).classList.toggle("is-valid", texto === "");
}

function validar(datos) {
    let valido = true;
    const regexCorreo = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (datos.nombre.length < 4) {
        marcarError("nombre", "Ingresa tu nombre (mínimo 4 caracteres).");
        valido = false;
    } else {
        marcarError("nombre", "");
    }

    if (!regexCorreo.test(datos.correo)) {
        marcarError("correo", "Ingresa un correo válido (ej.: nombre@undc.edu.pe).");
        valido = false;
    } else {
        marcarError("correo", "");
    }

    if (datos.asunto.length < 3) {
        marcarError("asunto", "Ingresa un asunto (mínimo 3 caracteres).");
        valido = false;
    } else {
        marcarError("asunto", "");
    }

    if (datos.mensaje.length < 10) {
        marcarError("mensaje", "El mensaje debe tener al menos 10 caracteres.");
        valido = false;
    } else {
        marcarError("mensaje", "");
    }

    return valido;
}

function cargando(activo) {
    btnEnviar.disabled = activo;
    spinner.classList.toggle("d-none", !activo);
    textoBoton.innerHTML = activo ? "Enviando..." : '<i class="bi bi-send"></i> Enviar';
}

formulario.addEventListener("submit", async (evento) => {
    evento.preventDefault();

    const datos = {
        nombre: formulario.nombre.value.trim(),
        correo: formulario.correo.value.trim(),
        asunto: formulario.asunto.value.trim(),
        mensaje: formulario.mensaje.value.trim(),
    };

    if (!validar(datos)) {
        mostrarNotificacion('<i class="bi bi-exclamation-triangle-fill"></i> Revisa los campos marcados en rojo.', "danger");
        return;
    }

    const parametros = {
        nombre: datos.nombre,
        correo: datos.correo,
        asunto: datos.asunto,
        mensaje: datos.mensaje,
        fecha: new Date().toLocaleString("es-PE"),
    };

    cargando(true);
    mostrarNotificacion("Enviando mensaje, espera un momento...", "info");

    try {
        await emailjs.send(SERVICE_ID, TEMPLATE_ID, parametros);
        mostrarNotificacion('<i class="bi bi-check-circle-fill"></i> ¡Formulario enviado con éxito! Revisa tu bandeja de entrada.', "success");
        formulario.reset();
        formulario.querySelectorAll(".is-valid").forEach((campo) => campo.classList.remove("is-valid"));
    } catch (error) {
        console.error("Error de EmailJS:", error);
        const detalle = error && error.text ? error.text : error;
        mostrarNotificacion('<i class="bi bi-x-circle-fill"></i> No se pudo enviar el formulario: ' + detalle, "danger");
    } finally {
        cargando(false);
    }
});
