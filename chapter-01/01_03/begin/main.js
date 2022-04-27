

function init(){
    var scene = new THREE.Scene();

    let enableFog = false;
    if (enableFog) {
        scene.fog = new THREE.FogExp2(0xffffff, 0.2);
    }

    let box = getBox(1, 1, 1);
    let plane = getPlane(20);
    let PointLight = getPointLight(1);
    let sphere = getSphere(0.05);

    plane.name = 'plane-1';

    box.position.y = box.geometry.parameters.height/2;
    plane.rotation.x = Math.PI/2;
    PointLight.position.y = 2; 


    scene.add(box);
    scene.add(plane);
    PointLight.add(sphere);
    scene.add(PointLight);

    var camera = new THREE.PerspectiveCamera(45, window.innerWidth/window.innerHeight, 1, 100);

    
    
    camera.position.x = 1;
    camera.position.y = 2;
    camera.position.z = 5;

    camera.lookAt(new THREE.Vector3(0,0,0));

    var renderer = new THREE.WebGLRenderer();

    renderer.setClearColor('rgb(120, 120, 120)');
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.getElementById('webgl').appendChild(renderer.domElement);

    update(renderer, scene, camera);
    
    return scene;
}

function getBox(w, h, d){
    let geometry = new THREE.BoxGeometry(w, h, d );
    let material =   new THREE.MeshPhongMaterial({
        color : 'rgb(120, 120, 120)'
    });

    let mesh = new THREE.Mesh(
        geometry,
        material
    );

    return mesh;
}


function getSphere(size){
    let geometry = new THREE.SphereGeometry(size, 24, 24 );
    let material =   new THREE.MeshBasicMaterial({
        color : 'rgb(255, 255, 255)'
    });

    let mesh = new THREE.Mesh(
        geometry,
        material
    );

    return mesh;
}


function getPlane(size){
    let geometry = new THREE.PlaneGeometry(size, size);
    let material =   new THREE.MeshPhongMaterial({
        color : 'rgb(120, 120, 120)' , 
        side : THREE.DoubleSide
    });

    let mesh = new THREE.Mesh(
        geometry,
        material
    );

    return mesh;
}

function getPointLight(intesity) {

    let light = new THREE.PointLight(0xffffff, intesity);
    return light;

}


function update ( renderer, scene, camera){
    renderer.render(
        scene, 
        camera,
    );


    let plane = scene.getObjectByName('plane-1')

    requestAnimationFrame(function(){
        update(renderer, scene, camera);
    })
}

let scene = init();

