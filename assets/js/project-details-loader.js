document.addEventListener("DOMContentLoaded", () => {

    const params = new URLSearchParams(window.location.search);
    let id = params.get("id") || "ecobikes";

    // ====== SISTEMA DE ALIAS ======
const aliases = {

    /* -------------------------------------------
       ALIAS PARA TÉCNICOS / REPARACIONES
    ------------------------------------------- */
    "tecnicos": "tecnicos",
    "técnicos": "tecnicos",
    "tecnico": "tecnicos",
    "técnico": "tecnicos",

    "tecnicos_y_reparaciones": "tecnicos",
    "tecnicos-reparaciones": "tecnicos",
    "tecnicos_reparaciones": "tecnicos",
    "tecnicosreparaciones": "tecnicos",

    "tecnico_y_reparacion": "tecnicos",
    "tecnico-reparacion": "tecnicos",
    "tecnico_reparacion": "tecnicos",
    "tecnicoreparacion": "tecnicos",

    "reparaciones": "tecnicos",
    "reparacion": "tecnicos",
    "repair": "tecnicos",
    "service-tech": "tecnicos",
    "servicio-tecnico": "tecnicos",
    "servicio_tecnico": "tecnicos",
    "serviciotecnico": "tecnicos",

    "tureparador": "tecnicos",
    "tu_reparador": "tecnicos",
    "tu-reparador": "tecnicos",
    "reparador": "tecnicos",
    "turep": "tecnicos",
    "fixer": "tecnicos",

    /* -------------------------------------------
       ALIAS PARA ECOBIKES
    ------------------------------------------- */
    "ecobikes": "ecobikes",
    "eco-bikes": "ecobikes",
    "eco_bikes": "ecobikes",
    "eco": "ecobikes",
    "ecobike": "ecobikes",
    "ecobiking": "ecobikes",
    "eco_bike": "ecobikes",
    "ecobikechile": "ecobikes",
    "ecobikes_cl": "ecobikes",
    "ecobikeschile": "ecobikes",

    "ecoenvios": "ecobikes",
    "envios-eco": "ecobikes",
    "envios-ecobikes": "ecobikes",

    /* -------------------------------------------
       ALIAS PARA VIA-Z
    ------------------------------------------- */
    "viaz": "viaz",
    "via-z": "viaz",
    "via_z": "viaz",
    "viaz_app": "viaz",
    "via-app": "viaz",
    "via": "viaz",
    "transportes": "viaz",
    "traslados": "viaz",
    "viajes": "viaz",
    "transporte": "viaz",
    "movilidad": "viaz",

    /* -------------------------------------------
       ALIAS PARA FITOSALUD
    ------------------------------------------- */
    "fitosalud": "fitosalud",
    "fito-salud": "fitosalud",
    "fito_salud": "fitosalud",
    "fito": "fitosalud",
    "salud": "fitosalud",
    "telemedicina": "fitosalud",
    "citas_medicas": "fitosalud",
    "medicos": "fitosalud",

    /* -------------------------------------------
       ALIAS PARA GESGAN
    ------------------------------------------- */
    "gesgan": "gesgan",
    "ges-gan": "gesgan",
    "ges_gan": "gesgan",
    "ganaderia": "gesgan",
    "ganados": "gesgan",
    "granja": "gesgan",
    "agro": "gesgan",
    "erp_ganadero": "gesgan",

    /* -------------------------------------------
       ALIAS PARA APLICOAT
    ------------------------------------------- */
    "aplicoat": "aplicoat",
    "apli-coat": "aplicoat",
    "apli_coat": "aplicoat",
    "coat": "aplicoat",
    "pinturas": "aplicoat",
    "anticorrosion": "aplicoat",
    "recubrimientos": "aplicoat",
    "industrial": "aplicoat",

    /* -------------------------------------------
       ALIAS PARA PROYECTOS FUTUROS
       (puedes llenarlos luego)
    ------------------------------------------- */
    "donreparador": "tecnicos",
    "servicios": "tecnicos",
    "delivery": "ecobikes",
    "envios": "ecobikes",
    "bike": "ecobikes",

};


    // Si el ID tiene un alias, conviértelo al archivo base
    if (aliases[id]) {
        id = aliases[id];
    }

    // Archivo final a cargar
    const file = `projects/${id}.html`;

    // ====== CARGA DINÁMICA ======
    fetch(file)
        .then(res => {
            if (!res.ok) throw new Error("Archivo no encontrado: " + file);
            return res.text();
        })
        .then(html => {
            document.querySelector("#project-content").innerHTML = html;
        })
        .catch(err => {
            document.querySelector("#project-content").innerHTML = `
                <div class="container py-5">
                    <h2>Error al cargar el proyecto</h2>
                    <p>No se pudo cargar: <strong>${id}</strong></p>
                </div>`;
            console.error(err);
        });

});
