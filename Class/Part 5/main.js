function init() {
	let scene = new THREE.Scene();

	// camera
	let camera = new THREE.PerspectiveCamera(
		45, // field of view
		window.innerWidth / window.innerHeight, // aspect ratio
		1, // near clipping plane
		1000 // far clipping plane
	);
	camera.position.z = 30;
	camera.position.x = 0;
	camera.position.y = 1;
	camera.lookAt(new THREE.Vector3(0, 0, 0));



	let particaleMaterial = new THREE.PointsMaterial({
		color:'rgb(255,255,255)',
		size: 0.25 ,
		map: new THREE.TextureLoader().load('assets/textures/particle.jpg'),
		transparent: true,
		blending : THREE.AdditiveBlending ,
		depthWrite : false,
	});

	let particaleGeo = new THREE.SphereGeometry(10, 64, 64);

	particaleGeo.vertices.forEach(vertex => {
		vertex.x += (Math.random()- 0.5);
		vertex.y += (Math.random()- 0.5);
		vertex.z += (Math.random()- 0.5);
	});


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

	particalSystem.rotation.y += 0.0005;

	particalSystem.geometry.verticesNeedUpdate = true;

	requestAnimationFrame(function() {
		update(renderer, scene, camera, controls);
	});
}

let scene = init();
