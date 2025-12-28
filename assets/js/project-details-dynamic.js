document.addEventListener("DOMContentLoaded", () => {
    const params = new URLSearchParams(window.location.search);
    const projectId = params.get("id") || "ecobikes"; // Proyecto por defecto

    fetch("assets/data/projects.json")
        .then(res => res.json())
        .then(allProjects => {
            const project = allProjects[projectId];

            if (!project) {
                console.error("Proyecto no encontrado:", projectId);
                return;
            }

            loadProject(project);
        })
        .catch(err => console.error("Error cargando JSON:", err));
});

function loadProject(p) {

    /* ===========================
       GALERÍA
    =========================== */
    const gallery = document.getElementById("project-gallery");
    gallery.innerHTML = "";
    p.gallery.forEach(src => {
        gallery.innerHTML += `
            <div class="col-xl-12">
                <div class="project-inner-thumb mb-80 wow img-custom-anim-top">
                    <img class="w-100" src="${src}" alt="Imagen del proyecto">
                </div>
            </div>
        `;
    });

    /* ===========================
       INFO LATERAL
    =========================== */
    const info = document.getElementById("project-info");
    info.innerHTML = `
        <li><span>Categoría:</span> ${p.category}</li>
        <li><span>Tecnologías:</span> ${p.technologies}</li>
        <li><span>Servicios:</span> ${p.services}</li>
        <li><span>Cliente:</span> ${p.client}</li>
        <li><span>Fecha:</span> ${p.date}</li>
        <li><span>Estado:</span> <strong style="color:#0cc067;">${p.status}</strong></li>
        <li><span>Demo:</span> <a href="${p.demoUrl}" target="_blank">Visitar plataforma</a></li>
        <li><span>Ámbito de operación:</span> ${p.scope}</li>
        <li><span>Tipo de servicios:</span> ${p.serviceTypes}</li>
    `;

    /* ===========================
       TITULO Y DESCRIPCIÓN
    =========================== */
    document.getElementById("project-title").textContent = p.title;

    const description = document.getElementById("project-description");
    description.innerHTML = "";
    p.description.forEach(text => {
        description.innerHTML += `<p class="sec-text mt-30">${text}</p>`;
    });

    /* ===========================
       RETO Y SOLUCIÓN
    =========================== */
    document.getElementById("project-challenge").textContent = p.challenge;
    document.getElementById("project-solution").textContent = p.solution;

    /* ===========================
       RESULTADOS
    =========================== */
    const results = document.getElementById("project-results");
    results.innerHTML = "";
    p.results.forEach(r => {
        results.innerHTML += `<p class="sec-text mb-n1">${r}</p>`;
    });

    /* ===========================
       NAVEGACIÓN ENTRE PROYECTOS
    =========================== */
    document.getElementById("nav-prev").href = p.prevProject;
    document.getElementById("nav-next").href = p.nextProject;
}
