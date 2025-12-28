/**
 * Portfolio Dynamic Loader
 * Carga proyectos dinámicamente desde projects.json y maneja filtros
 */

(function($) {
    'use strict';

    // Configuración
    const config = {
        projectsPerPage: 6,
        animationDelay: 100
    };

    // Estado global
    let allProjects = [];
    let filteredProjects = [];
    let currentPage = 1;
    let currentFilter = 'all';

    // Elementos del DOM
    let $projectsContainer;
    let $loadingSpinner;
    let $noResults;
    let $loadMoreContainer;
    let $loadMoreBtn;

    /**
     * Inicialización
     */
    function init() {
        cacheElements();
        bindEvents();
        loadProjects();
    }

    /**
     * Cache de elementos del DOM
     */
    function cacheElements() {
        $projectsContainer = $('#projects-container');
        $loadingSpinner = $('#loading-spinner');
        $noResults = $('#no-results');
        $loadMoreContainer = $('#load-more-container');
        $loadMoreBtn = $('#load-more-btn');
    }

    /**
     * Binding de eventos
     */
    function bindEvents() {
        // Filtros de botones
        $('.filter-btn').on('click', handleFilterClick);
        
        // Load more button
        $loadMoreBtn.on('click', loadMoreProjects);

        // Manejar parámetros URL
        $(window).on('load', handleUrlParams);
    }

    /**
     * Cargar proyectos desde JSON
     */
    function loadProjects() {
        showLoading(true);
        
        $.ajax({
            url: 'assets/data/projects.json',
            method: 'GET',
            dataType: 'json',
            success: function(data) {
                allProjects = data;
                handleUrlParams();
                showLoading(false);
            },
            error: function(xhr, status, error) {
                console.error('Error loading projects:', error);
                showError('Error al cargar los proyectos. Por favor, intenta de nuevo.');
                showLoading(false);
            }
        });
    }

    /**
     * Manejar parámetros de URL
     */
    function handleUrlParams() {
        const urlParams = new URLSearchParams(window.location.search);
        const projectType = urlParams.get('project_type');
        
        if (projectType) {
            setFilter(projectType);
            // Actualizar botón activo
            $('.filter-btn').removeClass('active');
            $(`.filter-btn[data-filter="${projectType}"]`).addClass('active');
        } else {
            setFilter('all');
        }
    }

    /**
     * Manejar clic en filtros
     */
    function handleFilterClick(e) {
        e.preventDefault();
        const filter = $(e.currentTarget).data('filter');
        setFilter(filter);
        
        // Actualizar estado visual del botón
        $('.filter-btn').removeClass('active');
        $(e.currentTarget).addClass('active');
    }

    /**
     * Establecer filtro actual
     */
    function setFilter(filter) {
        currentFilter = filter;
        currentPage = 1;
        
        if (filter === 'all') {
            filteredProjects = [...allProjects];
        } else {
            filteredProjects = allProjects.filter(project => project.type === filter);
        }
        
        renderProjects();
    }

    /**
     * Renderizar proyectos
     */
    function renderProjects() {
        $projectsContainer.empty();
        
        if (filteredProjects.length === 0) {
            showNoResults(true);
            $loadMoreContainer.hide();
            return;
        }
        
        showNoResults(false);
        
        const startIndex = 0;
        const endIndex = Math.min(currentPage * config.projectsPerPage, filteredProjects.length);
        const projectsToShow = filteredProjects.slice(startIndex, endIndex);
        
        projectsToShow.forEach((project, index) => {
            setTimeout(() => {
                $projectsContainer.append(createProjectHTML(project));
                
                // Añadir animación si está disponible
                if (typeof initIsotope === 'function') {
                    initIsotope();
                }
            }, index * config.animationDelay);
        });
        
        // Mostrar/ocultar botón "cargar más"
        if (endIndex < filteredProjects.length) {
            $loadMoreContainer.show();
        } else {
            $loadMoreContainer.hide();
        }
        
        // Inicializar efectos de hover de imagen
        if (typeof initImgRevealHover === 'function') {
            initImgRevealHover();
        }
    }

    /**
     * Crear HTML para un proyecto
     */
    function createProjectHTML(project) {
        const colClass = getColumnClass(project.id);
        const marginClass = getMarginClass(project.id);
        
        const categoriesHTML = project.categories.map(category => 
            `<li><a href="blog.html">${category}</a></li>`
        ).join('');
        
        const softwareHTML = project.software.map(tech => 
            `<span class="badge bg-primary me-1">${tech}</span>`
        ).join('');
        
        return `
            <div class="col-lg-${colClass} filter-item ${marginClass}">
                <div class="portfolio-wrap ${marginClass}">
                    <div class="portfolio-thumb">
                        <a href="project-details.html?id=${project.id}">
                            <img src="${project.image}" alt="${project.title}">
                        </a>
                        <div class="portfolio-overlay">
                            <div class="portfolio-overlay-content">
                                <div class="portfolio-meta">
                                    ${categoriesHTML}
                                </div>
                                <div class="portfolio-tech">
                                    ${softwareHTML}
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="portfolio-details">
                        <ul class="portfolio-meta">
                            ${categoriesHTML}
                        </ul>
                        <h3 class="portfolio-title">
                            <a href="project-details.html?id=${project.id}">${project.title}</a>
                        </h3>
                        <p class="portfolio-subtitle">${project.subtitle}</p>
                        <p class="portfolio-description">${project.description}</p>
                        <div class="portfolio-meta-bottom">
                            <span class="portfolio-date">
                                <i class="fas fa-calendar"></i>
                                ${formatDate(project.date)}
                            </span>
                            <span class="portfolio-client">
                                <i class="fas fa-user"></i>
                                ${project.client}
                            </span>
                        </div>
                        <a href="project-details.html?id=${project.id}" class="link-btn">
                            <span class="link-effect">
                                <span class="effect-1">VER PROYECTO</span>
                                <span class="effect-1">VER PROYECTO</span>
                            </span>
                            <img src="assets/img/icon/arrow-left-top.svg" alt="icon">
                        </a>
                    </div>
                </div>
            </div>
        `;
    }

    /**
     * Obtener clase de columna según el ID del proyecto
     */
    function getColumnClass(projectId) {
        // Patrón alternado para diseño masonry
        if (projectId % 3 === 1) return 6; // 50% width
        if (projectId % 3 === 2) return 6; // 50% width
        return 7; // 58% width for third item
    }

    /**
     * Obtener clase de margen según el ID del proyecto
     */
    function getMarginClass(projectId) {
        if (projectId % 3 === 1) return 'mt-140'; // Espaciado superior
        if (projectId % 3 === 2) return 'mt-lg-0'; // Sin margen superior
        return 'mt-140'; // Espaciado superior
    }

    /**
     * Cargar más proyectos (paginación)
     */
    function loadMoreProjects() {
        currentPage++;
        renderProjects();
    }

    /**
     * Mostrar/ocultar loading spinner
     */
    function showLoading(show) {
        if (show) {
            $loadingSpinner.show();
            $projectsContainer.hide();
            $noResults.hide();
            $loadMoreContainer.hide();
        } else {
            $loadingSpinner.hide();
            $projectsContainer.show();
        }
    }

    /**
     * Mostrar/ocultar mensaje "no results"
     */
    function showNoResults(show) {
        if (show) {
            $noResults.show();
            $projectsContainer.hide();
            $loadMoreContainer.hide();
        } else {
            $noResults.hide();
            $projectsContainer.show();
        }
    }

    /**
     * Mostrar mensaje de error
     */
    function showError(message) {
        $projectsContainer.html(`
            <div class="col-12 text-center">
                <div class="alert alert-danger" role="alert">
                    <h4 class="alert-heading">¡Oops!</h4>
                    <p>${message}</p>
                    <button class="btn btn-danger" onclick="location.reload()">
                        <i class="fas fa-refresh"></i> Reintentar
                    </button>
                </div>
            </div>
        `);
    }

    /**
     * Formatear fecha
     */
    function formatDate(dateString) {
        const options = { 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
        };
        return new Date(dateString).toLocaleDateString('es-ES', options);
    }

    /**
     * Filtrar proyectos por texto de búsqueda
     */
    function filterProjects(searchText) {
        if (!searchText.trim()) {
            setFilter(currentFilter);
            return;
        }
        
        const searchLower = searchText.toLowerCase();
        const baseFiltered = currentFilter === 'all' ? 
            allProjects : 
            allProjects.filter(p => p.type === currentFilter);
            
        filteredProjects = baseFiltered.filter(project => 
            project.title.toLowerCase().includes(searchLower) ||
            project.description.toLowerCase().includes(searchLower) ||
            project.categories.some(cat => cat.toLowerCase().includes(searchLower)) ||
            project.software.some(tech => tech.toLowerCase().includes(searchLower))
        );
        
        currentPage = 1;
        renderProjects();
    }

    /**
     * Limpiar filtros
     */
    function clearFilters() {
        setFilter('all');
        $('.filter-btn').removeClass('active');
        $('.filter-btn[data-filter="all"]').addClass('active');
        $projectsContainer.empty();
        renderProjects();
    }

    // Exponer funciones globales
    window.portfolioDynamic = {
        filterProjects,
        clearFilters,
        setFilter
    };

    // Inicializar cuando el DOM esté listo
    $(document).ready(function() {
        init();
    });

})(jQuery);