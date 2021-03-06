function init() {
	let scene = new THREE.Scene();
	let gui = new dat.GUI();

	// initialize objects
	let sphereMaterial = getMaterial('standard', 'rgb(255, 255, 255)');
	let sphere = getSphere(sphereMaterial, 1, 24);

	let planeMaterial = getMaterial('standard', 'rgb(255, 255, 255)');
	let plane = getPlane(planeMaterial, 300);

	let lightLeft = getSpotLight(1, 'rgb(255, 220, 180)');
	let lightRight = getSpotLight(1, 'rgb(255, 220, 180)');

	// manipulate objects
	sphere.position.y = sphere.geometry.parameters.radius;
	plane.rotation.x = Math.PI/2;

	lightLeft.position.x = -5;
	lightLeft.position.y = 2;
	lightLeft.position.z = -4;

	lightRight.position.x = 5;
	lightRight.position.y = 2;
	lightRight.position.z = -4;

	
	// manipulate materials
	
	//load CubeMap
	let path = 'assets/cubemap/';
	let format = '.jpg';
	let urls = [
		path + 'px' + format, path + 'nx' + format,
		path + 'py' + format, path + 'ny' + format,
		path + 'pz' + format, path + 'nz' + format,
	];

	let reflectionCube = new THREE.CubeTextureLoader().load(urls);
	reflectionCube.format = THREE.RGBFormat;

	scene.background = reflectionCube;

	let loader = new THREE.TextureLoader();
	planeMaterial.map = loader.load('/assets/textures/concrete.jpg');
	planeMaterial.bumpMap = loader.load('/assets/textures/concrete.jpg');
	planeMaterial.roughnessMap = loader.load('/assets/textures/concrete.jpg');
	planeMaterial.envMap = reflectionCube;
	sphereMaterial.roughnessMap = loader.load('/assets/textures/fingerprints.jpg');
	sphereMaterial.envMap = reflectionCube;


	planeMaterial.bumpScale = 0.01;
	planeMaterial.metalness= 0.1;
	planeMaterial.roughness = 0.7;



	let maps =['map', 'bumpMap','roughnessMap'];

	maps.forEach(mapName => {
		let texture =	planeMaterial[mapName];
		texture.wrapS = THREE.RepeatWrapping;
		texture.wrapT = THREE.RepeatWrapping;
		texture.repeat.set(15, 15);
	});



	// dat.gui
	let folder1 = gui.addFolder('light_1');
	folder1.add(lightLeft, 'intensity', 0, 10);
	folder1.add(lightLeft.position, 'x', -5, 15);
	folder1.add(lightLeft.position, 'y', -5, 15);
	folder1.add(lightLeft.position, 'z', -5, 15);

	let folder2 = gui.addFolder('light_2');
	folder2.add(lightRight, 'intensity', 0, 10);
	folder2.add(lightRight.position, 'x', -5, 15);
	folder2.add(lightRight.position, 'y', -5, 15);
	folder2.add(lightRight.position, 'z', -5, 15);

	let folder3 = gui.addFolder('materials');
	folder3.add(sphereMaterial, 'roughness', 0, 1);
	folder3.add(planeMaterial, 'roughness', 0, 1);
	folder3.add(sphereMaterial, 'metalness', 0, 1);
	folder3.add(planeMaterial, 'metalness', 0, 1);
	folder3.open();

	

	// add objects to the scene
	scene.add(sphere);
	scene.add(plane);
	scene.add(lightLeft);
	scene.add(lightRight);

	// camera
	let camera = new THREE.PerspectiveCamera(
		45, // field of view
		window.innerWidth / window.innerHeight, // aspect ratio
		1, // near clipping plane
		1000 // far clipping plane
	);
	camera.position.z = 7;
	camera.position.x = -2;
	camera.position.y = 7;
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

function getSphere(material, size, segments) {
	let geometry = new THREE.SphereGeometry(size, segments, segments);
	let obj = new THREE.Mesh(geometry, material);
	obj.castShadow = true;

	return obj;
}

function getMaterial(type, color) {
	let selectedMaterial;
	let materialOptions = {
		color: color === undefined ? 'rgb(255, 255, 255)' : color,
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

function getSpotLight(intensity, color) {
	color = color === undefined ? 'rgb(255, 255, 255)' : color;
	let light = new THREE.SpotLight(color, intensity);
	light.castShadow = true;
	light.penumbra = 0.5;

	//Set up shadow properties for the light
	light.shadow.mapSize.width = 2048;  // default: 512
	light.shadow.mapSize.height = 2048; // default: 512
	light.shadow.bias = 0.001;

	return light;
}

function getPlane(material, size) {
	let geometry = new THREE.PlaneGeometry(size, size);
	material.side = THREE.DoubleSide;
	let obj = new THREE.Mesh(geometry, material);
	obj.receiveShadow = true;

	return obj;
}

function update(renderer, scene, camera, controls) {
	controls.update();
	renderer.render(scene, camera);
	requestAnimationFrame(function() {
		update(renderer, scene, camera, controls);
	});
}

let scene = init();
