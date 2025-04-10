document.addEventListener('DOMContentLoaded', function() {
    // Handle preloader
    const preloader = document.querySelector('.preloader');
    
    // Zorg ervoor dat de preloader minimaal 5 seconden zichtbaar blijft
    const minPreloaderTime = 5000; // 5 seconden in milliseconden
    const startTime = new Date().getTime();
    
    // Hide preloader after page is fully loaded AND minimum time has passed
    window.addEventListener('load', function() {
        const currentTime = new Date().getTime();
        const elapsedTime = currentTime - startTime;
        const remainingTime = Math.max(0, minPreloaderTime - elapsedTime);
        
        // Wacht de resterende tijd voordat de preloader wordt verborgen
        setTimeout(function() {
            preloader.classList.add('fade-out');
            // Na de fade-out animatie, verwijder de preloader volledig uit de DOM
            setTimeout(function() {
                preloader.style.display = 'none';
            }, 800);
        }, remainingTime);
    });
    
    // Als de pagina al geladen is wanneer de code wordt uitgevoerd, wacht alsnog minimaal 5 seconden
    if (document.readyState === 'complete') {
        const currentTime = new Date().getTime();
        const elapsedTime = currentTime - startTime;
        const remainingTime = Math.max(0, minPreloaderTime - elapsedTime);
        
        setTimeout(function() {
            preloader.classList.add('fade-out');
            setTimeout(function() {
                preloader.style.display = 'none';
            }, 800);
        }, remainingTime);
    }
    
    // GitHub username
    const githubUsername = 'T0m3YY';
    
    // Fetch GitHub profile data
    fetchGitHubProfile(githubUsername);
    
    // Fetch GitHub repositories
    fetchGitHubRepos(githubUsername);
    
    // Initialize Tech Radar
    initTechRadar();
    
    // Setup burger menu - verplaatst naar hoofdniveau
    setupBurgerMenu();
    
    // Function to fetch GitHub profile data
    function fetchGitHubProfile(username) {
        fetch(`https://api.github.com/users/${username}`)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(data => {
                // Update profile image
                const profileImage = document.querySelector('.about-image img');
                if (profileImage && data.avatar_url) {
                    profileImage.src = data.avatar_url;
                    profileImage.alt = data.name || username;
                }
                
                // Update name and bio if available
                const aboutText = document.querySelector('.about-text');
                if (aboutText) {
                    const nameElement = document.createElement('h2');
                    nameElement.textContent = data.name || username;
                    nameElement.className = 'github-name';
                    
                    // Replace or update the first paragraph with GitHub bio
                    const firstParagraph = aboutText.querySelector('p:first-of-type');
                    if (firstParagraph && data.bio) {
                        firstParagraph.textContent = data.bio;
                    }
                    
                    // Insert name before the first paragraph
                    if (firstParagraph && data.name) {
                        aboutText.insertBefore(nameElement, firstParagraph);
                    }
                }
            })
            .catch(error => {
                console.error('Error fetching GitHub profile:', error);
            });
    }

    // Function to fetch GitHub repositories
    function fetchGitHubRepos(username) {
        // Show loading indicator
        const portfolioGrid = document.querySelector('.portfolio-grid');
        if (portfolioGrid) {
            portfolioGrid.innerHTML = '<div class="loading">Loading projects</div>';
        }
        
        fetch(`https://api.github.com/users/${username}/repos?sort=updated&per_page=10`)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(repos => {
                // Process repositories and update portfolio section
                if (portfolioGrid) {
                    portfolioGrid.innerHTML = ''; // Clear existing content
                    
                    if (repos.length === 0) {
                        portfolioGrid.innerHTML = '<p>No repositories found.</p>';
                        return;
                    }
                    
                    // Get unique languages for filter buttons
                    const languages = new Set();
                    languages.add('all'); // Always include 'all' option
                    
                    repos.forEach(repo => {
                        if (repo.language) {
                            languages.add(repo.language.toLowerCase());
                        } else {
                            languages.add('other');
                        }
                    });
                    
                    // Update filter buttons
                    updateFilterButtons(Array.from(languages));
                    
                    // Create project cards
                    repos.forEach(repo => {
                        // Determine category based on language
                        let category = repo.language ? repo.language.toLowerCase() : 'other';
                        
                        // Create project card
                        const projectCard = document.createElement('div');
                        projectCard.className = 'project-card';
                        projectCard.setAttribute('data-category', category);
                        
                        // Removed the image and updated the card layout
                        projectCard.innerHTML = `
                            <div class="project-info">
                                <h3 class="project-title">${repo.name}</h3>
                                <p class="project-desc">${repo.description || 'No description available.'}</p>
                                <div class="project-meta">
                                    ${repo.language ? `<span class="project-language"><i class="fas fa-code"></i> ${repo.language}</span>` : ''}
                                    <span class="project-stars"><i class="fas fa-star"></i> ${repo.stargazers_count}</span>
                                    <span class="project-forks"><i class="fas fa-code-branch"></i> ${repo.forks_count}</span>
                                </div>
                                <div class="project-links">
                                    <a href="${repo.html_url}" target="_blank" class="project-link">
                                        <i class="fab fa-github"></i> GitHub
                                    </a>
                                    ${repo.homepage ? `<a href="${repo.homepage}" target="_blank" class="project-link">
                                        <i class="fas fa-external-link-alt"></i> Demo
                                    </a>` : ''}
                                </div>
                            </div>
                        `;
                        
                        portfolioGrid.appendChild(projectCard);
                    });
                    
                    // Initialize portfolio filtering
                    initPortfolioFilter();
                    
                    // Initialize scroll animations for the newly created cards
                    initScrollAnimations();
                }
            })
            .catch(error => {
                console.error('Error fetching GitHub repositories:', error);
                if (portfolioGrid) {
                    portfolioGrid.innerHTML = '<p>Error loading repositories. Please try again later.</p>';
                }
            });
    }

    // Function to update filter buttons based on available languages
    function updateFilterButtons(languages) {
        const filterButtonsContainer = document.querySelector('.filter-buttons');
        if (filterButtonsContainer) {
            filterButtonsContainer.innerHTML = ''; // Clear existing buttons
            
            languages.forEach(language => {
                const button = document.createElement('button');
                button.className = 'filter-btn';
                if (language === 'all') {
                    button.classList.add('active');
                }
                button.setAttribute('data-filter', language);
                
                // Capitalize first letter for display
                const displayName = language.charAt(0).toUpperCase() + language.slice(1);
                button.textContent = displayName;
                
                filterButtonsContainer.appendChild(button);
            });
        }
    }

    // Initialize portfolio filter functionality
    function initPortfolioFilter() {
        const filterButtons = document.querySelectorAll('.filter-btn');
        const projectCards = document.querySelectorAll('.project-card');
        
        filterButtons.forEach(button => {
            button.addEventListener('click', () => {
                // Remove active class from all buttons
                filterButtons.forEach(btn => btn.classList.remove('active'));
                
                // Add active class to clicked button
                button.classList.add('active');
                
                // Get filter value
                const filterValue = button.getAttribute('data-filter');
                
                // Show/hide projects based on filter
                projectCards.forEach(card => {
                    if (filterValue === 'all' || card.getAttribute('data-category') === filterValue) {
                        card.style.display = 'block';
                    } else {
                        card.style.display = 'none';
                    }
                });
            });
        });
    }

    // Burger Menu Functionaliteit - verbeterd en gecorrigeerd
    function setupBurgerMenu() {
        const burger = document.querySelector('.burger');
        const nav = document.querySelector('.nav-links');
        const navLinks = document.querySelectorAll('.nav-links li');
        const body = document.querySelector('body');
        
        if (!burger || !nav) {
            console.error('Burger menu elements not found');
            return;
        }
    
        // Toggle navigatie
        burger.addEventListener('click', () => {
            console.log('Burger clicked'); // Debug log
            nav.classList.toggle('nav-active');
            burger.classList.toggle('toggle');
            
            // Voorkom scrollen wanneer menu open is
            body.style.overflow = nav.classList.contains('nav-active') ? 'hidden' : '';
            
            // Animeer links
            navLinks.forEach((link, index) => {
                if (link.style.animation) {
                    link.style.animation = '';
                } else {
                    link.style.animation = `navLinkFade 0.5s ease forwards ${index / 7 + 0.3}s`;
                }
            });
        });
    
        // Sluit menu wanneer op een link wordt geklikt
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                nav.classList.remove('nav-active');
                burger.classList.remove('toggle');
                body.style.overflow = '';
                
                navLinks.forEach(link => {
                    link.style.animation = '';
                });
            });
        });
    }
    
    // Function to initialize Tech Radar
    function initTechRadar() {
        const techData = {
            ai: [
                {
                    name: "TensorFlow",
                    description: "Open-source machine learning framework developed by Google Brain team.",
                    icon: "fa-brain",
                    link: "https://www.tensorflow.org/"
                },
                {
                    name: "PyTorch",
                    description: "Open source machine learning library based on the Torch library.",
                    icon: "fa-fire",
                    link: "https://pytorch.org/"
                },
                {
                    name: "GPT-4",
                    description: "Advanced language model by OpenAI capable of understanding and generating human-like text.",
                    icon: "fa-robot",
                    link: "https://openai.com/gpt-4"
                },
                {
                    name: "Computer Vision",
                    description: "Field of AI that enables computers to derive meaningful information from digital images and videos.",
                    icon: "fa-eye",
                    link: "https://en.wikipedia.org/wiki/Computer_vision"
                }
            ],
            webdev: [
                {
                    name: "React",
                    description: "JavaScript library for building user interfaces, particularly single-page applications.",
                    icon: "fa-react",
                    link: "https://reactjs.org/"
                },
                {
                    name: "Next.js",
                    description: "React framework that enables server-side rendering and generating static websites.",
                    icon: "fa-n",
                    link: "https://nextjs.org/"
                },
                {
                    name: "Tailwind CSS",
                    description: "Utility-first CSS framework for rapidly building custom user interfaces.",
                    icon: "fa-wind",
                    link: "https://tailwindcss.com/"
                },
                {
                    name: "GraphQL",
                    description: "Query language for APIs and a runtime for executing those queries with your existing data.",
                    icon: "fa-project-diagram",
                    link: "https://graphql.org/"
                }
            ],
            security: [
                {
                    name: "Penetration Testing",
                    description: "Practice of testing a computer system, network or application to find security vulnerabilities.",
                    icon: "fa-user-secret",
                    link: "https://en.wikipedia.org/wiki/Penetration_test"
                },
                {
                    name: "Kali Linux",
                    description: "Debian-derived Linux distribution designed for digital forensics and penetration testing.",
                    icon: "fa-dragon",
                    link: "https://www.kali.org/"
                },
                {
                    name: "Wireshark",
                    description: "Free and open-source packet analyzer used for network troubleshooting and analysis.",
                    icon: "fa-network-wired",
                    link: "https://www.wireshark.org/"
                },
                {
                    name: "Blockchain Security",
                    description: "Practices to protect blockchain applications from threats and vulnerabilities.",
                    icon: "fa-link",
                    link: "https://en.wikipedia.org/wiki/Blockchain_security"
                }
            ],
            hardware: [
                {
                    name: "Raspberry Pi",
                    description: "Series of small single-board computers developed in the UK by the Raspberry Pi Foundation.",
                    icon: "fa-microchip",
                    link: "https://www.raspberrypi.org/"
                },
                {
                    name: "Arduino",
                    description: "Open-source electronics platform based on easy-to-use hardware and software.",
                    icon: "fa-cogs",
                    link: "https://www.arduino.cc/"
                },
                {
                    name: "IoT Devices",
                    description: "Physical objects with sensors, processing ability, software, and other technologies.",
                    icon: "fa-wifi",
                    link: "https://en.wikipedia.org/wiki/Internet_of_things"
                },
                {
                    name: "3D Printing",
                    description: "Process of making three dimensional solid objects from a digital file.",
                    icon: "fa-cube",
                    link: "https://en.wikipedia.org/wiki/3D_printing"
                }
            ]
        };

        // Display tech cards for the active category
        displayTechCards('ai'); // Default category

        // Auto-rotate categories every 15 seconds
        const categories = ['ai', 'webdev', 'security', 'hardware'];
        let currentCategoryIndex = 0;
        
        // Start the rotation interval
        const rotationInterval = setInterval(() => {
            currentCategoryIndex = (currentCategoryIndex + 1) % categories.length;
            const nextCategory = categories[currentCategoryIndex];
            
            // Update active tab
            const categoryTabs = document.querySelectorAll('.category-tab');
            categoryTabs.forEach(tab => {
                tab.classList.remove('active');
                if (tab.getAttribute('data-category') === nextCategory) {
                    tab.classList.add('active');
                }
            });
            
            // Display the next category
            displayTechCards(nextCategory);
        }, 15000); // 15 seconds
        
        // Store the interval ID in a variable attached to the window object
        // so it can be cleared if needed (e.g., when navigating away)
        window.techRadarRotationInterval = rotationInterval;

        // Add event listeners to category tabs
        const categoryTabs = document.querySelectorAll('.category-tab');
        categoryTabs.forEach(tab => {
            tab.addEventListener('click', function() {
                // Clear the auto-rotation when user manually selects a tab
                clearInterval(window.techRadarRotationInterval);
                
                // Remove active class from all tabs
                categoryTabs.forEach(t => t.classList.remove('active'));
                
                // Add active class to clicked tab
                this.classList.add('active');
                
                // Get category and display corresponding tech cards
                const category = this.getAttribute('data-category');
                displayTechCards(category);
                
                // Update current index for when rotation restarts
                currentCategoryIndex = categories.indexOf(category);
                
                // Restart the rotation after user interaction
                window.techRadarRotationInterval = setInterval(() => {
                    currentCategoryIndex = (currentCategoryIndex + 1) % categories.length;
                    const nextCategory = categories[currentCategoryIndex];
                    
                    // Update active tab
                    categoryTabs.forEach(tab => {
                        tab.classList.remove('active');
                        if (tab.getAttribute('data-category') === nextCategory) {
                            tab.classList.add('active');
                        }
                    });
                    
                    // Display the next category
                    displayTechCards(nextCategory);
                }, 15000);
            });
        });

        // Function to display tech cards for a specific category
        function displayTechCards(category) {
            const techGrid = document.querySelector('.tech-grid');
            if (!techGrid) return;
            
            techGrid.innerHTML = ''; // Clear existing cards
            
            // Check if category exists in techData
            if (!techData[category] || techData[category].length === 0) {
                techGrid.innerHTML = '<p>No technologies found for this category.</p>';
                return;
            }
            
            // Create and append tech cards
            techData[category].forEach(tech => {
                const techCard = document.createElement('div');
                techCard.className = 'tech-card';
                
                // Check if icon is a Font Awesome icon
                const iconClass = tech.icon.startsWith('fa-') ? `fas ${tech.icon}` : tech.icon;
                
                techCard.innerHTML = `
                    <div class="tech-icon"><i class="${iconClass}"></i></div>
                    <h3 class="tech-name">${tech.name}</h3>
                    <p class="tech-desc">${tech.description}</p>
                    <a href="${tech.link}" target="_blank" class="tech-link">Learn more <i class="fas fa-arrow-right"></i></a>
                `;
                
                techGrid.appendChild(techCard);
            });
        }
    }
    
    // Initialize scroll animations
    initScrollAnimations();
    
    // Function to initialize scroll animations
    function initScrollAnimations() {
        // Get all project cards
        const projectCards = document.querySelectorAll('.project-card');
        
        // Create an Intersection Observer
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                // If the element is in the viewport
                if (entry.isIntersecting) {
                    // Add the animation class
                    entry.target.classList.add('animate');
                    // Stop observing the element after it's animated
                    observer.unobserve(entry.target);
                }
            });
        }, {
            root: null, // Use the viewport as the root
            threshold: 0.1, // Trigger when at least 10% of the element is visible
            rootMargin: '0px 0px -50px 0px' // Adjust the trigger point (negative value means "before it's fully visible")
        });
        
        // Observe each project card
        projectCards.forEach(card => {
            observer.observe(card);
            
            // Add a small delay for each card to create a staggered effect
            const delay = Array.from(projectCards).indexOf(card) * 100; // 100ms delay between each card
            card.style.transitionDelay = `${delay}ms`;
        });
    }
    
    // Function to fetch GitHub repositories
    function fetchGitHubRepos(username) {
        // Show loading indicator
        const portfolioGrid = document.querySelector('.portfolio-grid');
        if (portfolioGrid) {
            portfolioGrid.innerHTML = '<div class="loading">Loading projects</div>';
        }
        
        fetch(`https://api.github.com/users/${username}/repos?sort=updated&per_page=10`)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(repos => {
                // Process repositories and update portfolio section
                if (portfolioGrid) {
                    portfolioGrid.innerHTML = ''; // Clear existing content
                    
                    if (repos.length === 0) {
                        portfolioGrid.innerHTML = '<p>No repositories found.</p>';
                        return;
                    }
                    
                    // Get unique languages for filter buttons
                    const languages = new Set();
                    languages.add('all'); // Always include 'all' option
                    
                    repos.forEach(repo => {
                        if (repo.language) {
                            languages.add(repo.language.toLowerCase());
                        } else {
                            languages.add('other');
                        }
                    });
                    
                    // Update filter buttons
                    updateFilterButtons(Array.from(languages));
                    
                    // Create project cards
                    repos.forEach(repo => {
                        // Determine category based on language
                        let category = repo.language ? repo.language.toLowerCase() : 'other';
                        
                        // Create project card
                        const projectCard = document.createElement('div');
                        projectCard.className = 'project-card';
                        projectCard.setAttribute('data-category', category);
                        
                        // Removed the image and updated the card layout
                        projectCard.innerHTML = `
                            <div class="project-info">
                                <h3 class="project-title">${repo.name}</h3>
                                <p class="project-desc">${repo.description || 'No description available.'}</p>
                                <div class="project-meta">
                                    ${repo.language ? `<span class="project-language"><i class="fas fa-code"></i> ${repo.language}</span>` : ''}
                                    <span class="project-stars"><i class="fas fa-star"></i> ${repo.stargazers_count}</span>
                                    <span class="project-forks"><i class="fas fa-code-branch"></i> ${repo.forks_count}</span>
                                </div>
                                <div class="project-links">
                                    <a href="${repo.html_url}" target="_blank" class="project-link">
                                        <i class="fab fa-github"></i> GitHub
                                    </a>
                                    ${repo.homepage ? `<a href="${repo.homepage}" target="_blank" class="project-link">
                                        <i class="fas fa-external-link-alt"></i> Demo
                                    </a>` : ''}
                                </div>
                            </div>
                        `;
                        
                        portfolioGrid.appendChild(projectCard);
                    });
                    
                    // Initialize portfolio filtering
                    initPortfolioFilter();
                    
                    // Initialize scroll animations for the newly created cards
                    initScrollAnimations();
                }
            })
            .catch(error => {
                console.error('Error fetching GitHub repositories:', error);
                if (portfolioGrid) {
                    portfolioGrid.innerHTML = '<p>Error loading repositories. Please try again later.</p>';
                }
            });
    }
});