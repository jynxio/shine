import "@/style/reset.css";
import Wave from "@/component/Wave.js";
import Font from "@/component/Font.js";
import * as three from "three";

/* Base */
const size = { x: globalThis.innerWidth, y: globalThis.innerHeight };
const canvas = document.createElement( "canvas" );
const renderer = new three.WebGLRenderer( { canvas, antialias: true } );

renderer.setSize( size.x, size.y );
renderer.setPixelRatio( Math.min( globalThis.devicePixelRatio, 2 ) );
document.body.prepend( canvas );

const scene = new three.Scene();
const camera = new three.OrthographicCamera( - size.x / 2, size.x / 2, size.y / 2, - size.y / 2, 0.1, 10 );

/* Wave */
const wave = new Wave( size.x, size.y );

wave.setPosition( 0, 0, - 2 );
scene.add( wave.getEntity() );

/* Font */
const fontName = new Font( {
	message: "JYN\nXIO",
	height: Math.max( size.x, size.y ) * 0.1,
	space: Math.max( size.x, size.y ) * 0.1 * 0.1,
	thickness: 1.5,
	type: "outline",
	position: [ 0, 0, - 1 ],
} );

scene.add( fontName.getEntity() );

const fontOption = {
	height: size.y * 0.0135,
	space: size.y * 0.0135 * 0.1,
	type: "fillline",
};
const fontIdeas = new Font( {
	message: "IDEAS",
	height: fontOption.height,
	space: fontOption.space,
	type: fontOption.type,
	position: [ 0, - size.y / 2 + size.y * 0.12 + 0, - 1 ],
} );
const fontPosts = new Font( {
	message: "POSTS",
	height: fontOption.height,
	space: fontOption.space,
	type: fontOption.type,
	position: [ 0, - size.y / 2 + size.y * 0.12 - fontOption.height * 2, - 1 ],
} );
const fontGithub = new Font( {
	message: "GITHUB",
	height: fontOption.height,
	space: fontOption.space,
	type: fontOption.type,
	position: [ 0, - size.y / 2 + size.y * 0.12 - fontOption.height * 4, - 1 ],
} );

scene.add(
	fontGithub.getEntity(),
	fontIdeas.getEntity(),
	fontPosts.getEntity(),
);
document.body.append(
	fontGithub.getDom(),
	fontIdeas.getDom(),
	fontPosts.getDom(),
);
fontGithub.getDom().addEventListener( "click", _ => globalThis.location.href = "https://github.com/jynxio" );
fontPosts.getDom().addEventListener( "click", _ => globalThis.location.href += "catalogue.html" );

/* Animate */
const clock = new three.Clock();

renderer.setAnimationLoop( _ => {

	const elapsedTime = clock.getElapsedTime();

	wave.setTime( elapsedTime );
	renderer.render( scene, camera );

} );

/* Resize */
globalThis.addEventListener( "resize", _ => {

	size.x = globalThis.innerWidth;
	size.y = globalThis.innerHeight;

	renderer.setSize( size.x, size.y );
	renderer.setPixelRatio( Math.min( globalThis.devicePixelRatio, 2 ) );

	camera.left = - size.x / 2;
	camera.right = size.x / 2;
	camera.top = size.y / 2;
	camera.bottom = - size.y / 2;
	camera.updateProjectionMatrix();

	wave.setSize( size.x, size.y );
	wave.setResolution( size.x, size.y );

	fontName.setScale( Math.max( size.x, size.y ) * 0.1 / fontName.getHeight() );

	fontIdeas.setScale( size.y * 0.0135 / fontIdeas.getHeight() );
	fontIdeas.setPosition( 0, - size.y / 2 + size.y * 0.12 + fontIdeas.getScale() * fontIdeas.getHeight() * 0, - 1 );
	fontIdeas.updateDom();

	fontPosts.setScale( size.y * 0.0135 / fontPosts.getHeight() );
	fontPosts.setPosition( 0, - size.y / 2 + size.y * 0.12 - fontPosts.getScale() * fontPosts.getHeight() * 2, - 1 );
	fontPosts.updateDom();

	fontGithub.setScale( size.y * 0.0135 / fontGithub.getHeight() );
	fontGithub.setPosition( 0, - size.y / 2 + size.y * 0.12 - fontGithub.getScale() * fontGithub.getHeight() * 4, - 1 );
	fontGithub.updateDom();

} );
