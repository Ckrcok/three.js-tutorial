function init() {
	let scene = new THREE.Scene();

	// camera
	let camera = new THREE.PerspectiveCamera(
		45, // field of view
		window.innerWidth / window.innerHeight, // aspect ratio
		1, // near clipping plane
		1000 // far clipping plane
	);
	camera.position.z = 0;
	camera.position.x = 0;
	camera.position.y = 1;
	camera.lookAt(new THREE.Vector3(0, 0, 0));


	let particaleGeo = new THREE.Geometry();
	let particaleMaterial = new THREE.PointsMaterial({
		color:'rgb(255,255,255)',
		size: 1 ,
		map: new THREE.TextureLoader().load('assets/textures/particle.jpg'),
		transparent: true,
		blending : THREE.AdditiveBlending ,
		depthWrite : false,
	});
	
	let particalCount = 20000;
	let particalDistance = 100;


	for (let i = 0; i < particalCount ; i++) {
		let posX = (Math.random()-0.5) * particalDistance;
		let posY= (Math.random()-0.5) * particalDistance;
		let posZ = (Math.random()-0.5) * particalDistance;
		let partical = new THREE.Vector3(posX, posY, posZ);

		particaleGeo.vertices.push(partical);
	}

	let particalSystem = new THREE.Points(
		particaleGeo,
		particaleMaterial
	);

	particalSystem.name = 'particalSystem';

	scene.add(particalSystem);

	// renderer
	let renderer = new THREE.WebGLRenderer();
	renderer.setSize(window.innerWidth, window.innerHeight);
	renderer.shadowMap.enabled = true;
	renderer.setClearColor('rgb(20, 20, 20)');

	let controls = new THREE.OrbitControls( camera, renderer.domElement );

	document.getElementById('webgl').appendChild(renderer.domElement);

	update(renderer, scene, camera, controls);

	return scene;
}


function update(renderer, scene, camera, controls) {
	controls.update();
	renderer.render(scene, camera);
	
	let particalSystem =  scene.getObjectByName('particalSystem');
	particalSystem.rotation.z += 0.0009;
	particalSystem.geometry.vertices.forEach(particle => {
		particle.x += (Math.random()-1) * 0.1 ;
		particle.y += (Math.random()- 0.75)  * 0.1 ;
		particle.z += (Math.random()) * 0.1 ;

		if (particle.x < -50) {
			particle.x = 50;
		}
		if (particle.y < -50) {
			particle.y = 50;
		}
		if (particle.z < -50) {
			particle.z = 50;
		}
		if (particle.z > 50) {
			particle.z = -50;
		}
	})

	particalSystem.geometry.verticesNeedUpdate = true;

	requestAnimationFrame(function() {
		update(renderer, scene, camera, controls);
	});
}

let scene = init();
