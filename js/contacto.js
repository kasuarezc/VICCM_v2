document.addEventListener("DOMContentLoaded", () => {
  const formControls = document.querySelectorAll(".form-control");
  const form = document.getElementById("contactForm");
  const btnEnviar = document.getElementById("btnEnviar");
  const mensajeEstado = document.getElementById("mensajeEstado");

  formControls.forEach((control) => {
    control.addEventListener("focus", function () {
      this.closest(".form-group")?.classList.add("focused");
    });

    control.addEventListener("blur", function () {
      this.closest(".form-group")?.classList.remove("focused");
    });
  });

  if (!form || !btnEnviar || !mensajeEstado) return;

  form.addEventListener("submit", async function (e) {
    e.preventDefault();

    btnEnviar.disabled = true;
    btnEnviar.textContent = "Enviando...";

    const formData = new FormData(form);

    try {
      const response = await fetch(form.action, {
        method: "POST",
        body: formData,
        headers: {
          "Accept": "application/json"
        }
      });

      if (response.ok) {
        mensajeEstado.innerHTML = `
          <div class="mensaje-exito">
            <strong>¡Mensaje enviado con éxito!</strong><br>
            Te responderemos a la mayor brevedad posible.
          </div>
        `;
        form.reset();
      } else {
        throw new Error("Error al enviar");
      }
    } catch (error) {
      mensajeEstado.innerHTML = `
        <div class="mensaje-error">
          <strong>Error al enviar el mensaje.</strong><br>
          Por favor, intenta nuevamente o contacta directamente por correo.
        </div>
      `;
    }

    btnEnviar.disabled = false;
    btnEnviar.textContent = "Enviar Mensaje";

    mensajeEstado.scrollIntoView({ behavior: "smooth", block: "start" });
  });
});