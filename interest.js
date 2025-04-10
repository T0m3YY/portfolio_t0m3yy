// Initialize all interest section effects
document.addEventListener('DOMContentLoaded', function() {
    // 3D Cube for Quantum Levitation
    initQuantumCube();
    
    // Parallax effect for Software Development
    initParallaxEffect();
    
    // Tech icons hover effects (replacing morphing effect)
    initTechIcons();
    
    // Security particles for Cybersecurity
    initSecurityParticles();
    
    // Highlight items hover effects
    initHighlightItems();
});

// Tech icons hover effects (replacing morphing effect)
function initTechIcons() {
    // Add hover effects to tech icons
    const techIcons = document.querySelectorAll('.tech-icon-item');
    techIcons.forEach(icon => {
        icon.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-5px)';
            this.style.boxShadow = '0 15px 30px rgba(0, 0, 0, 0.15)';
        });
        
        icon.addEventListener('mouseleave', function() {
            this.style.transform = 'scale(1)';
            this.style.boxShadow = '0 5px 15px rgba(0, 0, 0, 0.08)';
        });
    });
}

// Highlight items hover effects
function initHighlightItems() {
    const highlightItems = document.querySelectorAll('.highlight-item');
    highlightItems.forEach(item => {
        item.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-3px)';
            this.style.boxShadow = '0 5px 15px rgba(0, 0, 0, 0.1)';
        });
        
        item.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
            this.style.boxShadow = 'none';
        });
    });
}

// 3D Cube for Quantum Levitation
function initQuantumCube() {
    const cube = document.querySelector('.quantum-cube');
    if (!cube) return;
    
    let rotateY = 0;
    let rotateX = 0;
    let autoRotate = true;
    
    // Auto rotation
    function autoRotateCube() {
        if (autoRotate) {
            rotateY += 0.5;
            cube.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
            requestAnimationFrame(autoRotateCube);
        }
    }
    autoRotateCube();
    
    // Manual rotation on mouse move
    const scene = document.querySelector('.scene');
    if (scene) {
        scene.addEventListener('mousemove', function(e) {
            autoRotate = false;
            
            const rect = this.getBoundingClientRect();
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            
            const mouseX = e.clientX - rect.left;
            const mouseY = e.clientY - rect.top;
            
            rotateY = ((mouseX - centerX) / centerX) * 45;
            rotateX = ((centerY - mouseY) / centerY) * 45;
            
            cube.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
        });
        
        scene.addEventListener('mouseleave', function() {
            autoRotate = true;
            autoRotateCube();
        });
    }
}

// Parallax effect for Software Development
function initParallaxEffect() {
    const parallaxInterest = document.querySelector('.parallax-interest');
    if (!parallaxInterest) return;
    
    function updateParallax() {
        const rect = parallaxInterest.getBoundingClientRect();
        if (rect.top < window.innerHeight && rect.bottom > 0) {
            const scrollPosition = window.scrollY;
            const parallaxLayers = document.querySelectorAll('.dev-layer-1, .dev-layer-2, .dev-layer-3');
            
            parallaxLayers.forEach((layer, index) => {
                const speed = (index + 1) * 0.2;
                const yPos = (scrollPosition - parallaxInterest.offsetTop) * speed;
                layer.style.transform = `translateY(${yPos}px)`;
            });
        }
    }
    
    window.addEventListener('scroll', updateParallax);
    updateParallax(); // Initial call to set positions
    
    // Add hover effect to dev tools
    const devTools = document.querySelectorAll('.dev-tool');
    devTools.forEach(tool => {
        tool.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-10px)';
        });
        
        tool.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
        });
    });
}

// Security particles for Cybersecurity
function initSecurityParticles() {
    const securityContainer = document.querySelector('.security-particles-container');
    if (!securityContainer || typeof particlesJS === 'undefined') return;
    
    // Create a unique ID for this particles container
    const particlesId = 'security-particles';
    securityContainer.id = particlesId;
    
    particlesJS(particlesId, {
        "particles": {
            "number": {
                "value": 60,
                "density": {
                    "enable": true,
                    "value_area": 800
                }
            },
            "color": {
                "value": ["#00ff00", "#ff0000", "#ffffff", "#00ffff"]
            },
            "shape": {
                "type": "circle",
                "stroke": {
                    "width": 0,
                    "color": "#000000"
                }
            },
            "opacity": {
                "value": 0.5,
                "random": true
            },
            "size": {
                "value": 3,
                "random": true
            },
            "line_linked": {
                "enable": true,
                "distance": 150,
                "color": "#00ff00",
                "opacity": 0.4,
                "width": 1
            },
            "move": {
                "enable": true,
                "speed": 3,
                "direction": "none",
                "random": true,
                "straight": false,
                "out_mode": "bounce"
            }
        },
        "interactivity": {
            "detect_on": "canvas",
            "events": {
                "onhover": {
                    "enable": true,
                    "mode": "repulse"
                },
                "onclick": {
                    "enable": true,
                    "mode": "push"
                }
            },
            "modes": {
                "repulse": {
                    "distance": 100,
                    "duration": 0.4
                },
                "push": {
                    "particles_nb": 4
                }
            }
        }
    });
    
    // Animate the security info text like a terminal
    const securityInfo = document.querySelector('.security-info');
    if (securityInfo) {
        const spans = securityInfo.querySelectorAll('span');
        spans.forEach((span, index) => {
            setTimeout(() => {
                span.style.opacity = '1';
            }, index * 800);
        });
        
        // Periodically update the "scanning" text
        let scanCount = 0;
        setInterval(() => {
            const scanSpan = spans[0];
            if (scanSpan) {
                scanCount = (scanCount + 1) % 4;
                let dots = '.'.repeat(scanCount);
                scanSpan.textContent = `Scanning network: 192.168.1.0/24${dots}`;
            }
        }, 500);
    }
}

// Smooth scrolling for "Explore Effect" buttons
function initSmoothScrolling() {
    document.querySelectorAll('.interactive-btn').forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 100,
                    behavior: 'smooth'
                });
            }
        });
    });
}
