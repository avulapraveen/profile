document.addEventListener('DOMContentLoaded', () => {
    // Mobile menu functionality
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const navList = document.querySelector('.nav-list');

    mobileMenuBtn.addEventListener('click', () => {
        navList.classList.toggle('active');
        document.body.classList.toggle('menu-open');
    });

    // Network Animation with Three.js
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ 
        alpha: true,
        antialias: true 
    });
    
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    document.getElementById('network-animation').appendChild(renderer.domElement);

    // Create network nodes and connections
    const geometry = new THREE.SphereGeometry(0.3, 32, 32);
    const material = new THREE.MeshBasicMaterial({ 
        color: 0xffffff,
        transparent: true,
        opacity: 0.7
    });
    
    const nodes = [];
    const connections = [];
    const nodeCount = window.innerWidth < 768 ? 30 : 50;
    
    // Create random nodes
    for(let i = 0; i < nodeCount; i++) {
        const node = new THREE.Mesh(geometry, material);
        node.position.x = Math.random() * 40 - 20;
        node.position.y = Math.random() * 40 - 20;
        node.position.z = Math.random() * 40 - 20;
        node.userData = {
            originalPosition: node.position.clone(),
            speed: Math.random() * 0.02 - 0.01
        };
        nodes.push(node);
        scene.add(node);
    }

    // Create connections between nodes
    const lineMaterial = new THREE.LineBasicMaterial({ 
        color: 0x4A90E2,
        transparent: true,
        opacity: 0.2
    });
    
    for(let i = 0; i < nodes.length; i++) {
        for(let j = i + 1; j < nodes.length; j++) {
            if(Math.random() > 0.85) {
                const geometry = new THREE.BufferGeometry().setFromPoints([
                    nodes[i].position,
                    nodes[j].position
                ]);
                const line = new THREE.Line(geometry, lineMaterial);
                connections.push({
                    line: line,
                    start: nodes[i],
                    end: nodes[j]
                });
                scene.add(line);
            }
        }
    }

    camera.position.z = 30;

    // Mouse interaction
    const mouse = new THREE.Vector2();
    let mouseX = 0;
    let mouseY = 0;

    document.addEventListener('mousemove', (event) => {
        mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
        mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
        mouseX = event.clientX;
        mouseY = event.clientY;
    });

    // Animation loop
    function animate() {
        requestAnimationFrame(animate);
        
        // Update nodes
        nodes.forEach(node => {
            node.position.y += node.userData.speed;
            if(node.position.y > 20) node.position.y = -20;
            if(node.position.y < -20) node.position.y = 20;
        });

        // Update connections
        connections.forEach(connection => {
            connection.line.geometry.setFromPoints([
                connection.start.position,
                connection.end.position
            ]);
        });

        // Rotate scene slightly based on mouse position
        scene.rotation.x += (mouse.y * 0.01 - scene.rotation.x) * 0.01;
        scene.rotation.y += (mouse.x * 0.01 - scene.rotation.y) * 0.01;

        renderer.render(scene, camera);
    }

    animate();

    // Handle window resize
    window.addEventListener('resize', () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    });
});