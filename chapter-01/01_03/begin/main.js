

function init(){
    var scene = new THREE.Scene();

    let box = getBox(1, 1, 1);
    let plane = getPlane(4);

    plane.name = 'plane-1';

    box.position.y = box.geometry.parameters.height/2;
    plane.rotation.x = Math.PI/2;
    plane.rotation.y = 1;

    plane.add(box);
    scene.add(plane);

    var camera = new THREE.PerspectiveCamera(45, window.innerWidth/window.innerHeight, 1, 100);

    
    
    camera.position.x = 1;
    camera.position.y = 2;
    camera.position.z = 5;

    camera.lookAt(new THREE.Vector3(0,0,0));

    var renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.getElementById('webgl').appendChild(renderer.domElement);

    update(renderer, scene, camera);
    
    return scene;
}

function getBox(w, h, d){
    let geometry = new THREE.BoxGeometry(w, h, d );
    let material =   new THREE.MeshBasicMaterial({
        color : 0x00ff00
    });

    let mesh = new THREE.Mesh(
        geometry,
        material
    );

    return mesh;
}


function getPlane(size){
    let geometry = new THREE.PlaneGeometry(size, size);
    let material =   new THREE.MeshBasicMaterial({
        color : 0xff0000 , 
        side : THREE.DoubleSide
    });

    let mesh = new THREE.Mesh(
        geometry,
        material
    );

    return mesh;
}


function update ( renderer, scene, camera){
    renderer.render(
        scene, 
        camera,
    );


    let plane = scene.getObjectByName('plane-1')

    plane.rotation.y += 0.001;
    plane.rotation.z += 0.001;

    scene.traverse(function(child){
        child.scale.x += 0.001;
    })
    requestAnimationFrame(function(){
        update(renderer, scene, camera);
    })
}

let scene = init();

