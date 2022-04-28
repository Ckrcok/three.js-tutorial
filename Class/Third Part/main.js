function init() {
	let scene = new THREE.Scene();

	// initialize objects
	let planeMaterial = getMaterial('basic', 'rgb(255, 255, 255)');
	let plane = getPlane(planeMaterial, 30, 60);

	// manipulate objects
	plane.rotation.x = Math.PI/2;
	plane.rotation.z = Math.PI/4;

	// add objects to the scene
	scene.add(plane);

	// camera
	let camera = new THREE.PerspectiveCamera(
		45, // field of view
		window.innerWidth / window.innerHeight, // aspect ratio
		1, // near clipping plane
		1000 // far clipping plane
	);
	camera.position.z = 20;
	camera.position.x = 0;
	camera.position.y = 5;
	camera.lookAt(new THREE.Vector3(0, 0, 0));

	// renderer
	let renderer = new THREE.WebGLRenderer();
	renderer.setSize(window.innerWidth, window.innerHeight);
	renderer.shadowMap.enabled = true;
	document.getElementById('webgl').appendChild(renderer.domElement);

	let controls = new THREE.OrbitControls( camera, renderer.domElement );

	update(renderer, scene, camera, controls);

	return scene;
}

function getPlane(material, size, segments) {
	let geometry = new THREE.PlaneGeometry(size, size, segments, segments);
	material.side = THREE.DoubleSide;
	let obj = new THREE.Mesh(geometry, material);
	obj.receiveShadow = true;
	obj.castShadow = true;

	return obj;
}

function getMaterial(type, color) {
	let selectedMaterial;
	let materialOptions = {
		color: color === undefined ? 'rgb(255, 255, 255)' : color,
		wireframe: true,
	};

	switch (type) {
		case 'basic':
			selectedMaterial = new THREE.MeshBasicMaterial(materialOptions);
			break;
		case 'lambert':
			selectedMaterial = new THREE.MeshLambertMaterial(materialOptions);
			break;
		case 'phong':
			selectedMaterial = new THREE.MeshPhongMaterial(materialOptions);
			break;
		case 'standard':
			selectedMaterial = new THREE.MeshStandardMaterial(materialOptions);
			break;
		default: 
			selectedMaterial = new THREE.MeshBasicMaterial(materialOptions);
			break;
	}

	return selectedMaterial;
}

function update(renderer, scene, camera, controls) {
	controls.update();

	renderer.render(scene, camera);
	requestAnimationFrame(function() {
		update(renderer, scene, camera, controls);
	});
}

let scene = init();
