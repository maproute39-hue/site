/**
 * Portfolio Dynamic Loader - Versión Corregida + Masonry FIX + Isotope
 */

(function ($) {
    'use strict';

    // Configuración
    const config = {
        projectsPerPage: 6,
        animationDelay: 100
    };

    // Estado
    let allProjects = [];
    let filteredProjects = [];
    let currentPage = 1;
    let currentFilter = 'all';
    let isotopeInstance = null;

    // DOM
    let $projectsContainer;
    let $loadingSpinner;
    let $noResults;
    let $loadMoreContainer;
    let $loadMoreBtn;

    /**
     * Inicialización
     */
    function init() {
        console.log('Iniciando Portfolio Dynamic Loader...');
        cacheElements();
        bindEvents();
        initIsotope();  // 🔥 Masonry inicializado AQUÍ
        loadProjects();
    }

    /**
     * Cache de elementos
     */
    function cacheElements() {
        $projectsContainer = $('#projects-container');
        $loadingSpinner = $('#loading-spinner');
        $noResults = $('#no-results');
        $loadMoreContainer = $('#load-more-container');
        $loadMoreBtn = $('#load-more-btn');
    }

    /**
     * Eventos
     */
    function bindEvents() {

        $(document).on('click', '.filter-btn', function (e) {
            e.preventDefault();
            const filter = $(this).data('filter');
            console.log("Filtro clickeado:", filter);
            applyFilter(filter);
        });

        $loadMoreBtn.on('click', function (e) {
            e.preventDefault();
            loadMore();
        });

        $(document).on('click', '.project-item', function () {
            const id = $(this).data('project-id');
            if (id) window.location.href = `project-details.html?id=${id}`;
        });
    }

    /**
     * Cargar proyectos con fallback
     */
    function loadProjects() {
        showLoading(true);

        $.ajax({
            url: 'assets/data/projects.json',
            method: 'GET',
            dataType: 'json',
            success: function (data) {
                allProjects = data;
                console.log("Proyectos cargados:", data.length);
                handleUrlParams();
                showLoading(false);
            },
            error: function () {
                console.error("Error inicial — usando fallback...");
                loadProjectsFallback();
            }
        });
    }

    function loadProjectsFallback() {
        const paths = [
            './assets/data/projects.json',
            '../assets/data/projects.json',
            '/assets/data/projects.json'
        ];

        let index = 0;

        function tryNext() {
            if (index >= paths.length) {
                showError("No se pudo cargar projects.json desde ninguna ruta.");
                showLoading(false);
                return;
            }

            const path = paths[index];
            console.log("Intentando:", path);

            $.ajax({
                url: path,
                method: 'GET',
                dataType: 'json',
                success: function (data) {
                    console.log("Proyectos cargados desde fallback:", path);
                    allProjects = data;
                    handleUrlParams();
                    showLoading(false);
                },
                error: function () {
                    index++;
                    tryNext();
                }
            });
        }

        tryNext();
    }

    /**
     * Manejo de URL
     */
    function handleUrlParams() {
        const url = new URLSearchParams(window.location.search);
        const category = url.get('category');

        if (category) {
            applyFilter(category);
        } else {
            filteredProjects = [...allProjects];
            displayProjects();
        }
    }

    /**
     * Aplicar filtro
     */
    function applyFilter(filter) {
        currentFilter = filter;
        currentPage = 1;

        $('.filter-btn').removeClass('active');
        $(`.filter-btn[data-filter="${filter}"]`).addClass('active');

        filteredProjects = filter === 'all'
            ? [...allProjects]
            : allProjects.filter(p => p.type === filter);

        displayProjects();
    }

    /**
     * Renderizar proyectos
     */
    function displayProjects() {
        console.log("Mostrando proyectos:", filteredProjects.length);

        if (filteredProjects.length === 0) {
            showNoResults();
            return;
        }

        $noResults.hide();
        $projectsContainer.empty();

        const end = Math.min(currentPage * config.projectsPerPage, filteredProjects.length);
        const projectsToShow = filteredProjects.slice(0, end);

        projectsToShow.forEach((project, i) => {
            const $item = createProjectHtml(project).css("opacity", 0);

            setTimeout(() => {
                $projectsContainer.append($item);
                $item.animate({ opacity: 1 }, 200);

                refreshIsotope(); // 🔥 Masonry recalcula aquí

            }, i * config.animationDelay);
        });

        // Mostrar/hide LOAD MORE
        end < filteredProjects.length ? $loadMoreContainer.show() : $loadMoreContainer.hide();
    }

    /**
     * HTML del proyecto
     */
    function createProjectHtml(project) {
        const categories = project.categories.map(cat =>
            `<span class="category-tag">${cat}</span>`
        ).join('');

        return $(`
            <div class="col-lg-6 filter-item project-item" data-project-id="${project.id}">
                <div class="project-image">
                    <img src="${project.image}" alt="${project.title}" loading="lazy">
                    <div class="project-overlay">
                        <h3>${project.title}</h3>
                        <p>${project.subtitle}</p>
                        <div class="categories">${categories}</div>
                    </div>
                </div>
            </div>
        `);
    }

    /**
     * Load more
     */
    function loadMore() {
        currentPage++;
        displayProjects();
    }

    /**
     * ===============================
     *    ISOTOPE + MASONRY FIX
     * ===============================
     */

    function initIsotope() {
        isotopeInstance = $('.masonary-active').isotope({
            itemSelector: '.filter-item',
            percentPosition: true,
            masonry: { columnWidth: '.filter-item' }
        });
    }

    function refreshIsotope() {
        $('.masonary-active').imagesLoaded(function () {
            isotopeInstance.isotope('reloadItems').isotope('layout');
        });
    }

    /**
     * Utilidades
     */
    function showLoading(show) {
        show ? $loadingSpinner.show() : $loadingSpinner.hide();
    }

    function showNoResults() {
        $projectsContainer.empty();
        $noResults.show();
        $loadMoreContainer.hide();
    }

    function showError(msg) {
        $projectsContainer.html(`
            <div style="text-align:center;padding:40px;color:red;">
                <h3>Error al cargar proyectos</h3>
                <p>${msg}</p>
            </div>
        `);
    }

    /**
     * Ready
     */
    $(document).ready(() => init());

})(jQuery);
