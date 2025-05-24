// Mobile menu functionality
const mobileMenuBtn = document.getElementById('mobileMenuBtn');
const mobileNav = document.getElementById('mobileNav');

mobileMenuBtn.addEventListener('click', () => {
    mobileNav.classList.toggle('active');
});

// Smooth scrolling for navigation links
function scrollToSection(sectionId) {
    const element = document.getElementById(sectionId);
    if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
    }
    // Close mobile menu if open
    mobileNav.classList.remove('active');
}

// Add click listeners to navigation links
document.querySelectorAll('.nav-link, .mobile-nav-link').forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        const sectionId = link.getAttribute('data-section');
        scrollToSection(sectionId);
    });
});

// Active section tracking
function updateActiveSection() {
    const sections = ['home', 'courses', 'testimonials', 'about', 'contact'];
    const scrollPosition = window.scrollY + 100;

    for (const section of sections) {
        const element = document.getElementById(section);
        if (element) {
            const offsetTop = element.offsetTop;
            const offsetHeight = element.offsetHeight;

            if (scrollPosition >= offsetTop && scrollPosition < offsetTop + offsetHeight) {
                // Remove active class from all nav links
                document.querySelectorAll('.nav-link').forEach(link => {
                    link.classList.remove('active');
                });
                
                // Add active class to current section link
                const activeLink = document.querySelector(`[data-section="${section}"]`);
                if (activeLink) {
                    activeLink.classList.add('active');
                }
                break;
            }
        }
    }
}

// Listen for scroll events
window.addEventListener('scroll', updateActiveSection);

// Contact form submission
document.querySelector('.contact-form').addEventListener('submit', (e) => {
    e.preventDefault();
    alert('Thank you for your message! We\'ll get back to you within 24 hours.');
});

// Three.js Scene Setup
function initThreeJS() {
    const container = document.getElementById('threejs-container');
    if (!container) return;

    // Scene setup
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, container.offsetWidth / container.offsetHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    
    renderer.setSize(container.offsetWidth, container.offsetHeight);
    renderer.setClearColor(0x000000, 0);
    container.appendChild(renderer.domElement);

    // Create cyber shield geometry
    const shieldGeometry = new THREE.Group();

    // Main shield shape
    const mainShield = new THREE.RingGeometry(1, 2, 6);
    const shieldMaterial = new THREE.MeshBasicMaterial({
        color: 0x22c55e,
        transparent: true,
        opacity: 0.8,
        wireframe: true
    });
    const shieldMesh = new THREE.Mesh(mainShield, shieldMaterial);
    shieldGeometry.add(shieldMesh);

    // Inner core
    const coreGeometry = new THREE.SphereGeometry(0.5, 16, 16);
    const coreMaterial = new THREE.MeshBasicMaterial({
        color: 0x3b82f6,
        transparent: true,
        opacity: 0.6,
        wireframe: true
    });
    const coreMesh = new THREE.Mesh(coreGeometry, coreMaterial);
    shieldGeometry.add(coreMesh);

    // Outer rings
    for (let i = 0; i < 3; i++) {
        const ringGeometry = new THREE.RingGeometry(2.5 + i * 0.5, 2.7 + i * 0.5, 32);
        const ringMaterial = new THREE.MeshBasicMaterial({
            color: i % 2 === 0 ? 0x22c55e : 0xa855f7,
            transparent: true,
            opacity: 0.3,
            wireframe: true
        });
        const ringMesh = new THREE.Mesh(ringGeometry, ringMaterial);
        ringMesh.rotation.x = Math.PI / 2;
        ringMesh.rotation.z = (i * Math.PI) / 6;
        shieldGeometry.add(ringMesh);
    }

    // Network nodes
    const nodeGeometry = new THREE.SphereGeometry(0.1, 8, 8);
    const nodeMaterial = new THREE.MeshBasicMaterial({ color: 0x00ff7f });
    
    for (let i = 0; i < 20; i++) {
        const node = new THREE.Mesh(nodeGeometry, nodeMaterial);
        node.position.set(
            (Math.random() - 0.5) * 8,
            (Math.random() - 0.5) * 8,
            (Math.random() - 0.5) * 8
        );
        shieldGeometry.add(node);
    }

    // Network connections
    const lineMaterial = new THREE.LineBasicMaterial({
        color: 0x22c55e,
        transparent: true,
        opacity: 0.3
    });

    for (let i = 0; i < 15; i++) {
        const points = [];
        points.push(new THREE.Vector3(
            (Math.random() - 0.5) * 6,
            (Math.random() - 0.5) * 6,
            (Math.random() - 0.5) * 6
        ));
        points.push(new THREE.Vector3(
            (Math.random() - 0.5) * 6,
            (Math.random() - 0.5) * 6,
            (Math.random() - 0.5) * 6
        ));
        
        const lineGeometry = new THREE.BufferGeometry().setFromPoints(points);
        const line = new THREE.Line(lineGeometry, lineMaterial);
        shieldGeometry.add(line);
    }

    scene.add(shieldGeometry);

    // Position camera
    camera.position.z = 8;
    camera.position.y = 2;

    // Animation loop
    function animate() {
        requestAnimationFrame(animate);

        // Rotate the entire shield group
        shieldGeometry.rotation.y += 0.005;
        shieldGeometry.rotation.x += 0.002;

        // Pulse the core
        const time = Date.now() * 0.001;
        coreMesh.scale.setScalar(1 + Math.sin(time * 2) * 0.1);

        // Rotate individual rings
        shieldGeometry.children.forEach((child, index) => {
            if (child.geometry instanceof THREE.RingGeometry) {
                child.rotation.z += 0.01 * (index % 2 === 0 ? 1 : -1);
            }
        });

        renderer.render(scene, camera);
    }

    animate();

    // Handle window resize
    function handleResize() {
        const width = container.offsetWidth;
        const height = container.offsetHeight;
        
        camera.aspect = width / height;
        camera.updateProjectionMatrix();
        renderer.setSize(width, height);
    }

    window.addEventListener('resize', handleResize);

    // Add glow effect
    const glowMaterial = new THREE.MeshBasicMaterial({
        color: 0x22c55e,
        transparent: true,
        opacity: 0.1
    });
    
    const glowGeometry = new THREE.SphereGeometry(5, 32, 32);
    const glowMesh = new THREE.Mesh(glowGeometry, glowMaterial);
    scene.add(glowMesh);

    // Animate glow
    function animateGlow() {
        const time = Date.now() * 0.001;
        glowMesh.scale.setScalar(1 + Math.sin(time) * 0.1);
        glowMaterial.opacity = 0.05 + Math.sin(time * 2) * 0.05;
    }

    // Add glow animation to main loop
    const originalAnimate = animate;
    animate = function() {
        originalAnimate();
        animateGlow();
    };
}

// Initialize Three.js when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    initThreeJS();
});

// Intersection Observer for scroll animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Observe elements for animation
document.addEventListener('DOMContentLoaded', () => {
    const animatedElements = document.querySelectorAll('.course-card, .testimonial-card, .feature-item');
    
    animatedElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });
});