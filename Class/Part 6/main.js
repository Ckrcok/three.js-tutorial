function init() {
	// scene
	let scene = new THREE.Scene();
	let gui = new dat.GUI();
	let clock = new THREE.Clock();

	// add geometry
	let plane = getPlane(50);
	let directionalLight = getDirectionalLight();
	let boxGrid = getBoxGrid(20, 2.5);

	plane.name = 'plane-1';
	boxGrid.name = 'boxGrid-1';

	// manipulate geometry
	plane.rotation.x = Math.PI/2;
	directionalLight.position.x = 26;
	directionalLight.position.y = 20;
	directionalLight.position.z = 20;

	// add geometry to the scene
	scene.add(plane);
	scene.add(directionalLight);
	scene.add(boxGrid);

	let enableFog = false;
	if (enableFog) {
		scene.fog = new THREE.FogExp2('rgb(220, 220, 220)', 0.02);
	}

	// camera
	let camera = new THREE.PerspectiveCamera(
		45, // field of view
		window.innerWidth / window.innerHeight, // aspect ratio
		1, // near clipping plane
		1000 // far clipping plane
	);

	camera.position.z = -60;
	camera.position.x = 45;
	camera.position.y = 45;
	camera.lookAt(new THREE.Vector3(0, 0, 0));

	// renderer
	let renderer = new THREE.WebGLRenderer();
	renderer.shadowMap.enabled = true;
	renderer.setSize(window.innerWidth, window.innerHeight);
	renderer.setClearColor('rgb(220, 220, 220)');
	document.getElementById('webgl').appendChild(renderer.domElement);
	

	let composer = new THREE.EffectComposer(renderer);
	let renderPass = new THREE.RenderPass(scene, camera);
	composer.addPass(renderPass);

	let vignetteEffect = new THREE.ShaderPass(THREE.VignetteShader);
	vignetteEffect.uniforms['darkness'].value = 2;
	composer.addPass(vignetteEffect);


	let rgbShiftShader = new THREE.ShaderPass(THREE.RGBShiftShader);
	rgbShiftShader.uniforms['amount'].value = 0.003;
	rgbShiftShader.renderToScreen = true;
	composer.addPass(rgbShiftShader);

	// controls
	let controls = new THREE.OrbitControls(camera, renderer.domElement);

	update(composer, scene, camera, controls, clock);

	return scene;
}

function getDirectionalLight() {
	let light = new THREE.DirectionalLight(0xffffff, 1.5);
	light.castShadow = true;
	let shadowMapSize = 30;

	//Set up shadow properties for the light
	light.shadow.mapSize.width = 2048;
	light.shadow.mapSize.height = 2048;

	light.shadow.camera.left = -shadowMapSize;
	light.shadow.camera.bottom = -shadowMapSize;
	light.shadow.camera.right = shadowMapSize;
	light.shadow.camera.top = shadowMapSize;

	return light;
}

function getBox(w, h, d) {
	let geometry = new THREE.BoxGeometry(w, h, d);
	let material = new THREE.MeshPhongMaterial({
		color: 'rgb(120, 120, 120)',
	});
	let obj = new THREE.Mesh(geometry, material);
	obj.castShadow = true;

	return obj;
}

function getBoxGrid(amount, separationMultiplier) {
	let group = new THREE.Group();

	for (let i=0; i<amount; i++) {
		let obj = getBox(1, 2.5, 1);
		obj.position.x = i * separationMultiplier;
		obj.position.y = obj.geometry.parameters.height/2;
		group.add(obj);
		for (let j=1; j<amount; j++) {
			let obj = getBox(1, 2.5, 1);
			obj.position.x = i * separationMultiplier;
			obj.position.y = obj.geometry.parameters.height/2;
			obj.position.z = j * separationMultiplier;
			group.add(obj);
		}
	}

	group.position.x = -(separationMultiplier * (amount-1))/2;
	group.position.z = -(separationMultiplier * (amount-1))/2;

	return group;
}

function getPlane(size) {
	let geometry = new THREE.PlaneGeometry(size, size);
	let material = new THREE.MeshPhongMaterial({
		color: 'rgb(120, 120, 120)', 
		side: THREE.DoubleSide
	});
	let obj = new THREE.Mesh(geometry, material);
	obj.receiveShadow = true;

	return obj;
}

function update(renderer, scene, camera, controls, clock) {
	renderer.render(scene, camera);
	controls.update();
	let timeElapsed = clock.getElapsedTime();

	let boxGrid = scene.getObjectByName('boxGrid-1');
	boxGrid.children.forEach(function(child, index) {
		let noiseAmount = noise.simplex2(timeElapsed + index, timeElapsed + index) + 1;
		child.scale.y = noiseAmount;
		child.position.y = child.scale.y/2 * child.geometry.parameters.height;
	});
	
	requestAnimationFrame(function() {
		update(renderer, scene, camera, controls, clock);
	});
}

let scene = init();